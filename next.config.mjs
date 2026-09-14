/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    'localhost',
    'localhost:3000',
    '172.20.10.2',
    '172.20.10.2:3000'
  ],
};

export default nextConfig;
