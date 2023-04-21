import { Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateEndTime = z.object({
  id: z.number(),
  new: z.string(),
})

export default async function updateEndTime(input: z.infer<typeof UpdateEndTime>, ctx: Ctx) {
  ctx.session.$authorize()

  const requestData = UpdateEndTime.parse(input)
  const date = new Date(requestData.new)
  await db.workday.update({ data: { end: date }, where: { id: requestData.id } })
}
