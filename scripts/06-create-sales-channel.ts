import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function createSalesChannel() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container

  const salesChannelService = container.resolve("salesChannelService")

  // Evitar duplicados
  const existing = await salesChannelService.list()

  const alreadyExists = existing.find(
    (sc) => sc.name === "Storefront Airsoft Nation"
  )

  if (alreadyExists) {
    console.log("ℹ️ Sales Channel ya existe:")
    console.log(alreadyExists.id)
    await app.stop()
    process.exit(0)
  }

  const channel = await salesChannelService.create({
    name: "Storefront Airsoft Nation",
    description: "Canal público para shop.airsoftnation.eu",
    is_disabled: false,
  })

  console.log("✅ Sales Channel creado")
  console.log("ID:")
  console.log(channel.id)

  await app.stop()
  process.exit(0)
}

createSalesChannel().catch((err) => {
  console.error("❌ Error creando Sales Channel")
  console.error(err)
  process.exit(1)
})
