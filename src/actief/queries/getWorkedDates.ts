import { Ctx } from "blitz"
import db from "db"
import ActiefAPI from "integrations/ActiefInterim/ActiefAPI"
import { getDateFromObject } from "src/util/helpers"
import { z } from "zod"

const GetWorkedDays = z.object({
  from: z.string(),
  to: z.string(),
})

export default async function getWorkDays(input: z.infer<typeof GetWorkedDays>, ctx: Ctx) {
  ctx.session.$authorize()

  const requestData = GetWorkedDays.parse(input)
  const data = await ctx.session.$getPrivateData()

  if (!data.bearerToken) return null

  const events = await ActiefAPI.getCalenderEvents(
    data.bearerToken,
    new Date(requestData.from),
    new Date(requestData.to)
  ).catch(async () => {
    await ctx.session.$revoke()
  })

  if (!events) return null

  const user = await db.user.findFirst({
    where: { id: ctx.session.userId },
    select: { hourlyWage: true },
  })
  if (!user) return null

  // Filter out for workdays only
  const workdays = events.events.filter((f) => f.calendarTypeDefinitionId === 1)
  const databaseEvents = await Promise.all(
    workdays.map(async (day) => {
      const start = new Date(day.from)
      const end = new Date(day.until)

      const date = getDateFromObject(start)
      const existing = await db.workday.findFirst({ where: { date: date } })
      if (existing) return existing

      const event = await db.workday.create({
        data: { date, start, end, hourlyWage: user.hourlyWage, userId: ctx.session.userId! },
      })
      return event
    })
  )

  return databaseEvents
}
