export default async function ({ container }) {
  const taxModule = container.resolve("tax")

  const regions = await taxModule.listTaxRegions()

  const exists = regions.find(
    (r) => r.country_code === "ES"
  )

  if (exists) {
    console.log("✔ Tax region ES already exists")
    return
  }

  await taxModule.createTaxRegion({
    country_code: "ES",
    name: "España",
    default_tax_rate: 21,
  })

  console.log("✔ Tax region ES created")
}
