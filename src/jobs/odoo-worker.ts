import { odooQueue } from "../queues/odoo"

odooQueue.process(async (job) => {
  const { order_id, external_reference } = job.data

  console.log("▶ Sync order to Odoo", order_id)

  /**
   * 1. Idempotencia mínima
   *    (aquí luego comprobarás metadata.odoo_id)
   */

  /**
   * 2. Transformar payload
   *    (order → Odoo sale.order)
   */

  /**
   * 3. Enviar a Odoo
   *    (HTTP / XML-RPC / JSON-RPC)
   */

  /**
   * 4. Guardar referencia
   *    order.metadata.odoo_id = xxx
   */

  return {
    status: "queued_for_odoo",
    order_id,
    external_reference,
  }
})
