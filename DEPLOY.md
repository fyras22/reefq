# Deployment Guide for ReefQ

## Deploy to Vercel via Dashboard

Follow these steps to deploy your application to Vercel:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click on "Add New..." > "Project"
   - Select your "fyras22/reefq" repository
   - Click "Import"

3. **Configure Project Settings**
   - Framework Preset: Next.js
   - Root Directory: ./ (root)
   - Build Command: npm run build
   - Output Directory: .next
   - Install Command: npm install
   - Environment Variables:
     - NEXT_PUBLIC_SUPABASE_URL: (your Supabase URL)
     - NEXT_PUBLIC_SUPABASE_ANON_KEY: (your Supabase anon key)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build and deployment to complete

5. **Verify Deployment**
   - Once deployed, Vercel will provide a URL to access your application
   - Test the application's functionality on the live URL

## Troubleshooting Build Errors

If you encounter build errors during deployment:

1. **Check API Routes**
   - Ensure all API routes have the `export const dynamic = 'force-dynamic'` directive
   - This prevents static rendering errors for dynamic routes

2. **Verify Next.js Configuration**
   - Make sure your next.config.js has the correct settings:
   ```js
   output: 'standalone',
   experimental: {
     serverComponentsExternalPackages: ['@supabase/supabase-js']
   }
   ```

3. **Review Environment Variables**
   - Verify all required environment variables are set correctly in the Vercel dashboard

4. **Check Logs**
   - In the Vercel dashboard, navigate to your deployment
   - Click on "View Logs" to see detailed build and runtime logs

## Post-Deployment Tasks

After successful deployment:

1. **Set up a custom domain** (optional)
   - In your project settings on Vercel, go to "Domains"
   - Add your custom domain and follow the verification steps

2. **Enable Analytics** (optional)
   - Go to "Analytics" in your project settings
   - Enable Vercel Analytics to monitor performance and usage

3. **Set up monitoring** (optional)
   - Enable "Status Badge" in project settings
   - Configure monitoring and alerts for your deployment

Your application should now be successfully deployed and available at the Vercel-provided URL or your custom domain.
