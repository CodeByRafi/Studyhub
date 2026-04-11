-- Migration: Add profile_image to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- Migration: Add cover_photo_url to networking_profiles table
ALTER TABLE networking_profiles ADD COLUMN IF NOT EXISTS cover_photo_url VARCHAR(500);
