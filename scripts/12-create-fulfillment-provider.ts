import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function createFulfillmentProvider() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container
  const fulfillmentProviderService = container.resolve(
    "fulfillmentProviderService"
  )

  const existing = await fulfillmentProviderService.list()

  const alreadyExists = existing.find(
    (p) => p.id === "manual"
  )

  if (alreadyExists) {
    console.log("ℹ️ Fulfillment Provider manual ya existe")
    await app.stop()
    process.exit(0)
  }

  const provider = await fulfillmentProviderService.create({
    id: "manual",
    is_installed: true,
  })

  console.log("✅ Fulfillment Provider creado")
  console.log("ID:")
  console.log(provider.id)

  await app.stop()
  process.exit(0)
}

createFulfillmentProvider().catch((err) => {
  console.error("❌ Error creando Fulfillment Provider")
  console.error(err)
  process.exit(1)
})
