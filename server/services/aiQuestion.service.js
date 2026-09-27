import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const rateLimitCache = new Map();

const checkRateLimit = (userId) => {
  const key = `ai_rate_limit:${userId}`;
  const now = Date.now();
  const userRequests = rateLimitCache.get(key) || [];
  
  const recentRequests = userRequests.filter(time => now - time < 60000);
  const limit = parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || 30);
  
  if (recentRequests.length >= limit) {
    throw new AppError(`Rate limit exceeded. Maximum ${limit} requests per minute.`, 429);
  }
  
  recentRequests.push(now);
  rateLimitCache.set(key, recentRequests);
};

const checkDailyBudget = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayUsage = await prisma.aiUsage.findMany({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });
  
  const todayCost = todayUsage.reduce((sum, u) => sum + parseFloat(u.cost), 0);
  const dailyBudget = parseFloat(process.env.AI_DAILY_BUDGET || 5.0);
  
  if (todayCost >= dailyBudget) {
    throw new AppError(
      `Daily AI budget exceeded. Used $${todayCost.toFixed(2)} of $${dailyBudget.toFixed(2)}`,
      429
    );
  }
};

const calculateCost = (usage, provider) => {
  const promptTokens = usage.prompt_tokens || usage.input_tokens || 0;
  const completionTokens = usage.completion_tokens || usage.output_tokens || 0;
  
  const pricing = {
    gemini: { prompt: 0.0, completion: 0.0 }, // FREE up to 15 requests/min!
    anthropic: { prompt: 0.003, completion: 0.015 },
    openai: { prompt: 0.03, completion: 0.06 },
  };
  
  const rates = pricing[provider] || pricing.gemini;
  return ((promptTokens * rates.prompt) + (completionTokens * rates.completion)) / 1000;
};

const trackUsage = async (userId, usage, provider, model) => {
  const cost = calculateCost(usage, provider);
  
  await prisma.aiUsage.create({
    data: {
      userId,
      provider,
      model,
      promptTokens: usage.prompt_tokens || usage.input_tokens || 0,
      completionTokens: usage.completion_tokens || usage.output_tokens || 0,
      cost,
    },
  });
  
  return cost;
};

const generateWithAnthropic = async (prompt) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AppError('Anthropic API key not configured', 500);
  }

  const anthropic = new Anthropic({ apiKey });
  
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });
  
  return {
    content: message.content[0].text,
    usage: {
      prompt_tokens: message.usage.input_tokens,
      completion_tokens: message.usage.output_tokens,
    },
    model: message.model,
  };
};

const generateWithOpenAI = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AppError('OpenAI API key not configured', 500);
  }

  const openai = new OpenAI({ apiKey });
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });
  
  return {
    content: response.choices[0].message.content,
    usage: response.usage,
    model: response.model,
  };
};

const generateWithGemini = async (prompt) => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppError(
      'Google Gemini API key not configured. Get one FREE at: https://aistudio.google.com/app/apikey',
      500
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  // Estimate tokens (Gemini doesn't provide exact counts)
  const promptTokens = Math.ceil(prompt.length / 4);
  const completionTokens = Math.ceil(text.length / 4);
  
  return {
    content: text,
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
    },
    model: 'gemini-1.5-flash',
  };
};

export const generateQuestionsWithAI = async (req, res, next) => {
  try {
    console.log('🤖 AI Generation Request:', req.body);
    console.log('📋 User ID:', req.user.id);
    console.log('🔑 API Key present:', !!process.env.ANTHROPIC_API_KEY);
    console.log('🔧 Provider:', process.env.AI_DEFAULT_PROVIDER);
    
    const { topic, type, count, difficulty } = req.body;
    
    if (!topic || !type || !count || !difficulty) {
      throw new AppError('Missing required fields: topic, type, count, difficulty', 400);
    }
    
    if (count < 1 || count > 20) {
      throw new AppError('Count must be between 1 and 20', 400);
    }
    
    if (difficulty < 1 || difficulty > 5) {
      throw new AppError('Difficulty must be between 1 and 5', 400);
    }
    
    console.log('✅ Validation passed');
    
    checkRateLimit(req.user.id);
    console.log('✅ Rate limit check passed');
    
    await checkDailyBudget(req.user.id);
    console.log('✅ Budget check passed');
    
    const difficultyLabels = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Medium',
      4: 'Hard',
      5: 'Expert',
    };
    
    const typeInstructions = {
      multiple_choice: 'For each question, provide exactly 4 options as an array and specify which one is correct.',
      true_false: 'For each question, create a statement that can be answered with "True" or "False".',
      short_answer: 'For each question, provide a clear, concise correct answer (1-3 words).',
    };
    
    const prompt = `You are an expert quiz question generator. Generate high-quality, educational quiz questions.

Generate exactly ${count} ${typeInstructions[type]} questions about: ${topic}

Difficulty level: ${difficultyLabels[difficulty]}

Rules:
1. Questions must be clear, unambiguous, and educationally valuable
2. For multiple choice, ensure all 4 options are plausible but only one is correct
3. Avoid trick questions or ambiguous wording
4. Return ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "question": "What is the question text?",
      "type": "${type}",
      "options": ${type === 'multiple_choice' ? '["Option A", "Option B", "Option C", "Option D"]' : type === 'true_false' ? '["True", "False"]' : 'null'},
      "correctAnswer": "The correct answer"
    }
  ]
}`;
    
    const provider = process.env.AI_DEFAULT_PROVIDER || 'anthropic';
    console.log('🚀 Calling', provider, 'API...');
    let response;
    
    try {
      if (provider === 'gemini') {
        console.log('📞 Calling Google Gemini API (FREE)...');
        response = await generateWithGemini(prompt);
        console.log('✅ Gemini API response received');
      } else if (provider === 'anthropic') {
        console.log('📞 Calling Anthropic API...');
        response = await generateWithAnthropic(prompt);
        console.log('✅ Anthropic API response received');
      } else if (provider === 'openai') {
        console.log('📞 Calling OpenAI API...');
        response = await generateWithOpenAI(prompt);
        console.log('✅ OpenAI API response received');
      } else {
        throw new AppError(`Invalid AI provider: ${provider}. Use "gemini", "anthropic", or "openai"`, 500);
      }
    } catch (aiError) {
      console.error('❌ AI Generation Error:', aiError);
      console.error('Error details:', {
        message: aiError.message,
        status: aiError.status,
        type: aiError.type,
        stack: aiError.stack,
      });
      throw new AppError(aiError.message || 'Failed to connect to AI service. Please check your API key.', 500);
    }
    
    let questions;
    try {
      console.log('📝 Parsing response...');
      console.log('Response content preview:', response.content.substring(0, 200));
      
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ No JSON found in response:', response.content);
        throw new Error('No JSON found in response');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      questions = parsed.questions;
      
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions array in response');
      }
      
      console.log(`✅ Successfully parsed ${questions.length} questions`);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      console.error('Response content:', response.content);
      throw new AppError('Failed to parse AI response. Please try again.', 500);
    }
    
    console.log('💾 Tracking usage...');
    await trackUsage(req.user.id, response.usage, provider, response.model);
    console.log('✅ Usage tracked successfully');
    
    console.log('🎉 Questions generated successfully!');
    res.json({
      message: 'Questions generated successfully',
      questions,
    });
    
  } catch (error) {
    next(error);
  }
};
