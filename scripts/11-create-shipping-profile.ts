import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function createShippingProfile() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container
  const shippingProfileService = container.resolve("shippingProfileService")

  const existing = await shippingProfileService.list()

  const alreadyExists = existing.find(
    (p) => p.name === "Default Shipping"
  )

  if (alreadyExists) {
    console.log("ℹ️ Shipping Profile ya existe:")
    console.log(alreadyExists.id)
    await app.stop()
    process.exit(0)
  }

  const profile = await shippingProfileService.create({
    name: "Default Shipping",
    type: "default",
  })

  console.log("✅ Shipping Profile creado")
  console.log("ID:")
  console.log(profile.id)

  await app.stop()
  process.exit(0)
}

createShippingProfile().catch((err) => {
  console.error("❌ Error creando Shipping Profile")
  console.error(err)
  process.exit(1)
})
