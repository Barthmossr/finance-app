# Supabase Configuration Guide

This guide will walk you through setting up Supabase for the Finance App, including authentication with Google OAuth and database configuration.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A Google Cloud account for OAuth setup

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in the project details:
   - **Name**: Finance App
   - **Database Password**: Choose a strong password (save this securely)
   - **Region**: Select the region closest to your users
4. Click **Create new project** and wait for it to initialize

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, navigate to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Configure Google OAuth

### 3.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: Finance App
   - User support email: Your email
   - Developer contact: Your email
6. Select **Application type**: Web application
7. Add **Authorized redirect URIs**:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
8. Click **Create**
9. Copy your **Client ID** and **Client Secret**

### 3.2 Configure Supabase Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and enable it
3. Enter your Google OAuth credentials:
   - **Client ID**: Paste your Google Client ID
   - **Client Secret**: Paste your Google Client Secret
4. Click **Save**

### 3.3 Configure Redirect URLs

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

## Step 4: Set Up Database Tables

### 4.1 Create Profiles Table

Run this SQL in the Supabase SQL Editor (**Database** → **SQL Editor**):

```sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create function to handle new user
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 4.2 Create Expenses Table (Optional for future features)

```sql
-- Create expenses table
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  description text not null,
  amount numeric(10, 2) not null,
  category text not null,
  date date not null default current_date,
  type text not null check (type in ('income', 'expense')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.expenses enable row level security;

-- Create policies
create policy "Users can view their own expenses."
  on expenses for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own expenses."
  on expenses for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own expenses."
  on expenses for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own expenses."
  on expenses for delete
  using ( auth.uid() = user_id );

-- Create index for faster queries
create index expenses_user_id_idx on expenses(user_id);
create index expenses_date_idx on expenses(date);
```

## Step 5: Test Your Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click **Sign in with Google**

4. Complete the OAuth flow

5. You should be redirected to the dashboard

## Troubleshooting

### Redirect URL Mismatch

- Ensure the redirect URLs in Google Cloud Console match those in Supabase
- Check that you've added both development and production URLs

### Authentication Not Working

- Verify your environment variables are correct
- Check Supabase logs in **Authentication** → **Logs**
- Ensure Google OAuth is enabled in Supabase

### Database Connection Issues

- Verify your API keys are correct
- Check that Row Level Security policies are properly configured
- Test SQL queries in the Supabase SQL Editor

## Production Deployment

When deploying to production:

1. Update environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Add production URLs to Supabase URL Configuration
3. Add production redirect URI to Google Cloud Console
4. Enable email confirmations in Supabase if needed

## Security Best Practices

- Never commit `.env` or `.env.local` files to version control
- Use Row Level Security (RLS) for all database tables
- Regularly rotate your API keys
- Enable email confirmation for production
- Set up proper CORS policies
- Monitor Supabase logs for suspicious activity

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Auth](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
