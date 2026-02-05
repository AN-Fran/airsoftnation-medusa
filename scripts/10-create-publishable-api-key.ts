import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function createPublishableKey() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container
  const apiKeyService = container.resolve("apiKeyService")

  const existing = await apiKeyService.list()

  const alreadyExists = existing.find(
    (k) => k.title === "Storefront Airsoft Nation"
  )

  if (alreadyExists) {
    console.log("ℹ️ Publishable API Key ya existe")
    console.log("TOKEN:")
    console.log(alreadyExists.token)
    await app.stop()
    process.exit(0)
  }

  const key = await apiKeyService.create({
    title: "Storefront Airsoft Nation",
    type: "publishable",
  })

  console.log("✅ Publishable API Key creada")
  console.log("TOKEN:")
  console.log(key.token)

  await app.stop()
  process.exit(0)
}

createPublishableKey().catch((err) => {
  console.error("❌ Error creando Publishable API Key")
  console.error(err)
  process.exit(1)
})
