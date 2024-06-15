/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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

//https://upload.wikimedia.org/wikipedia/commons/1/1f/Official_portrait_of_Keir_Starmer_%28crop%29.jpg

export default nextConfig;
