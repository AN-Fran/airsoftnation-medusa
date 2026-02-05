import Queue from "bull"

export const odooQueue = new Queue("odoo-sync", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
})
