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
        // Proxy GraphQL requests to the production API endpoint
        /* destination: `http://localhost:4000/graphql` */
        destination:
          "https://parallel-api-production-6f7d.up.railway.app/graphql" // docker deployment
      }
    ];
  }
};

export default nextConfig;
