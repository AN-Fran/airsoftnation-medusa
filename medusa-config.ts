import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  /**
   * Admin UI
   * Se expone en admin.airsoftnation.eu
   */
  admin: {
    disable: true,
  },

  projectConfig: {
    /**
     * Infraestructura
     */
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,

    /**
     * HTTP / CORS
     */
    http: {
      // Storefront (Next.js)
      storeCors:
        process.env.STORE_CORS || "https://shop.airsoftnation.eu",

      // Admin UI
      adminCors:
        process.env.ADMIN_CORS || "https://admin.airsoftnation.eu",

      // Auth (login, sessions)
      authCors:
        process.env.AUTH_CORS ||
        "https://shop.airsoftnation.eu,https://admin.airsoftnation.eu",

      /**
       * Seguridad
       */
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
  },
})
