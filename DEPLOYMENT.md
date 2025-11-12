# Deployment Guide - Vercel + Neon

This guide will help you deploy the Google Shopping Eye Catcher app to Vercel with a Neon PostgreSQL database.

## Prerequisites

- GitHub account (already done ✓)
- Vercel account ([sign up free](https://vercel.com/signup))
- Neon account ([sign up free](https://neon.tech))

## Step 1: Set Up Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Click **"Create a project"**
3. Enter project details:
   - **Name**: eyecatcher-db (or your choice)
   - **Region**: Choose closest to your users
   - **Postgres Version**: 16 (latest)
4. Click **"Create Project"**
5. Copy both connection strings:
   - **Pooled connection** → Use for `DATABASE_URL`
   - **Direct connection** → Use for `DIRECT_URL`
   
   They look like:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository:
   - Select `jgdeutsch/eyecatcher`
   - Click **"Import"**
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `.next` (default)
5. Add Environment Variables:
   - Click **"Environment Variables"**
   - Add:
     - `DATABASE_URL` = [Your Neon pooled connection string]
     - `DIRECT_URL` = [Your Neon direct connection string]
6. Click **"Deploy"**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

## Step 3: Set Up the Database

After deployment, you need to create the database tables:

1. In Vercel Dashboard, go to your project
2. Go to **Settings** → **Environment Variables**
3. Verify both `DATABASE_URL` and `DIRECT_URL` are set
4. Go to **Deployments** tab
5. Click on your latest deployment
6. Click **"..."** menu → **"Redeploy"**

Or manually run migrations:

```bash
# Set your Neon URLs locally
export DATABASE_URL="your-neon-pooled-url"
export DIRECT_URL="your-neon-direct-url"

# Run migration
npx prisma db push

# Or create a migration
npx prisma migrate dev --name init
```

## Step 4: Configure Custom Domain (Optional)

Your app is now live at `eyecatcher.vercel.app`

To use a custom domain:
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions

## Step 5: Monitor Your App

- **Logs**: Vercel Dashboard → Your Project → Deployments → View Logs
- **Analytics**: Enable Vercel Analytics in project settings
- **Database**: Monitor in [Neon Console](https://console.neon.tech)

## Viewing Results

To view collected data:

1. **Neon SQL Editor**:
   - Go to Neon Console
   - Click **SQL Editor**
   - Run queries:
   ```sql
   SELECT * FROM "GameResult" ORDER BY "createdAt" DESC LIMIT 100;
   
   -- Get results by user
   SELECT * FROM "GameResult" WHERE "userName" = 'John Doe';
   
   -- Get click results
   SELECT * FROM "GameResult" WHERE "eventType" = 'CLICK';
   
   -- Get rankings
   SELECT * FROM "GameResult" WHERE "eventType" = 'RANK' ORDER BY "value";
   ```

2. **Prisma Studio** (Local):
   ```bash
   # Set your Neon URLs
   export DATABASE_URL="your-neon-url"
   export DIRECT_URL="your-neon-direct-url"
   
   # Open Prisma Studio
   npx prisma studio
   ```

## Troubleshooting

### Build Fails

- Check Vercel logs for specific errors
- Ensure environment variables are set correctly
- Try redeploying

### Database Connection Issues

- Verify Neon connection strings are correct
- Check that strings include `?sslmode=require`
- Ensure project is not suspended (Neon free tier)

### Images Not Loading

- Check Next.js Image domain configuration in `next.config.js`
- Verify image URLs in `public/topics.csv` are accessible

## Environment Variables Summary

Required for Vercel:

```
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
ADMIN_PASSWORD=your-secure-password
```

## Accessing the Admin Dashboard

Once deployed, you can access the admin panel at:
- **URL**: `https://eyecatcher.vercel.app/admin`
- **Password**: The value you set for `ADMIN_PASSWORD`

The admin dashboard allows you to:
- View analytics by topic
- See top-performing images
- Download raw data as CSV
- Export results including user names and cookie IDs

## Production Checklist

- [ ] Neon database created
- [ ] Environment variables added to Vercel
- [ ] Database schema deployed
- [ ] Test the app at eyecatcher.vercel.app
- [ ] Verify data is being saved to Neon
- [ ] Set up monitoring/analytics
- [ ] Add custom domain (optional)

## Support

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

🎉 Your app should now be live at: **https://eyecatcher.vercel.app**

