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

      // 1. Idempotencia: si ya está en Odoo, salir
      if (order.metadata?.odoo_id) {
        console.log(
          "⏭ Order already synced to Odoo",
          order.id,
          order.metadata.odoo_id
        )
        return
      }

      /**
       * 2. Envío a Odoo
       * (placeholder — aquí irá la llamada real)
       */
      // const odooId = await sendOrderToOdoo(order)
      const odooId = `ODOO-${order.display_id}`

      /**
       * 3. Persistir referencia + LOCK ERP
       */
      await orderService.update(order.id, {
        metadata: {
          ...order.metadata,
          odoo_id: odooId,
          odoo_status: "pending_confirmation",
          odoo_locked: true,
          odoo_synced_at: new Date().toISOString(),
        },
      })

      console.log(
        "✔ Order synced to Odoo (locked)",
        order.id,
        odooId
      )

      return {
        order_id: order.id,
        odoo_id: odooId,
        status: "pending_confirmation",
      }
    } catch (error: any) {
      // Enviar a DLQ si se agotan los retries
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

      // Dejar que Bull gestione el retry
      throw error
    }
  })
}

