const WindiCSSWebpackPlugin = require("windicss-webpack-plugin")

module.exports = {
  // ...
  webpack(config) {
    config.plugins.push(new WindiCSSWebpackPlugin())
    return config
  },
  images: {
    domains: [`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_DOMAIN}`],
  },
}
