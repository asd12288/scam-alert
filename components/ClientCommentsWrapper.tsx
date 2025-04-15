"use client";

import React from "react";
import Comments from "@/components/Comments";

type ClientCommentsWrapperProps = {
  blogPostId: string;
};

export default function ClientCommentsWrapper({
  blogPostId,
}: ClientCommentsWrapperProps) {
  return <Comments blogPostId={blogPostId} />;
}
