# SMTP Configuration Guide

This guide will help you configure SMTP settings for sending emails from your application.

## Environment Variables

Add these to your `.env.local` file:

```env
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@example.com
```

## Popular SMTP Providers

### 1. Gmail (Recommended for Testing)

**Settings:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

**Setup Steps:**
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to "App Passwords" (https://myaccount.google.com/apppasswords)
4. Generate an app password for "Mail"
5. Use the 16-character app password (not your regular password)

**Note:** Gmail has sending limits (500 emails/day for free accounts)

---

### 2. Outlook/Hotmail

**Settings:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
```

**Setup Steps:**
1. Use your regular Outlook password
2. May require enabling "Less secure app access" in account settings

---

### 3. Yahoo Mail

**Settings:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@yahoo.com
```

**Setup Steps:**
1. Go to Yahoo Account Security
2. Generate an app password
3. Use the app password (not your regular password)

---

### 4. SendGrid (Recommended for Production)

**Settings:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=your-verified-email@example.com
```

**Setup Steps:**
1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create an API key in Settings > API Keys
3. Verify your sender email address
4. Use `apikey` as the username and your API key as the password

---

### 5. Mailgun (Recommended for Production)

**Settings:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM=your-verified-email@yourdomain.com
```

**Setup Steps:**
1. Sign up at https://mailgun.com (free tier: 5,000 emails/month)
2. Verify your domain or use sandbox domain for testing
3. Get SMTP credentials from Settings > Sending > SMTP credentials

---

### 6. AWS SES (Amazon Simple Email Service)

**Settings:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
SMTP_FROM=your-verified-email@example.com
```

**Setup Steps:**
1. Sign up for AWS SES
2. Verify your email address or domain
3. Create SMTP credentials in SES Console
4. Use the provided SMTP endpoint for your region

---

### 7. Resend (Modern Email API)

**Settings:**
```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=your-resend-api-key
SMTP_FROM=your-verified-email@example.com
```

**Setup Steps:**
1. Sign up at https://resend.com (free tier: 3,000 emails/month)
2. Get your API key from dashboard
3. Verify your domain or email

---

## Testing Your Configuration

### Development Mode

In development, if SMTP is not configured, the system will:
- Log emails to the console
- Show reset codes in the browser
- Simulate successful email sending

### Production Mode

In production, make sure to:
1. Set all SMTP environment variables
2. Test email sending before going live
3. Monitor email delivery rates
4. Set up email bounce handling

## Example .env.local File

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# SMTP Configuration (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=youremail@gmail.com

# Site URL
NEXTAUTH_URL=http://localhost:3000
```

## Security Notes

1. **Never commit `.env.local` to git** - it's already in `.gitignore`
2. **Use app passwords** - Don't use your main account password
3. **Rotate credentials** - Change passwords periodically
4. **Use environment variables** - Never hardcode credentials

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check username and password are correct
   - For Gmail, make sure you're using an app password, not your regular password
   - Verify 2FA is enabled (for Gmail)

2. **"Connection timeout"**
   - Check firewall settings
   - Verify SMTP_HOST and SMTP_PORT are correct
   - Try port 465 with `secure: true` instead

3. **"Email not sending"**
   - Check spam folder
   - Verify sender email is verified (for some providers)
   - Check sending limits haven't been exceeded

4. **"Module not found: nodemailer"**
   - Run: `npm install nodemailer`

## Quick Start (Gmail)

1. Enable 2-Step Verification on your Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=youremail@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx
   SMTP_FROM=youremail@gmail.com
   ```
4. Restart your development server
5. Test by requesting a password reset

## Free SMTP Services Comparison

| Service | Free Tier | Best For |
|---------|-----------|----------|
| Gmail | 500/day | Testing, Personal |
| SendGrid | 100/day | Small Projects |
| Mailgun | 5,000/month | Medium Projects |
| Resend | 3,000/month | Modern Apps |
| AWS SES | 62,000/month* | Large Scale |

*After moving out of sandbox

