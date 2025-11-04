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
        destination: `${process.env.API_URL}/graphql`
      }
    ];
  }
};

export default nextConfig;
