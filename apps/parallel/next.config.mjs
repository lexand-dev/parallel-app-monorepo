/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "3mver37jj0.ufs.sh"
      }
    ]
  },
  rewrites: async () => {
    return [
      {
        source: "/api/graphql",
        destination: "http://localhost:4000/graphql"
        /* destination: "https://parallel-api-4rt0.onrender.com/graphql" */
      }
    ];
  }
};

export default nextConfig;
