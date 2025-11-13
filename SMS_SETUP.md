# SMS Setup Guide (Twilio Integration)

This guide will help you set up SMS functionality for password reset and other features.

## Step 1: Create a Twilio Account

1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Sign up for a free account (includes $15.50 credit for testing)
3. Verify your email and phone number

## Step 2: Get Your Twilio Credentials

1. After logging in, go to the **Console Dashboard**
2. You'll see your **Account SID** and **Auth Token**
3. Copy these values (keep them secure!)

## Step 3: Get a Phone Number

1. In the Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number (free trial accounts can get a number for testing)
3. Note: Trial accounts can only send SMS to verified phone numbers
4. Copy the phone number (format: +1234567890)

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## Step 5: Install Twilio Package

```bash
npm install twilio
```

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Go to the login page and click "Forgot password?"
3. Select "SMS" option
4. Enter a phone number (must be verified in Twilio for trial accounts)
5. Check your phone for the reset code

## Development Mode

In development mode, if Twilio is not configured, the system will:
- Log SMS messages to the console instead of sending them
- Still allow password reset functionality for testing
- Show mock SMS messages in the server logs

## Production Considerations

1. **Upgrade Twilio Account**: Free trial accounts have limitations. Upgrade for production use.
2. **Phone Number Format**: The system automatically formats phone numbers to E.164 format (+country code + number)
3. **Rate Limiting**: Consider implementing rate limiting for password reset requests
4. **Security**: Never commit your Twilio credentials to version control
5. **Cost**: Twilio charges per SMS sent. Monitor usage in the Twilio Console

## Troubleshooting

### SMS Not Sending
- Check that all environment variables are set correctly
- Verify your Twilio account is active
- For trial accounts, ensure the recipient phone number is verified
- Check Twilio Console for error logs

### Invalid Phone Number Format
- The system automatically formats numbers, but ensure the input is valid
- Use international format: +1234567890
- Remove spaces, dashes, and parentheses

### Reset Code Not Working
- Codes expire after 1 hour
- Each code can only be used once
- Check server logs for any errors

## Alternative SMS Providers

If you prefer a different SMS provider, you can modify `lib/sms.ts` to use:
- AWS SNS
- Vonage (formerly Nexmo)
- MessageBird
- Or any other SMS API

The interface is simple - just implement the `sendSMS` function with the same signature.

