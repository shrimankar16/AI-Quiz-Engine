# ✨ AI Setup Instructions - Get FREE Google Gemini Working!

## 🎯 Quick Summary
Your app supports **3 AI providers**. Google Gemini is **100% FREE** and recommended!

---

## Option 1: Google Gemini (FREE & RECOMMENDED) ⭐

### Why Gemini?
- ✅ **100% FREE** - No credit card required
- ✅ **15 requests/minute** - Perfect for quiz generation  
- ✅ **No billing setup** - Just get the key
- ✅ **Fast & reliable** - Powered by Google

### How to Setup (2 minutes):

1. **Get FREE API Key:**
   - Go to: https://aistudio.google.com/app/apikey
   - Click "Get API Key" or "Create API key in new project"
   - Copy your key (starts with `AIza...`)

2. **Add to your `.env` file:**
   ```env
   GOOGLE_GEMINI_API_KEY=AIzaSyC_paste_your_key_here
   AI_DEFAULT_PROVIDER=gemini
   ```

3. **Done!** Restart server and it works!

---

## Option 2: Anthropic Claude (PAID)

**Cost:** ~$0.003 per 1000 input tokens, $0.015 per 1000 output tokens

### Setup:
1. Get API key from: https://console.anthropic.com/
2. Add to `.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   AI_DEFAULT_PROVIDER=anthropic
   ```

---

## Option 3: OpenAI GPT-4 (PAID)

**Cost:** ~$0.03 per 1000 input tokens, $0.06 per 1000 output tokens

### Setup:
1. Get API key from: https://platform.openai.com/api-keys
2. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   AI_DEFAULT_PROVIDER=openai
   ```

---

## Current Status

Check your `.env` file:

```bash
# If you see this, Gemini is configured and ready!
GOOGLE_GEMINI_API_KEY=AIzaSyC...
AI_DEFAULT_PROVIDER=gemini
```

---

## Testing AI Generation

1. Start your server: `npm run server`
2. Login as a teacher
3. Create or edit an exam
4. Click "Generate Questions with AI"
5. Fill in:
   - **Topic**: "JavaScript Basics"
   - **Question Type**: Multiple Choice
   - **Number of Questions**: 5
   - **Difficulty**: 3 (Medium)
6. Click "Generate" - questions appear in seconds!

---

## Troubleshooting

### Error: "API key not configured"
**Solution:** 
- Open `.env` file
- Add `GOOGLE_GEMINI_API_KEY=your-key-here`
- Make sure `AI_DEFAULT_PROVIDER=gemini`
- Restart server

### Error: "Failed to generate questions"
**Solution:**
1. Check internet connection
2. Verify API key is correct
3. Check console logs for detailed error
4. Make sure you have the package installed:
   ```bash
   npm install @google/generative-ai
   ```

### Rate Limit Errors
**Solution:**
- Gemini allows 15 requests/minute
- Wait 60 seconds and try again
- Our app already has rate limiting built-in

---

## Need More Help?

- **Gemini Documentation**: https://ai.google.dev/docs
- **Get Gemini API Key**: https://aistudio.google.com/app/apikey
- **Check `GEMINI_SETUP.md`** for detailed instructions
- **Check `QUICK_START_GEMINI.md`** for fastest setup

---

## Recommended Setup for This Project

```env
# Use Gemini - it's FREE and works great!
GOOGLE_GEMINI_API_KEY=your_key_from_google_ai_studio
AI_DEFAULT_PROVIDER=gemini
AI_RATE_LIMIT_PER_MINUTE=15
AI_DAILY_BUDGET=0.00
```

That's it! Your AI-powered quiz generator is ready! 🎉
