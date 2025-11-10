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
        /* destination: `https://api-gql-production.up.railway.app/graphql` */
        destination: `http://localhost:4000/graphql`
      }
    ];
  }
};

export default nextConfig;
