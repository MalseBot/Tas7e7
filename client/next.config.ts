/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
	reactStrictMode: true,
	// Remove swcMinify - it's enabled by default in Next.js 13+
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
	// Add if you need to handle external images
};

module.exports = nextConfig;
