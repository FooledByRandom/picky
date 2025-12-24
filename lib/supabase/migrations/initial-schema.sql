-- Initial Supabase schema for Picky app
-- Run this migration in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Feed Items Table (extends existing schema with user_id)
CREATE TABLE IF NOT EXISTS feed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  source_platform TEXT NOT NULL CHECK (source_platform IN ('amazon', 'google', 'tiktok', 'youtube')),
  detected_at TIMESTAMPTZ NOT NULL,
  display_title TEXT NOT NULL,
  display_description TEXT NOT NULL,
  display_main_image_url TEXT NOT NULL,
  display_thumbnail_url TEXT,
  display_action_url TEXT NOT NULL,
  display_content_type TEXT NOT NULL CHECK (display_content_type IN ('physical_product', 'video_review', 'search_trend')),
  commerce_currency TEXT,
  commerce_current_price NUMERIC(10, 2),
  commerce_original_price NUMERIC(10, 2),
  commerce_is_on_sale BOOLEAN,
  commerce_merchant_name TEXT,
  metrics_rating_score NUMERIC(3, 2) CHECK (metrics_rating_score >= 0 AND metrics_rating_score <= 5),
  metrics_review_count INTEGER CHECK (metrics_review_count >= 0),
  metrics_view_count BIGINT CHECK (metrics_view_count >= 0),
  metrics_engagement_score INTEGER NOT NULL CHECK (metrics_engagement_score >= 0),
  tags TEXT[] DEFAULT '{}',
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Searches Table
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  result_count INTEGER DEFAULT 0,
  searched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Recent Scans Table
CREATE TABLE IF NOT EXISTS recent_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  barcode TEXT NOT NULL,
  product_name TEXT,
  feed_item_id UUID REFERENCES feed_items(id) ON DELETE SET NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Upcoming Items Table
CREATE TABLE IF NOT EXISTS upcoming_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feed_item_id UUID REFERENCES feed_items(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  reminder_date TIMESTAMPTZ,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feed_item_id)
);

-- 5. Score Ratings Table
CREATE TABLE IF NOT EXISTS score_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feed_item_id UUID REFERENCES feed_items(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  rated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feed_item_id)
);

-- Indexes for feed_items
CREATE INDEX IF NOT EXISTS idx_feed_items_user_id ON feed_items(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_source_platform ON feed_items(source_platform);
CREATE INDEX IF NOT EXISTS idx_feed_items_detected_at ON feed_items(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_items_engagement_score ON feed_items(metrics_engagement_score DESC);
CREATE INDEX IF NOT EXISTS idx_feed_items_tags ON feed_items USING GIN(tags);

-- Indexes for searches
CREATE INDEX IF NOT EXISTS idx_searches_user_id ON searches(user_id);
CREATE INDEX IF NOT EXISTS idx_searches_searched_at ON searches(searched_at DESC);

-- Indexes for recent_scans
CREATE INDEX IF NOT EXISTS idx_recent_scans_user_id ON recent_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_recent_scans_scanned_at ON recent_scans(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_recent_scans_barcode ON recent_scans(barcode);

-- Indexes for upcoming_items
CREATE INDEX IF NOT EXISTS idx_upcoming_items_user_id ON upcoming_items(user_id);
CREATE INDEX IF NOT EXISTS idx_upcoming_items_feed_item_id ON upcoming_items(feed_item_id);
CREATE INDEX IF NOT EXISTS idx_upcoming_items_reminder_date ON upcoming_items(reminder_date);

-- Indexes for score_ratings
CREATE INDEX IF NOT EXISTS idx_score_ratings_user_id ON score_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_score_ratings_feed_item_id ON score_ratings(feed_item_id);
CREATE INDEX IF NOT EXISTS idx_score_ratings_rated_at ON score_ratings(rated_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcoming_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_ratings ENABLE ROW LEVEL SECURITY;

-- Feed Items Policies
CREATE POLICY "Users can view their own feed items"
  ON feed_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feed items"
  ON feed_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feed items"
  ON feed_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feed items"
  ON feed_items FOR DELETE
  USING (auth.uid() = user_id);

-- Searches Policies
CREATE POLICY "Users can view their own searches"
  ON searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own searches"
  ON searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own searches"
  ON searches FOR DELETE
  USING (auth.uid() = user_id);

-- Recent Scans Policies
CREATE POLICY "Users can view their own scans"
  ON recent_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans"
  ON recent_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans"
  ON recent_scans FOR DELETE
  USING (auth.uid() = user_id);

-- Upcoming Items Policies
CREATE POLICY "Users can view their own upcoming items"
  ON upcoming_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own upcoming items"
  ON upcoming_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own upcoming items"
  ON upcoming_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upcoming items"
  ON upcoming_items FOR DELETE
  USING (auth.uid() = user_id);

-- Score Ratings Policies
CREATE POLICY "Users can view their own ratings"
  ON score_ratings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ratings"
  ON score_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON score_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON score_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_feed_items_updated_at BEFORE UPDATE ON feed_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_upcoming_items_updated_at BEFORE UPDATE ON upcoming_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_score_ratings_updated_at BEFORE UPDATE ON score_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

