/**
 * Target endpoint and request parameter configuration for K6 load testing.
 * Reads authentication credentials securely from environment variables.
 */

const token = __ENV.MERIDIAN_TOKEN || '';

export function pickUrl() {
  return 'http://localhost:3001/api/auth/me';
}

export const reqParams = {
  headers: {
    'Cookie': `token=${token}`,
    'Accept': 'application/json',
  },
};
