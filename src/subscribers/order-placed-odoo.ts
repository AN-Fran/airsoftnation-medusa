import { SubscriberConfig, OrderService } from "@medusajs/medusa"
import { odooQueue } from "../queues/odoo"

export default async function orderPlacedHandler({
  data,
  container,
}: {
  data: { id: string }
  container: any
}) {
  const orderService: OrderService =
    container.resolve("orderService")

  const order = await orderService.retrieve(data.id, {
    relations: [
      "items",
      "items.variant",
      "customer",
      "shipping_address",
      "payments",
    ],
  })

  await odooQueue.add(
    {
      order_id: order.id,
      external_reference: order.display_id,
    },
    {
      attempts: 5,
      backoff: { type: "exponential", delay: 30000 },
      removeOnComplete: true,
    }
  )
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
