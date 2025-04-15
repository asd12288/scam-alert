"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

// Import TipTap editor and extensions
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

// Create a MenuBar component for the editor
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 pb-2 mb-4 flex flex-wrap gap-1">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded ${
          editor.isActive("bold") ? "bg-gray-200" : ""
        }`}
        type="button"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}
        type="button"
      >
        <span className="italic">I</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1 rounded ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
        }`}
        type="button"
      >
        <span className="text-lg font-bold">H1</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
        }`}
        type="button"
      >
        <span className="text-md font-bold">H2</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}
        type="button"
      >
        <span>• List</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}
        type="button"
      >
        <span>1. List</span>
      </button>
      <button
        onClick={() => {
          const url = window.prompt("URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-1 rounded ${
          editor.isActive("link") ? "bg-gray-200" : ""
        }`}
        type="button"
      >
        <span className="underline text-blue-500">Link</span>
      </button>
      <button
        onClick={() => {
          const url = window.prompt("Image URL");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-1 rounded"
        type="button"
      >
        <span>Image</span>
      </button>
    </div>
  );
};

export default function NewBlogPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    published: false,
    author: "",
    tags: "",
    featured_image: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
      Image,
    ],
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      published: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      setError("Title is required");
      return;
    }

    if (!editor?.getHTML() || editor?.isEmpty) {
      setError("Content is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate slug from title
      const slug = slugify(formData.title);

      const { error } = await createBlogPost({
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: editor.getHTML(),
        published: formData.published,
        author: formData.author,
        featured_image: formData.featured_image,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      });

      if (error) {
        throw new Error(error.message);
      }

      // Redirect to the blog posts list
      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create blog post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Blog Post
        </h1>
        <p className="text-gray-600">
          Fill out the form below to create a new blog post
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow border border-gray-200 p-6"
      >
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter blog post title"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="A short excerpt or summary (optional)"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter author name"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter tags separated by commas (e.g., security,phishing,tips)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate tags with commas (e.g., security,phishing,tips)
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="featured_image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Featured Image URL
          </label>
          <input
            type="text"
            id="featured_image"
            name="featured_image"
            value={formData.featured_image}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter URL for featured image"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <div className="prose-editor border border-gray-300 rounded-md overflow-hidden">
            <MenuBar editor={editor} />
            <div className="p-3 min-h-[300px]">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formData.published}
              onChange={handlePublishedChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="published"
              className="ml-2 block text-sm text-gray-900"
            >
              Publish immediately
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            If unchecked, the post will be saved as a draft
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
