import { Ctx } from "blitz"
import ActiefAPI from "integrations/ActiefInterim/ActiefAPI"
import { z } from "zod"

const GetWorkdays = z.object({
  from: z.string(),
  to: z.string(),
})

export default async function getWorkDays(input: z.infer<typeof GetWorkdays>, ctx: Ctx) {
  ctx.session.$authorize()

  const requestData = GetWorkdays.parse(input)
  const data = await ctx.session.$getPrivateData()

  if (!data.bearerToken) return null

  const availabilities = await ActiefAPI.getCalenderEvents(
    data.bearerToken,
    new Date(requestData.from),
    new Date(requestData.to)
  ).catch(async () => {
    await ctx.session.$revoke()
  })
  return availabilities
}
