import { odooQueue } from "../queues/odoo"
import { MedusaContainer } from "@medusajs/framework/types"

export default async function startOdooWorker(
  container: MedusaContainer
) {
  const orderService = container.resolve("order")

  odooQueue.process(async (job) => {
    const { order_id } = job.data

    const order = await orderService.retrieve(order_id)

    // 1. Idempotencia
    if (order.metadata?.odoo_id) {
      console.log(
        "⏭ Order already synced to Odoo",
        order.id,
        order.metadata.odoo_id
      )
      return
    }

    // 2. Aquí irá la llamada real a Odoo
    // const odooId = await sendOrderToOdoo(order)

    const odooId = `ODOO-${order.display_id}` // placeholder

    // 3. Persistir referencia
    await orderService.update(order.id, {
      metadata: {
        ...order.metadata,
        odoo_id: odooId,
        odoo_synced_at: new Date().toISOString(),
      },
    })

    console.log("✔ Order synced to Odoo", order.id, odooId)
  })
}
