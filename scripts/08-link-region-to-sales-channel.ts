import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function linkRegionToSalesChannel() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container

  const regionService = container.resolve("regionService")
  const salesChannelService = container.resolve("salesChannelService")

  const regions = await regionService.list()
  const salesChannels = await salesChannelService.list()

  const region = regions.find((r) => r.currency_code === "eur")
  const salesChannel = salesChannels.find(
    (sc) => sc.name === "Storefront Airsoft Nation"
  )

  if (!region) {
    throw new Error("❌ Región EUR no encontrada")
  }

  if (!salesChannel) {
    throw new Error("❌ Sales Channel no encontrado")
  }

  await salesChannelService.addRegion(
    salesChannel.id,
    region.id
  )

  console.log("✅ Región vinculada al Sales Channel")
  console.log("Region:", region.id)
  console.log("Sales Channel:", salesChannel.id)

  await app.stop()
  process.exit(0)
}

linkRegionToSalesChannel().catch((err) => {
  console.error("❌ Error vinculando región y canal")
  console.error(err)
  process.exit(1)
})
