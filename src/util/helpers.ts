import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import weekOfYear from "dayjs/plugin/weekOfYear"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(weekday)
dayjs.extend(weekOfYear)
dayjs.extend(customParseFormat)

export const daysOfWeek = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
]

export const months = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
]

export function getNumberOfDaysInMonth(year: number, month: number) {
  return dayjs(`${year}-${month}-01`).daysInMonth()
}
export function createDaysForCurrentMonth(year: number, month: number) {
  return [...Array(getNumberOfDaysInMonth(year, month))].map((_, index) => {
    return {
      dateString: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: true,
      isNextMonth: false,
      isPreviousMonth: true,
    }
  })
}
export function createDaysForPreviousMonth(year, month, currentMonthDays) {
  const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].dateString)
  const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month")

  const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday

  const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].dateString)
    .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
    .date()

  return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((_, index) => {
    return {
      dateString: dayjs(
        `${previousMonth.year()}-${previousMonth.month() + 1}-${
          previousMonthLastMondayDayOfMonth + index
        }`
      ).format("YYYY-MM-DD"),
      dayOfMonth: previousMonthLastMondayDayOfMonth + index,
      isCurrentMonth: false,
      isPreviousMonth: true,
    }
  })
}
export function createDaysForNextMonth(year, month, currentMonthDays) {
  const lastDayOfTheMonthWeekday = getWeekday(`${year}-${month}-${currentMonthDays.length}`)
  const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month")
  const visibleNumberOfDaysFromNextMonth = 6 - lastDayOfTheMonthWeekday

  return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
    return {
      dateString: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format(
        "YYYY-MM-DD"
      ),
      dayOfMonth: index + 1,
      isCurrentMonth: false,
      isNextMonth: true,
    }
  })
}
// Monday = 0, Sunday === 6
export function getWeekday(dateString) {
  const defaultDayIndex = dayjs(dateString).weekday()
  return defaultDayIndex === 0 ? 6 : defaultDayIndex - 1
}
export function isWeekendDay(dateString) {
  return [6, 0].includes(getWeekday(dateString))
}

export function getDateFromObject(date: Date) {
  const newDate = new Date()
  newDate.setFullYear(date.getFullYear())
  newDate.setMonth(date.getMonth())
  newDate.setDate(date.getDate())
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate
}

export function getFirstDay(curr: Date) {
  return new Date(curr.setDate(curr.getDate() - curr.getDay() + (curr.getDay() == 0 ? -6 : 1)))
}
export function getLastDay(curr: Date) {
  return new Date(curr.setDate(curr.getDate() - curr.getDay() + 7))
}

type day = "Mon" | "Tue" | "Wed" | "Thurs" | "Fri" | "Sat" | "Sun"
export function getLastDayOccurence(date: Date, day: day): Date {
  const d = new Date(date.getTime())
  const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"]
  if (days.includes(day)) {
    const modifier = (d.getDay() + days.length - days.indexOf(day)) % 7 || 7
    d.setDate(d.getDate() - modifier)
  }
  return d
}
