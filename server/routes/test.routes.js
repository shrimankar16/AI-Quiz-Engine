import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// Test Anthropic API connection
router.get('/anthropic-test', async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return res.status(400).json({
        error: 'ANTHROPIC_API_KEY not found in environment',
        envVars: Object.keys(process.env).filter(k => k.includes('ANTHROPIC')),
      });
    }

    console.log('Testing Anthropic API...');
    console.log('API Key present:', !!apiKey);
    console.log('API Key length:', apiKey?.length);
    console.log('API Key prefix:', apiKey?.substring(0, 10));

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'Say "Hello from QuizForge!" and nothing else.',
      }],
    });

    res.json({
      success: true,
      message: 'Anthropic API is working!',
      response: message.content[0].text,
      model: message.model,
      usage: message.usage,
    });

  } catch (error) {
    console.error('Anthropic Test Error:', error);
    res.status(500).json({
      error: 'Anthropic API test failed',
      message: error.message,
      type: error.type,
      status: error.status,
    });
  }
});

export default router;
