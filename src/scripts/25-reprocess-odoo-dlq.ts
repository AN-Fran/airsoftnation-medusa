import { odooQueue } from "../queues/odoo"
import { odooDlq } from "../queues/odoo-dlq"

export default async function () {
  const failedJobs = await odooDlq.getJobs([
    "waiting",
    "delayed",
    "failed",
  ])

  if (!failedJobs.length) {
    console.log("✔ No jobs in Odoo DLQ")
    return
  }

  console.log(
    `↩ Reprocessing ${failedJobs.length} Odoo DLQ jobs`
  )

  for (const job of failedJobs) {
    const { order_id } = job.data.job ?? {}

    if (!order_id) {
      console.warn("⚠️ Invalid DLQ job skipped", job.id)
      continue
    }

    await odooQueue.add(
      { order_id },
      {
        attempts: 5,
        backoff: { type: "exponential", delay: 30000 },
      }
    )

    await job.remove()

    console.log("↩ Requeued order", order_id)
  }

  console.log("✔ DLQ reprocessing completed")
}
