'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { sendWebVitals } from '@/lib/web-vitals';

export function WebVitals() {
  useReportWebVitals(sendWebVitals);
  return null; // This component doesn't render anything
}