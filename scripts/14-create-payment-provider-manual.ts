import { MedusaContainer } from "@medusajs/framework/types"

export default async function ({
  container,
}: {
  container: MedusaContainer
}) {
  const paymentModule = container.resolve("payment")

  const providers = await paymentModule.listPaymentProviders()

  const exists = providers.find(
    (p) => p.id === "manual"
  )

  if (exists) {
    console.log("✔ Payment provider 'manual' already exists")
    return
  }

  await paymentModule.createPaymentProvider({
    id: "manual",
    is_enabled: true,
  })

  console.log("✔ Payment provider 'manual' created")
}
