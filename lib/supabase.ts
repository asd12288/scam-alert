import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// These would normally be environment variables
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://your-project-url.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

// Client-side Supabase client
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client creator function
export function createClient(cookieStore?: any) {
  if (cookieStore) {
    // Server-side with cookie access
    return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options });
        },
      },
    });
  }
  // Fallback to regular client when no cookie store provided
  return supabase;
}

// Auth types
export type UserCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = UserCredentials & {
  name?: string;
};

// User role type
export type UserRole = "admin" | "user";

// Extended user profile type
export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

// Auth helper functions
export async function signUp({ email, password, name }: SignUpCredentials) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  return { data, error };
}

export async function signIn({ email, password }: UserCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });

  return { error };
}

// Get user profile including role
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data as UserProfile;
}

// Check if the current user has admin role
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const profile = await getUserProfile(user.id);
  return profile?.role === "admin";
}

// Update user role (admin only)
export async function updateUserRole(userId: string, role: UserRole) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  return { data, error };
}

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
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([postData])
    .select();

  return { data, error };
}

export async function getBlogPosts(options?: { onlyPublished?: boolean }) {
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.onlyPublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }

  return data as BlogPost;
}

// Function to get a blog post by ID
export async function getBlogPostById(id: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }

  return data as BlogPost;
}

// Function to update a blog post
export async function updateBlogPost(id: string, postData: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      ...postData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  return { data, error };
}

// Function to delete a blog post
export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  return { error };
}

// Comment type definition
export type Comment = {
  id: string;
  blog_post_id: string;
  user_id: string;
  content: string;
  author_name: string;
  created_at: string;
  updated_at: string;
};

export type NewComment = Omit<Comment, "id" | "created_at" | "updated_at">;

// Function to get comments for a blog post
export async function getCommentsForBlogPost(blogPostId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("blog_post_id", blogPostId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return data as Comment[];
}

// Function to add a new comment
export async function addComment(commentData: NewComment) {
  const { data, error } = await supabase
    .from("comments")
    .insert([commentData])
    .select();

  return { data, error };
}

// Function to update a comment
export async function updateComment(id: string, content: string) {
  const { data, error } = await supabase
    .from("comments")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  return { data, error };
}

// Function to delete a comment
export async function deleteComment(id: string) {
  const { error } = await supabase.from("comments").delete().eq("id", id);

  return { error };
}

// Function to check if user can edit/delete a comment (is author or admin)
export async function canManageComment(
  commentUserId: string
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // If user is the comment author
  if (user.id === commentUserId) return true;

  // Check if user is admin
  return await isCurrentUserAdmin();
}
