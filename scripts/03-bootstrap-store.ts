import { MedusaApp } from "@medusajs/medusa/dist/loaders"

async function bootstrap() {
  const app = await MedusaApp({
    directory: process.cwd(),
  })

  const container = app.container

  const regionService = container.resolve("regionService")
  const salesChannelService = container.resolve("salesChannelService")
  const storeService = container.resolve("storeService")

  /*
   * 1. REGION
   */
  const regions = await regionService.list()

  let region = regions.find((r) => r.name === "España")

  if (!region) {
    region = await regionService.create({
      name: "España",
      currency_code: "eur",
      tax_rate: 21,
      tax_code: "ES",
      includes_tax: true,
      countries: ["es"],
    })

    console.log("✔ Región creada:", region.id)
  } else {
    console.log("ℹ Región ya existe:", region.id)
  }

  /*
   * 2. SALES CHANNEL
   */
  const channels = await salesChannelService.list()

  let channel = channels.find((c) => c.name === "Default Storefront")

  if (!channel) {
    channel = await salesChannelService.create({
      name: "Default Storefront",
      description: "Canal principal del storefront",
      is_disabled: false,
    })

    console.log("✔ Sales Channel creado:", channel.id)
  } else {
    console.log("ℹ Sales Channel ya existe:", channel.id)
  }

  /*
   * 3. STORE CONFIG
   */
  const store = await storeService.retrieve()

  if (!store.default_sales_channel_id) {
    await storeService.update({
      default_sales_channel_id: channel.id,
    })

    console.log("✔ Store configurado con sales channel por defecto")
  } else {
    console.log("ℹ Store ya configurado")
  }

  await app.stop()
  process.exit(0)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
