export default async function ({ container }) {
  const apiKeyModule = container.resolve("apiKey")

  const keys = await apiKeyModule.list()

  const exists = keys.find(
    (k) => k.title === "odoo-integration"
  )

  if (exists) {
    console.log("✔ Odoo API key already exists")
    return
  }

  const key = await apiKeyModule.create({
    title: "odoo-integration",
    type: "secret",
    scopes: [
      "products:read",
      "variants:read",
      "inventory:read",
      "inventory:write",
      "orders:read",
      "orders:write",
      "customers:read",
    ],
    metadata: {
      integration: "odoo",
      owner: "erp",
    },
  })

  console.log("✔ Odoo API key created")
  console.log("⚠️ Store this key securely:")
  console.log(key.token)
}
