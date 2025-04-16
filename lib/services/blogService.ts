import { supabase } from "../supabase";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured_image?: string;
  author?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  comment_count?: number;
};

export type NewBlogPost = Omit<BlogPost, "id" | "created_at" | "updated_at">;

// Function to create a new blog post
export async function createBlogPost(postData: NewBlogPost) {
  console.log(`[BlogService] Creating new blog post: ${postData.title}`);

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([postData])
    .select();

  console.log(`[BlogService] Create blog post result:`, {
    success: !error && !!data,
    postId: data?.[0]?.id,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { data, error };
}

export async function getBlogPosts(options?: { onlyPublished?: boolean }) {
  console.log(`[BlogService] Getting blog posts with options:`, options);

  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.onlyPublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[BlogService] Error fetching blog posts:", error);
    return [];
  }

  console.log(`[BlogService] Fetched ${data?.length || 0} blog posts`);
  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  console.log(`[BlogService] Getting blog post by slug: ${slug}`);

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("[BlogService] Error fetching blog post by slug:", error);
    return null;
  }

  console.log(`[BlogService] Found blog post: ${data?.title || "not found"}`);
  return data as BlogPost;
}

// Function to get a blog post by ID
export async function getBlogPostById(id: string) {
  console.log(`[BlogService] Getting blog post by ID: ${id}`);

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[BlogService] Error fetching blog post by ID:", error);
    return null;
  }

  console.log(`[BlogService] Found blog post: ${data?.title || "not found"}`);
  return data as BlogPost;
}

// Function to update a blog post
export async function updateBlogPost(id: string, postData: Partial<BlogPost>) {
  console.log(`[BlogService] Updating blog post ID: ${id}`);

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      ...postData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  console.log(`[BlogService] Update blog post result:`, {
    success: !error && !!data,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { data, error };
}

// Function to delete a blog post
export async function deleteBlogPost(id: string) {
  console.log(`[BlogService] Deleting blog post ID: ${id}`);

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  console.log(`[BlogService] Delete blog post result:`, {
    success: !error,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { error };
}
