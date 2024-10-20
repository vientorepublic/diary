import { withNextDevtools } from "@next-devtools/core/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default withNextDevtools(nextConfig);
