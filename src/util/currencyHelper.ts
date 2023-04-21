import { Decimal } from "@prisma/client/runtime"

export function calculateMoneyEarned(start: Date, end: Date, hourlyWage: Decimal) {
  const msWorked = end.getTime() - start.getTime()
  const hoursWorked = msWorked / 1000 / 60 / 60 - 0.5 // 30 mins don't get paid
  const moneyEarned = Math.round(hoursWorked * parseFloat(hourlyWage.toString()) * 100) / 100 // Jank
  const solaridityCosts = Math.round((moneyEarned / 100) * 2.71 * 100) / 100
  return Math.round((moneyEarned - solaridityCosts) * 100) / 100
}
