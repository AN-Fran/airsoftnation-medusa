import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function bootstrap() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container
  const apiKeyService = container.resolve("apiKeyService")

  const keys = await apiKeyService.list()

  // 1. Admin API Key
  const adminKeyExists = keys.find(
    (k) => k.type === "admin" && k.title === "Admin Airsoft Nation"
  )

  if (!adminKeyExists) {
    const adminKey = await apiKeyService.create({
      title: "Admin Airsoft Nation",
      type: "admin",
    })

    console.log("✔ ADMIN API KEY creada")
    console.log("ADMIN_KEY =", adminKey.token)
  } else {
    console.log("ℹ ADMIN API KEY ya existe")
  }

  // 2. Publishable API Key
  const publishableKeyExists = keys.find(
    (k) => k.type === "publishable" && k.title === "Storefront Airsoft Nation"
  )

  if (!publishableKeyExists) {
    const publishableKey = await apiKeyService.create({
      title: "Storefront Airsoft Nation",
      type: "publishable",
    })

    console.log("✔ PUBLISHABLE API KEY creada")
    console.log("PUBLISHABLE_KEY =", publishableKey.token)
  } else {
    console.log("ℹ PUBLISHABLE API KEY ya existe")
  }

  await app.stop()
  process.exit(0)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
