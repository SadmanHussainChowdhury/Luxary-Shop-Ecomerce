# MongoDB Atlas Connection Guide

## Step 1: Get Your MongoDB Atlas Connection String

1. **Sign up/Login to MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account or login

2. **Create a Cluster** (if you don't have one)
   - Click "Create" or "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP Address**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Step 2: Configure Environment Variables

1. **Create `.env.local` file** in the root of your project:

```bash
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/worldclass_ecommerce?retryWrites=true&w=majority
MONGODB_DB=worldclass_ecommerce

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-here-at-least-32-characters

# Optional: Stripe keys for checkout
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

2. **Replace in MONGODB_URI:**
   - `YOUR_USERNAME` → Your MongoDB Atlas username
   - `YOUR_PASSWORD` → Your MongoDB Atlas password
   - Add database name after the cluster URL: `/worldclass_ecommerce`

3. **Generate NEXTAUTH_SECRET:**
   - Run: `openssl rand -base64 32`
   - Or use an online generator
   - Copy the result to `NEXTAUTH_SECRET`

## Step 3: Test Connection

1. **Start your dev server:**
```bash
npm run dev
```

2. **Test the connection:**
   - Visit: http://localhost:3000/api/test-connection
   - You should see: `{"success":true,"message":"MongoDB connected successfully!"}`

3. **Seed initial data:**
   - Visit: http://localhost:3000/api/seed
   - Or use: `curl -X POST http://localhost:3000/api/seed`
   - This will populate your database with sample products

## Troubleshooting

### Connection Error: "authentication failed"
- Check your username and password in the connection string
- Make sure there are no special characters that need URL encoding

### Connection Error: "IP not whitelisted"
- Go to MongoDB Atlas → Network Access
- Add your current IP address
- Or allow access from anywhere (0.0.0.0/0) for development

### Connection Error: "server selection timeout"
- Check your internet connection
- Verify the cluster is running in MongoDB Atlas
- Make sure IP is whitelisted

### "Missing MONGODB_URI" error
- Make sure `.env.local` file exists in the root directory
- Restart your dev server after creating/modifying `.env.local`
- Check that the variable name is exactly `MONGODB_URI`

## Example .env.local File

```env
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/worldclass_ecommerce?retryWrites=true&w=majority
MONGODB_DB=worldclass_ecommerce
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

## Need Help?

If you're still having issues:
1. Check the browser console or terminal for error messages
2. Verify your connection string format
3. Test connection using MongoDB Compass or mongo shell
4. Make sure your cluster is not paused (free tier auto-pauses after inactivity)

