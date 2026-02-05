export default async function ({ container }) {
  const taxModule = container.resolve("tax")

  const providers = await taxModule.listTaxProviders()

  const exists = providers.find(
    (p) => p.id === "system"
  )

  if (exists?.is_enabled) {
    console.log("✔ Tax provider system already enabled")
    return
  }

  await taxModule.updateTaxProvider("system", {
    is_enabled: true,
  })

  console.log("✔ Tax provider system enabled")
}
