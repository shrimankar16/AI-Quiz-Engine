# How to Get FREE Google Gemini API Key

Google Gemini is **completely FREE** with generous limits (15 requests per minute) - perfect for this quiz application!

## Step 1: Get Your FREE API Key

1. Go to **Google AI Studio**: https://aistudio.google.com/app/apikey

2. Click **"Get API Key"** or **"Create API Key"**

3. Select **"Create API key in new project"** (or choose existing project)

4. Copy your API key (starts with `AIza...`)

## Step 2: Add API Key to Your Application

Open the `.env` file in your project root and add your API key:

```env
# Get FREE API key from: https://aistudio.google.com/app/apikey
GOOGLE_GEMINI_API_KEY=AIzaSyC_your_actual_api_key_here

# Set Gemini as default provider (it's FREE!)
AI_DEFAULT_PROVIDER=gemini
```

## Step 3: Save and Restart

1. Save the `.env` file
2. Restart your server: `npm run server`
3. That's it! AI question generation will now use Gemini

## Gemini Benefits

✅ **100% FREE** - No credit card required
✅ **15 requests/minute** - More than enough for quiz generation
✅ **Fast & reliable** - Powered by Google
✅ **No billing setup needed** - Just get the key and use it

## Rate Limits

- **Free tier**: 15 requests per minute (RPM)
- **Quota resets**: Every 60 seconds
- Perfect for generating quiz questions!

## Troubleshooting

### Error: "API key not configured"
- Make sure you added `GOOGLE_GEMINI_API_KEY=` in your `.env` file
- Check that API key starts with `AIza`
- No spaces around the `=` sign

### Error: "403 Forbidden"
- Make sure you've enabled the Generative Language API in Google Cloud Console
- Check that your API key is active

### Error: "429 Too Many Requests"
- You've hit the rate limit (15 requests/minute)
- Wait 60 seconds and try again
- Our app has built-in rate limiting to prevent this

## Need Help?

- Google AI Studio: https://aistudio.google.com
- Gemini API Docs: https://ai.google.dev/docs
- Get Support: https://ai.google.dev/support

## Alternative Providers

If you prefer, you can also use:
- **Anthropic Claude** (paid, excellent quality)
- **OpenAI GPT-4** (paid, very popular)

Just change `AI_DEFAULT_PROVIDER` in `.env` to `anthropic` or `openai` and add the respective API key.
