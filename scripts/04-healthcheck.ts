import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function healthcheck() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container

  const storeService = container.resolve("storeService")
  const regionService = container.resolve("regionService")
  const salesChannelService = container.resolve("salesChannelService")

  const store = await storeService.retrieve()
  const regions = await regionService.list()
  const channels = await salesChannelService.list()

  console.log("=== MEDUSA HEALTHCHECK ===")
  console.log("Store ID:", store.id)
  console.log("Default Sales Channel:", store.default_sales_channel_id || "❌ NONE")
  console.log("Regions:", regions.map((r) => `${r.name} (${r.currency_code})`))
  console.log("Sales Channels:", channels.map((c) => c.name))
  console.log("==========================")

  await app.stop()
  process.exit(0)
}

healthcheck().catch((err) => {
  console.error("❌ Healthcheck failed")
  console.error(err)
  process.exit(1)
})
