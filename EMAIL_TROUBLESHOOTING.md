# Email Troubleshooting Guide

## Quick Check: Is Email Working?

### Step 1: Check Server Console Logs

When you request a password reset, check your **server console** (where you run `npm run dev`). You should see:

```
📧 Email configuration check:
  - SMTP_HOST: ✓ Set (or ✗ Not set)
  - SMTP_PORT: ✓ Set (or ✗ Not set)
  - SMTP_USER: ✓ Set (or ✗ Not set)
  - SMTP_PASSWORD: ✓ Set (or ✗ Not set)
```

### Step 2: Check for Reset Code

If SMTP is **NOT configured**, you'll see:
```
📧 [MOCK EMAIL] To: your-email@example.com
📧 [MOCK EMAIL] RESET CODE: 123456
```

**This means:** Email is not configured, but the code is shown in console for testing.

### Step 3: Check Browser Console

Open browser DevTools (F12) → Console tab. You should see:
```
🔑 [DEV] Password Reset Code: 123456
```

### Step 4: Check Toast Notification

In development mode, the toast notification will show:
- **If email configured:** "Reset code sent! Check your email. DEV CODE: 123456"
- **If email NOT configured:** "Email not configured. DEV CODE: 123456 (Check server console)"

## Common Issues

### Issue 1: "Email not configured" Message

**Solution:** Add SMTP settings to `.env.local`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=Luxury Shop <your-email@gmail.com>
```

Then install nodemailer:
```bash
npm install nodemailer
```

### Issue 2: Email Sent but Not Received

**Check:**
1. Spam/Junk folder
2. Server console for any error messages
3. SMTP credentials are correct
4. For Gmail: Using App Password (not regular password)

### Issue 3: No Code Visible

**In Development Mode:**
- Check server console - code is always logged there
- Check browser console - code should appear
- Check toast notification - code should be shown

**The reset code is ALWAYS available in development mode, even if email fails!**

## Testing Without Email Configuration

Even without SMTP configured, you can test password reset:

1. Request password reset
2. Check server console for: `📧 [MOCK EMAIL] RESET CODE: XXXXXX`
3. Use that code on the reset password page
4. It will work perfectly!

## Production Mode

In production (`NODE_ENV=production`):
- Emails MUST be configured
- Codes are NOT shown in console
- Real emails are sent via SMTP

## Quick Test

1. Go to `/forgot-password`
2. Enter your email
3. Click "Send Reset Code"
4. **Immediately check:**
   - Server console for the code
   - Browser console for the code
   - Toast notification for the code
5. Use the code on `/reset-password` page

The code is **always available** in development mode for testing!

