import { Container } from "@medusajs/framework"
import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function bootstrap() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container: Container = app.container

  const regionService = container.resolve("regionService")
  const currencyService = container.resolve("currencyService")

  // 1. Currency EUR
  const existingCurrency = await currencyService.retrieve("eur").catch(() => null)

  if (!existingCurrency) {
    await currencyService.create({
      code: "eur",
      symbol: "€",
      name: "Euro",
    })
    console.log("✔ Currency EUR creada")
  } else {
    console.log("ℹ Currency EUR ya existe")
  }

  // 2. Region España / EU
  const regions = await regionService.list()

  if (!regions.find((r) => r.name === "España")) {
    await regionService.create({
      name: "España",
      currency_code: "eur",
      countries: ["es"],
      tax_rate: 21,
      payment_providers: [],
      fulfillment_providers: [],
    })
    console.log("✔ Región España creada")
  } else {
    console.log("ℹ Región España ya existe")
  }

  await app.stop()
  process.exit(0)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
