import { CLSMetric, FCPMetric, FIDMetric, LCPMetric, TTFBMetric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
  return 'connection' in navigator &&
    navigator['connection'] &&
    'effectiveType' in navigator['connection']
    ? navigator['connection']['effectiveType']
    : '';
}

/**
 * Sends web vitals metrics to a specified analytics endpoint
 */
export function sendWebVitals(metric: CLSMetric | FCPMetric | FIDMetric | LCPMetric | TTFBMetric) {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  
  if (!analyticsId) {
    return;
  }

  // Get the metrics data
  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  // Use `navigator.sendBeacon()` if available
  const blob = new Blob([JSON.stringify(body)], {
    type: 'application/json',
  });
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else {
    fetch(vitalsUrl, {
      body: JSON.stringify(body),
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    });
  }
}