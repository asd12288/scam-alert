'use client'; // This marks it as a Client Component

import React from 'react';

export default function GoBackButton() {
  // This function now exists only in the client component
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button 
      onClick={handleGoBack}
      className="text-blue-600 dark:text-blue-400 underline"
    >
      go back
    </button>
  );
}