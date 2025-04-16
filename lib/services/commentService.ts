import { supabase } from "../supabase";
import { getCurrentUser } from "./authService";

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
  console.log(`[CommentService] Getting comments for blog post: ${blogPostId}`);

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("blog_post_id", blogPostId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[CommentService] Error fetching comments:", error);
    return [];
  }

  console.log(
    `[CommentService] Fetched ${data.length} comments for blog post: ${blogPostId}`
  );
  return data as Comment[];
}

// Function to add a new comment
export async function addComment(commentData: NewComment) {
  console.log(
    `[CommentService] Adding comment for blog post: ${commentData.blog_post_id}`
  );

  const { data, error } = await supabase
    .from("comments")
    .insert([commentData])
    .select();

  console.log(`[CommentService] Add comment result:`, {
    success: !error && !!data,
    commentId: data?.[0]?.id,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { data, error };
}

// Function to update a comment
export async function updateComment(id: string, content: string) {
  console.log(`[CommentService] Updating comment ID: ${id}`);

  const { data, error } = await supabase
    .from("comments")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  console.log(`[CommentService] Update comment result:`, {
    success: !error && !!data,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { data, error };
}

// Function to delete a comment
export async function deleteComment(id: string) {
  console.log(`[CommentService] Deleting comment ID: ${id}`);

  const { error } = await supabase.from("comments").delete().eq("id", id);

  console.log(`[CommentService] Delete comment result:`, {
    success: !error,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { error };
}

// Function to check if user can edit/delete a comment (is author or admin)
export async function canManageComment(
  commentUserId: string,
  isAdmin: boolean
): Promise<boolean> {
  console.log(
    `[CommentService] Checking if user can manage comment by userId: ${commentUserId}`
  );

  const user = await getCurrentUser();
  if (!user) return false;

  // If user is the comment author
  if (user.id === commentUserId) return true;

  // If user is admin (passed from the auth context)
  return isAdmin;
}
