export default async function ({ container }) {
  const inventoryModule = container.resolve("inventory")

  const locations = await inventoryModule.listInventoryLocations()

  const exists = locations.find(
    (l) => l.name === "Main Warehouse"
  )

  if (exists) {
    console.log("✔ Inventory location already exists")
    return
  }

  await inventoryModule.createInventoryLocation({
    name: "Main Warehouse",
    metadata: {
      odoo_sync: true,
      odoo_location_code: "WH/MAIN",
    },
  })

  console.log("✔ Inventory location 'Main Warehouse' created")
}
