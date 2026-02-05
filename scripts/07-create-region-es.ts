import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function createRegion() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container

  const regionService = container.resolve("regionService")
  const countryService = container.resolve("countryService")
  const currencyService = container.resolve("currencyService")

  // Comprobación previa
  const existing = await regionService.list()

  const alreadyExists = existing.find(
    (r) => r.currency_code === "eur"
  )

  if (alreadyExists) {
    console.log("ℹ️ Region EUR ya existe:")
    console.log(alreadyExists.id)
    await app.stop()
    process.exit(0)
  }

  // Asegurar moneda EUR
  await currencyService.create({
    code: "eur",
    symbol: "€",
    name: "Euro",
  }).catch(() => {})

  // Asegurar país ES
  await countryService.create({
    iso_2: "es",
    iso_3: "esp",
    num_code: 724,
    name: "Spain",
    display_name: "España",
  }).catch(() => {})

  const region = await regionService.create({
    name: "España",
    currency_code: "eur",
    countries: ["es"],
    automatic_taxes: true,
  })

  console.log("✅ Región creada")
  console.log("ID:")
  console.log(region.id)

  await app.stop()
  process.exit(0)
}

createRegion().catch((err) => {
  console.error("❌ Error creando región")
  console.error(err)
  process.exit(1)
})
