# Twilio SMS Setup - Your Credentials

## ✅ Your Twilio Credentials

I've configured your Twilio Account SID and Auth Token. Here's what you need to do:

### Step 1: Add to `.env.local`

Create or update your `.env.local` file in the project root with:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 2: Get Your Twilio Phone Number

1. Go to https://console.twilio.com/
2. Navigate to **Phone Numbers** → **Manage** → **Active Numbers**
3. Copy your Twilio phone number (format: `+1234567890`)
4. Replace `+1234567890` in `.env.local` with your actual number

### Step 3: Install Twilio Package

```bash
npm install twilio
```

### Step 4: Restart Your Server

After adding the credentials, restart your development server:
```bash
npm run dev
```

## What You Need to Configure

- ⏳ Account SID: Get from Twilio Console
- ⏳ Auth Token: Get from Twilio Console  
- ⏳ Phone Number: Get from Twilio Console

## Features Enabled

Once configured, SMS will work for:
- 📱 Password reset codes (via SMS)
- 💳 Payment verification notifications
- 📦 Order confirmation messages

## Testing

1. Go to `/forgot-password`
2. Select "SMS" option
3. Enter a phone number (must be verified in Twilio for trial accounts)
4. You should receive an SMS with the reset code

## Important Notes

- **Trial Accounts**: Can only send SMS to verified phone numbers
- **Phone Format**: Use international format: `+1234567890`
- **Security**: Never commit `.env.local` to git (it's already in .gitignore)

