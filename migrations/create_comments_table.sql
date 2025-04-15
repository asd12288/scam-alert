-- Create comments table for blog posts
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment count trigger
CREATE OR REPLACE FUNCTION update_blog_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE blog_posts 
    SET comment_count = COALESCE(comment_count, 0) + 1
    WHERE id = NEW.blog_post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE blog_posts 
    SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
    WHERE id = OLD.blog_post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add comment_count column to blog_posts table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'comment_count'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN comment_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create trigger for comment count
DROP TRIGGER IF EXISTS update_blog_post_comment_count_trigger ON comments;
CREATE TRIGGER update_blog_post_comment_count_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_blog_post_comment_count();

-- Create index for faster comment retrieval
CREATE INDEX IF NOT EXISTS comments_blog_post_id_idx ON comments(blog_post_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);

-- Add RLS policies
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policy for viewing comments (anyone can view)
CREATE POLICY "Anyone can view comments" 
  ON public.comments FOR SELECT 
  USING (true);

-- Policy for inserting comments (only authenticated users)
CREATE POLICY "Authenticated users can insert comments" 
  ON public.comments FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating comments (only comment author or admin)
CREATE POLICY "Users can update their own comments" 
  ON public.comments FOR UPDATE 
  TO authenticated 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policy for deleting comments (only comment author or admin)
CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE 
  TO authenticated 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );