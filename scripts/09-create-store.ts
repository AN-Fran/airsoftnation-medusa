import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function createStore() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container
  const storeService = container.resolve("storeService")

  const existing = await storeService.retrieve()

  if (existing) {
    console.log("ℹ️ Store ya existe:")
    console.log(existing.id)
    await app.stop()
    process.exit(0)
  }

  const store = await storeService.update({
    name: "Airsoft Nation",
    default_currency_code: "eur",
    supported_currencies: ["eur"],
  })

  console.log("✅ Store creado / actualizado")
  console.log("ID:")
  console.log(store.id)

  await app.stop()
  process.exit(0)
}

createStore().catch((err) => {
  console.error("❌ Error creando Store")
  console.error(err)
  process.exit(1)
})
