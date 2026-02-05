export default async function ({ container }) {
  const regionService = container.resolve("region")

  const regions = await regionService.list({
    currency_code: "eur",
  })

  const region = regions[0]
  if (!region) throw new Error("EUR region not found")

  if (region.payment_providers?.includes("manual")) {
    console.log("✔ Manual payment already linked to region")
    return
  }

  await regionService.addPaymentProvider(region.id, "manual")

  console.log("✔ Manual payment linked to EUR region")
}
