import { Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const MarkPaid = z.object({
  id: z.number(),
})

export default async function markPaid(input: z.infer<typeof MarkPaid>, ctx: Ctx) {
  ctx.session.$authorize()

  const requestData = MarkPaid.parse(input)
  await db.workday.update({ data: { paid: true }, where: { id: requestData.id } })
}
