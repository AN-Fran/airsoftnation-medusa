import Queue from "bull"

export const odooDlq = new Queue("odoo-sync-dlq", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
})
