import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  admin: {
    disable: true,
  },

  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,

    http: {
      storeCors: process.env.STORE_CORS || "https://shop.airsoftnation.eu",
      adminCors: process.env.ADMIN_CORS || "https://admin.airsoftnation.eu",
      authCors: process.env.AUTH_CORS || "https://shop.airsoftnation.eu",

      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
  },
})
