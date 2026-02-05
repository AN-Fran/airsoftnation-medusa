import { odooQueue } from "../queues/odoo"
import { odooDlq } from "../queues/odoo-dlq"
import { MedusaContainer } from "@medusajs/framework/types"

export default async function startOdooWorker(
  container: MedusaContainer
) {
  const orderService = container.resolve("order")

  odooQueue.process(async (job) => {
    try {
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

      // 2. Envío a Odoo (placeholder)
      // const odooId = await sendOrderToOdoo(order)
      const odooId = `ODOO-${order.display_id}`

      // 3. Persistir referencia
      await orderService.update(order.id, {
        metadata: {
          ...order.metadata,
          odoo_id: odooId,
          odoo_synced_at: new Date().toISOString(),
        },
      })

      console.log("✔ Order synced to Odoo", order.id, odooId)

      return { odoo_id: odooId }
    } catch (error: any) {
      // Dead-letter si se agotan retries
      if (
        job.attemptsMade >=
        ((job.opts.attempts ?? 1) - 1)
      ) {
        await odooDlq.add({
          job: job.data,
          error: error.message,
          failed_at: new Date().toISOString(),
        })

        console.error(
          "☠️ Sent to DLQ",
          job.data.order_id
        )
      }

      throw error // deja que Bull gestione retry
    }
  })
}

