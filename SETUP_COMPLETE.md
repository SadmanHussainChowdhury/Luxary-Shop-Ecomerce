# MongoDB Connection & Admin Panel Setup - COMPLETE ✅

## ✅ What I've Fixed

1. **Updated `.env.local`** with your complete MongoDB connection string
   - Connection String: `mongodb+srv://schowdhury161250_db_user:03CrVY94od0umBbS@cluster0.hi25djo.mongodb.net/worldclass_ecommerce?retryWrites=true&w=majority&appName=Cluster0`
   - Database: `worldclass_ecommerce`

2. **Created Admin Setup Endpoint**: `/api/admin/setup-admin`
   - POST: Create admin user
   - GET: Check if admin exists

3. **Created Admin Setup Script**: `scripts/setup-admin.js`
   - Interactive script to create admin user

## 🚀 Next Steps (IMPORTANT!)

### Step 1: Restart Your Dev Server

**CRITICAL**: Next.js caches environment variables. You MUST restart the server!

```powershell
# Stop current server (Ctrl+C if running)

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Restart dev server
npm run dev
```

### Step 2: Test MongoDB Connection

After the server starts, test the connection:

**Visit**: http://localhost:3000/api/test-connection

**Expected Response**:
```json
{
  "success": true,
  "message": "MongoDB connected successfully!",
  "database": "worldclass_ecommerce",
  "cluster": "cluster0.hi25djo.mongodb.net"
}
```

### Step 3: Create Admin User

Choose **ONE** of these methods:

#### Method A: Using the Script (Recommended)

```powershell
node scripts/setup-admin.js
```

The script will:
- Test MongoDB connection
- Check if admin exists
- Prompt you for admin details
- Create the admin user

#### Method B: Using the API

**Using PowerShell**:
```powershell
$body = @{
    name = "Admin"
    email = "admin@example.com"
    password = "yourpassword123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/setup-admin" -Method POST -Body $body -ContentType "application/json"
```

**Using Browser/Postman**:
- URL: `http://localhost:3000/api/admin/setup-admin`
- Method: `POST`
- Body (JSON):
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "yourpassword123"
}
```

### Step 4: Access Admin Panel

1. **Login**: http://localhost:3000/login
   - Use the email and password you created

2. **Admin Panel**: http://localhost:3000/admin
   - You'll be redirected here after login

## 🔧 Troubleshooting

### Connection Failed?

1. **Check MongoDB Atlas Network Access**
   - Go to: https://cloud.mongodb.com
   - Click "Network Access"
   - Add IP: `0.0.0.0/0` (or your current IP)
   - Click "Confirm"

2. **Verify Connection String**
   - Check `.env.local` file
   - Make sure there are no extra spaces or quotes
   - Restart dev server after changes

3. **Check MongoDB Cluster Status**
   - Make sure your cluster is running (not paused)
   - Free tier clusters auto-pause after inactivity

### Admin Panel Not Accessible?

1. **Verify Admin User Exists**
   - Visit: http://localhost:3000/api/admin/setup-admin (GET)
   - Should show: `{"exists": true, "adminEmail": "..."}`

2. **Check Authentication**
   - Make sure you're logged in
   - Check browser console for errors
   - Verify session in browser DevTools

3. **Verify User Role**
   - Admin user must have `role: 'admin'` in database
   - Check via MongoDB Atlas or create new admin

## 📋 Admin Panel Features

Once connected, you can:

- **Dashboard**: View stats and recent activity
- **Products**: Manage product catalog
- **Categories**: Manage product categories
- **Content**: Manage hero, features, testimonials, flash sales
- **Orders**: View and process orders
- **Settings**: Configure site settings

## 🔐 Security Notes

1. **Change Default Password**: After first login, change the admin password
2. **Use Strong Passwords**: Minimum 8 characters with uppercase, lowercase, numbers
3. **Keep `.env.local` Secret**: Never commit it to Git (already in `.gitignore`)

## ✅ Verification Checklist

- [ ] Dev server restarted
- [ ] MongoDB connection test successful
- [ ] Admin user created
- [ ] Can login to admin panel
- [ ] Can access admin dashboard
- [ ] Can view/create products
- [ ] Can manage categories

## 🆘 Need Help?

If you encounter issues:

1. Check the error message in the browser console
2. Check server logs in the terminal
3. Test connection: http://localhost:3000/api/test-connection
4. Verify MongoDB Atlas Network Access is configured

---

**Your MongoDB Connection String**:
```
mongodb+srv://schowdhury161250_db_user:****@cluster0.hi25djo.mongodb.net/worldclass_ecommerce
```

**Database**: `worldclass_ecommerce`

**Admin Panel**: http://localhost:3000/admin

