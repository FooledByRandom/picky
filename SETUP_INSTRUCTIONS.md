# Setup Instructions for Product Analysis Feature

Follow these steps to get the product analysis feature up and running.

## Step 1: Run Database Migration

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `lib/supabase/migrations/add-products-table.sql`
6. Click **Run** to execute the migration

This will create the `products` table with all necessary columns, indexes, and RLS policies.

## Step 2: Install Supabase CLI (if not already installed)

You have two options:

### Option A: Install globally (requires sudo)
```bash
sudo npm install -g supabase
```

### Option B: Use npx (no installation needed)
You can use `npx supabase` for all commands instead of `supabase`.

## Step 3: Link Your Supabase Project

1. Get your project reference ID from your Supabase URL:
   - Your URL looks like: `https://YOUR_PROJECT_REF.supabase.co`
   - The `YOUR_PROJECT_REF` is what you need

2. Link the project:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```
   
   Or if you installed globally:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. When prompted, enter your database password (the one you set when creating the project)

## Step 4: Get Your Credentials

You'll need these values:

### Google API Key
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key or use an existing one
3. Copy the key

### Supabase Service Role Key
1. Go to https://app.supabase.com/project/_/settings/api
2. Find the **service_role** key (NOT the anon key)
3. Copy it (it starts with `eyJ...`)

⚠️ **Important**: The service_role key has admin privileges. Keep it secret!

## Step 5: Set Edge Function Secrets

Set the required secrets for your Edge Function:

```bash
npx supabase secrets set GOOGLE_API_KEY=your_google_api_key_here
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Or if installed globally:
```bash
supabase secrets set GOOGLE_API_KEY=your_google_api_key_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 6: Test Locally (Optional)

Before deploying, you can test the function locally:

```bash
npx supabase functions serve analyze-product
```

This will start a local server. You can test it with:
```bash
curl -X POST http://localhost:54321/functions/v1/analyze-product \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/product"}'
```

## Step 7: Deploy the Edge Function

Deploy the function to your Supabase project:

```bash
npx supabase functions deploy analyze-product
```

Or if installed globally:
```bash
supabase functions deploy analyze-product
```

## Step 8: Test in the App

1. Start your Expo app: `npx expo start`
2. Navigate to the Search tab
3. Paste a product URL (e.g., an Amazon product link)
4. Press Enter
5. The analysis modal should appear with AI-generated review summary and citations!

## Troubleshooting

### "Function not found" error
- Make sure you've deployed the function: `npx supabase functions deploy analyze-product`
- Check that the function name matches exactly: `analyze-product`

### "Missing environment variables" error
- Verify secrets are set: `npx supabase secrets list`
- Re-set them if needed

### "Authentication required" error
- Make sure you're logged in to the app
- Check that your Supabase client is properly configured with auth

### Database errors
- Verify the migration ran successfully in the SQL Editor
- Check that RLS policies are enabled on the products table

## Need Help?

- Supabase Docs: https://supabase.com/docs/guides/functions
- Supabase CLI: https://supabase.com/docs/reference/cli
- Google Gemini API: https://ai.google.dev/docs

