import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function createShippingOption() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container

  const shippingOptionService = container.resolve("shippingOptionService")
  const shippingProfileService = container.resolve("shippingProfileService")
  const regionService = container.resolve("regionService")

  const region = (await regionService.list()).find(
    (r) => r.currency_code === "eur"
  )

  if (!region) {
    throw new Error("❌ Región EUR no encontrada")
  }

  const profile = (await shippingProfileService.list()).find(
    (p) => p.type === "default"
  )

  if (!profile) {
    throw new Error("❌ Shipping Profile default no encontrado")
  }

  const existing = await shippingOptionService.list({
    region_id: region.id,
  })

  const alreadyExists = existing.find(
    (o) => o.name === "Envío estándar España"
  )

  if (alreadyExists) {
    console.log("ℹ️ Shipping Option ya existe:")
    console.log(alreadyExists.id)
    await app.stop()
    process.exit(0)
  }

  const option = await shippingOptionService.create({
    name: "Envío estándar España",
    region_id: region.id,
    profile_id: profile.id,
    provider_id: "manual",
    price_type: "flat_rate",
    amount: 690, // 6,90 €
    data: {},
  })

  console.log("✅ Shipping Option creada")
  console.log("ID:")
  console.log(option.id)

  await app.stop()
  process.exit(0)
}

createShippingOption().catch((err) => {
  console.error("❌ Error creando Shipping Option")
  console.error(err)
  process.exit(1)
})
