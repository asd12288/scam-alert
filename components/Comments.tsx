"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Comment,
  addComment,
  getCommentsForBlogPost,
  updateComment,
  deleteComment,
  getCurrentUser,
  canManageComment,
  getUserProfile,
} from "@/lib/supabase";
import { format, formatDistanceToNow } from "date-fns";
import { Edit, Trash2, Send, X } from "lucide-react";

type CommentsProps = {
  blogPostId: string;
};

export default function Comments({ blogPostId }: CommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments on load
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const data = await getCommentsForBlogPost(blogPostId);
      setComments(data);
      setLoading(false);
    };

    fetchComments();
  }, [blogPostId]);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);

      if (user) {
        const profile = await getUserProfile(user.id);
        setUserProfile(profile);
      }
    };

    checkUser();
  }, []);

  // Format the date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        full: format(date, "MMM d, yyyy 'at' h:mm a"),
      };
    } catch (error) {
      return {
        relative: "Invalid date",
        full: "Invalid date",
      };
    }
  };

  // Handle submitting a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (!newComment.trim()) return;

    setCommenting(true);
    setError(null);

    try {
      const commentData = {
        blog_post_id: blogPostId,
        user_id: currentUser.id,
        content: newComment.trim(),
        author_name: userProfile?.name || currentUser.email,
      };

      const { data, error } = await addComment(commentData);

      if (error) throw new Error(error.message);

      if (data && data[0]) {
        setComments([...comments, data[0] as Comment]);
        setNewComment("");
        router.refresh(); // Refresh page to update comment count
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit comment");
    } finally {
      setCommenting(false);
    }
  };

  // Start editing a comment
  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // Cancel editing a comment
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  // Save edited comment
  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const { data, error } = await updateComment(
        commentId,
        editContent.trim()
      );

      if (error) throw new Error(error.message);

      if (data && data[0]) {
        setComments(
          comments.map((c) => (c.id === commentId ? (data[0] as Comment) : c))
        );
        setEditingCommentId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update comment");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const { error } = await deleteComment(commentId);

      if (error) throw new Error(error.message);

      setComments(comments.filter((c) => c.id !== commentId));
      router.refresh(); // Refresh page to update comment count
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    }
  };

  // Check if user can manage (edit/delete) a comment
  const checkCanManage = async (userId: string) => {
    return await canManageComment(userId);
  };

  return (
    <section className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-slate-300 border-t-slate-600"></div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const date = formatDate(comment.created_at);
            return (
              <div
                key={comment.id}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {comment.author_name}
                    </div>
                    <time
                      dateTime={comment.created_at}
                      className="text-sm text-gray-500"
                      title={date.full}
                    >
                      {date.relative}
                      {comment.updated_at !== comment.created_at && " (edited)"}
                    </time>
                  </div>

                  {/* Comment actions */}
                  {currentUser && (
                    <div className="flex space-x-2">
                      {(currentUser.id === comment.user_id ||
                        userProfile?.role === "admin") && (
                        <>
                          <button
                            onClick={() => handleEditClick(comment)}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="Edit comment"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete comment"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Comment content */}
                {editingCommentId === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    ></textarea>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 prose-sm max-w-none">
                    {comment.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Comment form */}
      <div className="mt-8">
        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700"
              >
                Leave a comment
              </label>
              <div className="mt-1">
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {commenting ? (
                  <>
                    <div className="mr-2 inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-600 mb-2">
              You need to be logged in to comment.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
