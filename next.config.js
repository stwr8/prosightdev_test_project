// next.config.js

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Enable in production
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
});
