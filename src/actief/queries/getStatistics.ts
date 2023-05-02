import { Ctx } from "blitz"
import db from "db"
import { calculateMoneyEarned } from "src/util/currencyHelper"
import { getLastDayOccurence } from "src/util/helpers"

export default async function getStatistics(_ = null, ctx: Ctx) {
  ctx.session.$authorize()

  const data = await ctx.session.$getPrivateData()
  if (!data.bearerToken) return null

  const expectedData = await getExpectedData(ctx.session.userId!)
  const totalData = await getTotalData(ctx.session.userId!)

  return {
    expectedIncome: expectedData.income.toFixed(2),
    totalIncome: totalData.income.toFixed(2),
    expectedHoursWorked: expectedData.hoursWorked,
    totalHoursWorked: totalData.hoursWorked,
  }
}

async function getExpectedData(userId: number) {
  const lastWednesDay = getLastDayOccurence(new Date(), "Wed")
  const workdays = await db.workday.findMany({
    where: {
      paid: false,
      date: {
        gte: lastWednesDay,
      },
      userId: userId,
    },
  })

  const income = workdays.reduce((prev, curr) => {
    prev += calculateMoneyEarned(curr.start, curr.end, curr.hourlyWage)
    return prev
  }, 0)

  const hoursWorked = workdays.reduce((prev, curr) => {
    const msWorked = curr.end.getTime() - curr.start.getTime()
    const hoursWorked = msWorked / 1000 / 60 / 60 - 0.5 // 30 mins don't get paid
    prev += hoursWorked
    return prev
  }, 0)

  return { income, hoursWorked }
}

async function getTotalData(userId: number) {
  const workdays = await db.workday.findMany({
    where: {
      userId: userId,
    },
  })

  const income = workdays.reduce((prev, curr) => {
    prev += calculateMoneyEarned(curr.start, curr.end, curr.hourlyWage)
    return prev
  }, 0)

  const hoursWorked = workdays.reduce((prev, curr) => {
    const msWorked = curr.end.getTime() - curr.start.getTime()
    const hoursWorked = msWorked / 1000 / 60 / 60 - 0.5 // 30 mins don't get paid
    prev += hoursWorked
    return prev
  }, 0)

  return { income, hoursWorked }
}
