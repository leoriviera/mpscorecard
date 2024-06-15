/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "members-api.parliament.uk",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
