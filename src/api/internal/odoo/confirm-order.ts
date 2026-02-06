import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { order_id } = req.params
  const { odoo_id, status } = req.body

  const orderService = req.scope.resolve("order")

  if (!odoo_id || !status) {
    return res.status(400).json({
      message: "odoo_id and status are required",
    })
  }

  if (!["confirmed", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    })
  }

  const order = await orderService.retrieve(order_id)

  // 1. Pedido no bloqueado → error lógico
  if (!order.metadata?.odoo_locked) {
    return res.status(409).json({
      message: "Order is not locked by Odoo",
    })
  }

  // 2. Idempotencia
  if (order.metadata?.odoo_status === status) {
    return res.status(200).json({
      message: "Order already processed",
    })
  }

  // 3. Actualizar metadata (unlock)
  await orderService.update(order.id, {
    metadata: {
      ...order.metadata,
      odoo_id,
      odoo_status: status,
      odoo_locked: false,
      odoo_confirmed_at: new Date().toISOString(),
    },
  })

  return res.status(200).json({
    message: "Order updated from Odoo",
    order_id: order.id,
    status,
  })
}
