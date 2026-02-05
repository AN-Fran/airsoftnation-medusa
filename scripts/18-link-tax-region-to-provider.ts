export default async function ({ container }) {
  const taxModule = container.resolve("tax")

  const regions = await taxModule.listTaxRegions({
    country_code: "ES",
  })

  const region = regions[0]
  if (!region) throw new Error("Tax region ES not found")

  if (region.provider_id === "system") {
    console.log("✔ Tax region already linked to system provider")
    return
  }

  await taxModule.updateTaxRegion(region.id, {
    provider_id: "system",
  })

  console.log("✔ Tax region ES linked to system provider")
}
