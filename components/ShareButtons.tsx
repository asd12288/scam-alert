"use client";

import React from "react";
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
}

export default function ShareButtons({
  title,
  url,
  excerpt,
}: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt || "");

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="font-semibold text-gray-900 mb-3 flex items-center">
        <span className="mr-2">Share this article</span>
      </h2>
      <div className="flex gap-2">
        <button
          onClick={shareToFacebook}
          className="bg-[#1877F2] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#166FE5] transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook size={18} className="mr-2" />
          Facebook
        </button>
        <button
          onClick={shareToTwitter}
          className="bg-[#1DA1F2] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#0D8BD9] transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter size={18} className="mr-2" />
          Twitter
        </button>
        <button
          onClick={shareToLinkedin}
          className="bg-[#0077B5] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#006699] transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={18} className="mr-2" />
          LinkedIn
        </button>
        <button
          onClick={copyToClipboard}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-300 transition-colors"
          aria-label="Copy link"
        >
          <LinkIcon size={18} className="mr-2" />
          Copy Link
        </button>
      </div>
    </div>
  );
}
