# Deploy to Vercel - Quick Guide

## You're Already Authenticated! ✅

Since you've already authenticated with Vercel CLI, you can deploy either via CLI or web interface.

## Option 1: Web Interface (Easiest)

1. **Go to**: https://vercel.com/new
2. **Import Repository**: Select `SadmanHussainChowdhury/Luxary-Shop-Ecomerce`
3. **Configure Project**:
   - Project Name: `luxary-shop-ecomerce` (or your choice)
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)

4. **Add Environment Variables** (before deploying):
   - `MONGODB_URI` - Your MongoDB connection string
   - `MONGODB_DB` - Your database name
   - `NEXTAUTH_URL` - Will be `https://your-project.vercel.app` (update after first deploy)
   - `NEXTAUTH_SECRET` - Your secret key

5. **Deploy**: Click "Deploy" button

6. **After First Deployment**:
   - Copy your Vercel URL
   - Go to Project Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your actual Vercel URL
   - Redeploy

## Option 2: CLI Deployment

If you want to use CLI, run:
```bash
npx vercel --prod
```

Then answer the prompts:
- Set up and deploy? → **Y**
- Which scope? → Select your account
- Link to existing project? → **N** (for first time)
- Project name? → `luxary-shop-ecomerce`
- Directory? → `./`
- Override settings? → **N**

After linking, you'll need to add environment variables via web interface or CLI.

## Environment Variables You Need

From your `.env.local`, add these to Vercel:
- ✅ `MONGODB_URI`
- ✅ `MONGODB_DB`
- ✅ `NEXTAUTH_URL` (update after first deploy)
- ✅ `NEXTAUTH_SECRET`

## After Deployment

1. **Test your site**: Visit your Vercel URL
2. **Test MongoDB**: `https://your-project.vercel.app/api/test-connection`
3. **Update NEXTAUTH_URL**: With your actual Vercel URL
4. **Configure MongoDB Atlas**: Allow IP 0.0.0.0/0 in Network Access

## Need Help?

- Vercel Dashboard: https://vercel.com/dashboard
- Project will auto-deploy on every push to `main` branch

