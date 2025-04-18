/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // BigQueryのエラーを回避するための設定
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    };
    return config;
  },
  // 明示的なルーティング設定
  async rewrites() {
    return [
      {
        source: '/projects/new',
        destination: '/projects/new',
        has: [
          {
            type: 'query',
            key: 'client_id',
            value: '(?<clientId>.*)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
