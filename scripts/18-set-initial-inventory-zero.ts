export default async function ({ container }) {
  const inventoryModule = container.resolve("inventory")
  const productModule = container.resolve("product")

  const locations = await inventoryModule.listInventoryLocations()
  const location = locations[0]
  if (!location) throw new Error("No inventory location found")

  const products = await productModule.list()

  for (const product of products) {
    for (const variant of product.variants ?? []) {
      await inventoryModule.setInventoryLevel({
        inventory_item_id: variant.inventory_item_id,
        location_id: location.id,
        stocked_quantity: 0,
      })
    }
  }

  console.log("✔ Initial inventory set to zero")
}
