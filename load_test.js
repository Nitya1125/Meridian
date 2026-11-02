import http from 'k6/http';
import { check, sleep } from 'k6';
import { pickUrl, reqParams } from './pick-live.js';

export const options = {
  scenarios: {
    ramping_load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
 stages: [
        { duration: "20s", target: 300000 }, // warmup
        { duration: "20s", target: 500000 },
        { duration: "20s", target: 750000 },
        { duration: "20s", target: 1000000 }, // yaha pe tootega
        { duration: "10s", target: 0 },
      ],
      gracefulRampDown: '0s',
    },
  },
  thresholds: {
    // Error threshold: Less than 1% of HTTP requests should fail
    http_req_failed: ['rate<0.01'],
    // Latency thresholds: 95% of requests under 500ms, 99% under 1000ms
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
  },
};

export default function () {
  const url = pickUrl();
  const res = http.get(url, reqParams);

  // Validate response without logging user data or tokens
  check(res, {
    'status is 200': (r) => r.status === 200,
    'content-type is json': (r) =>
      Boolean(r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json')),
  });

  // VU pacing between requests
  sleep(1);
}