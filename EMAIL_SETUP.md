# Email Setup Guide (SMTP Configuration)

This guide will help you set up email functionality for password reset and other features.

## Option 1: Gmail SMTP (Easiest for Testing)

### Step 1: Enable App Password in Gmail

1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **App passwords** (under 2-Step Verification)
4. Create a new app password for "Mail"
5. Copy the 16-character password

### Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
SMTP_FROM=Luxury Shop <your-email@gmail.com>
```

## Option 2: Other SMTP Providers

### SendGrid

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

### Mailgun

```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM=noreply@yourdomain.com
```

### Outlook/Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
```

### Custom SMTP Server

```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587  # or 465 for SSL
SMTP_USER=your-username
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@yourdomain.com
```

## Step 3: Install Nodemailer Package

```bash
npm install nodemailer
```

## Step 4: Test the Setup

1. Start your development server: `npm run dev`
2. Go to the login page and click "Forgot password?"
3. Select "Email" option
4. Enter your email address
5. Check your inbox for the reset code

## Development Mode

In development mode, if SMTP is not configured, the system will:
- Log email content to the console instead of sending it
- Still allow password reset functionality for testing
- Show mock email messages in the server logs

## Production Considerations

1. **Use a Professional Email Service**: For production, use services like SendGrid, Mailgun, or AWS SES
2. **SPF/DKIM Records**: Configure DNS records for better email deliverability
3. **Rate Limiting**: Consider implementing rate limiting for password reset requests
4. **Security**: Never commit your SMTP credentials to version control
5. **Monitoring**: Monitor email delivery rates and bounce rates

## Troubleshooting

### Email Not Sending
- Check that all environment variables are set correctly
- Verify SMTP credentials are correct
- Check firewall/network settings
- Review server logs for error messages
- For Gmail: Ensure "Less secure app access" is enabled OR use App Password

### Authentication Failed
- Double-check username and password
- For Gmail: Make sure you're using an App Password, not your regular password
- Verify the SMTP port (587 for TLS, 465 for SSL)

### Emails Going to Spam
- Configure SPF and DKIM records for your domain
- Use a professional email service
- Avoid spam trigger words in subject/content
- Include unsubscribe links if required

## Alternative Email Providers

If you prefer a different email service, you can modify `lib/email.ts` to use:
- AWS SES
- Resend
- Postmark
- Or any other email API

The interface is simple - just implement the `sendEmail` function with the same signature.

