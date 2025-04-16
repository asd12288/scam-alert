"use client";

import { useState, useEffect } from "react";
import { Calendar, RotateCcw, Check, AlertCircle, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BlogAutomationSettings() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [generatedPostId, setGeneratedPostId] = useState<string | null>(null);

  // Generate a blog post on demand
  const generateBlogPost = async () => {
    try {
      setGenerating(true);
      setError(null);
      setSuccess(null);
      setGeneratedPostId(null);

      const response = await fetch("/api/admin/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate blog post");
      }

      setSuccess(`Blog post "${data.data.title}" has been created successfully!`);
      setGeneratedPostId(data.data.id);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Failed to generate blog post"}`);
    } finally {
      setGenerating(false);
    }
  };

  // Testing the cron endpoint (for admins to verify)
  const testCronEndpoint = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch("/api/admin/test-cron", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to test cron endpoint");
      }

      setSuccess("Cron endpoint test was successful. Check the server logs for details.");
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Failed to test cron endpoint"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Automation</h1>
          <p className="text-gray-600">
            Configure and control automatic blog post generation
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 flex items-center">
          <AlertCircle className="mr-2 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg text-green-700 flex items-center">
          <Check className="mr-2 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium">Success</p>
            <p className="text-sm">{success}</p>
            {generatedPostId && (
              <p className="mt-2">
                <Link 
                  href={`/admin/blogs/${generatedPostId}/edit`} 
                  className="text-blue-600 hover:text-blue-800 underline flex items-center"
                >
                  <BookOpen size={14} className="mr-1" />
                  Edit this blog post
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Manual Blog Generation */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Generate Blog Post Manually
        </h2>
        <div className="mb-4">
          <label 
            htmlFor="topic" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Topic (Optional)
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Phishing attacks, Cryptocurrency scams (leave empty for random)"
          />
          <p className="mt-1 text-xs text-gray-500">
            If left empty, a random topic will be selected
          </p>
        </div>
        
        <button
          onClick={generateBlogPost}
          disabled={generating}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {generating ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Generating...
            </>
          ) : (
            "Generate Blog Post"
          )}
        </button>
      </div>

      {/* Configuration Information */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Automation Configuration
        </h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Daily blog generation is configured via an automated cron job. Each day, a new blog post about online safety and scams will be created automatically.
          </p>
          
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
            <h3 className="flex items-center text-md font-semibold text-gray-800 mb-2">
              <Calendar size={18} className="mr-2 text-blue-500" />
              How to configure the daily cron job
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              Set up a cron job with your hosting provider that calls the following endpoint daily:
            </p>
            <code className="bg-gray-100 text-gray-800 p-2 rounded block text-sm mb-2 overflow-auto">
              GET {typeof window !== 'undefined' ? `${window.location.origin}/api/cron/generate-daily-blog` : 'https://yourdomain.com/api/cron/generate-daily-blog'}
            </code>
            <p className="text-gray-600 text-sm">
              Make sure to include an Authorization header:<br />
              <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded">Authorization: Bearer YOUR_CRON_SECRET_KEY</code>
            </p>
          </div>
          
          <div className="border-l-4 border-amber-500 bg-amber-50 p-4">
            <h3 className="flex items-center text-md font-semibold text-gray-800 mb-2">
              <AlertCircle size={18} className="mr-2 text-amber-500" />
              Environment Variables
            </h3>
            <p className="text-gray-600 text-sm mb-1">
              Set these environment variables on your hosting platform:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li><code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded">CRON_SECRET_KEY</code> - A secure random string for authenticating cron requests</li>
              <li><code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded">AUTO_PUBLISH_BLOGS</code> - Set to "true" to auto-publish generated blogs, or "false" to save as drafts</li>
              <li><code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded">OPENAI_API_KEY</code> - Your OpenAI API key</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Cron Connection */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Test Automation Connection
        </h2>
        <p className="text-gray-700 mb-4">
          Test the blog generation system without having to wait for the cron job to run. 
          This will verify that your environment is set up correctly.
        </p>
        <button
          onClick={testCronEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Testing...
            </>
          ) : (
            <>
              <RotateCcw className="inline-block mr-1 h-4 w-4" />
              Test Cron Connection
            </>
          )}
        </button>
      </div>
    </div>
  );
}