import { Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateStartTime = z.object({
  id: z.number(),
  new: z.string(),
})

export default async function updateStartTime(input: z.infer<typeof UpdateStartTime>, ctx: Ctx) {
  ctx.session.$authorize()

  const requestData = UpdateStartTime.parse(input)
  const date = new Date(requestData.new)
  await db.workday.update({ data: { start: date }, where: { id: requestData.id } })
}
