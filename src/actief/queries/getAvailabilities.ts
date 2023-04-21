import { Ctx } from "blitz"
import ActiefAPI from "integrations/ActiefInterim/ActiefAPI"

export default async function getAvailabilities(_ = null, ctx: Ctx) {
  ctx.session.$authorize()
  const data = await ctx.session.$getPrivateData()

  if (!data.bearerToken) return null

  const availabilities = await ActiefAPI.getAvailabilities(data.bearerToken)
  return availabilities
}
