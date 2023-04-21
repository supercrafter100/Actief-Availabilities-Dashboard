import { Box, Grid, Heading, useColorModeValue } from "@chakra-ui/react"
import React from "react"
import {
  createDaysForCurrentMonth,
  createDaysForNextMonth,
  createDaysForPreviousMonth,
  daysOfWeek,
  months,
} from "src/util/helpers"
export type calendarDayObject =
  | { dateString: string; dayOfMonth: number; isCurrentMonth: boolean; isPreviousMonth: boolean }
  | { dateString: string; dayOfMonth: number; isCurrentMonth: boolean; isNextMonth: boolean }

const Calendar = ({
  yearAndMonth,
  renderDay,
}: {
  yearAndMonth: number[]
  renderDay: (calendarDayObject: calendarDayObject) => React.ReactElement
}) => {
  const [year, month] = yearAndMonth
  const background = useColorModeValue("white", "gray.700")
  const borderColour = useColorModeValue("gray.400", "gray.600")

  if (!year || !month) {
    return <div>uh oh</div>
  }

  const currentMonthDays = createDaysForCurrentMonth(year, month)
  const previousMonthDays = createDaysForPreviousMonth(year, month, currentMonthDays)
  const nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays)

  const calendarGridDayObjects = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays]

  return (
    <>
      <Heading textAlign={"center"} mb={5}>
        {months[month - 1]} ({year})
      </Heading>
      <Box bg={background} p={5} rounded="lg" width={"100%"}>
        <Grid templateColumns={"repeat(7, 1fr)"} mb={2} w={"100%"}>
          {daysOfWeek.map((day) => (
            <Box key={day}>
              <Heading fontSize={"lg"} overflow={"hidden"}>
                {day}
              </Heading>
            </Box>
          ))}
        </Grid>
        <Grid
          templateColumns={"repeat(7, 1fr)"}
          border={`1px solid var(--chakra-colors-${borderColour.replace(".", "-")})`}
          gap={"1px"}
          bg={borderColour}
        >
          {calendarGridDayObjects.map((day) => (
            <Box key={day.dateString} bg={background}>
              {renderDay(day)}
            </Box>
          ))}
        </Grid>
      </Box>
    </>
  )
}

export default Calendar
