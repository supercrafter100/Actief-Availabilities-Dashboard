import React, { Suspense, useEffect, useState } from "react"
import { BlitzPage } from "@blitzjs/next"
import DashboardLayout from "src/core/layouts/DashboardLayout"
import { Box, Flex, HStack, Heading, Icon, Stack, Tag, useColorModeValue } from "@chakra-ui/react"
import Calendar, { calendarDayObject } from "src/core/components/Calendar"
import { useQuery } from "@blitzjs/rpc"
import { Event } from "types"
import getWorkDays from "src/actief/queries/getWorkDays"
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"

const CalendarPage: BlitzPage = () => {
  return (
    <DashboardLayout title="Kalender">
      <Suspense fallback={"loading..."}>
        <CalendarSection />
      </Suspense>
    </DashboardLayout>
  )
}

const CalendarField = ({ data, eventData }: { data: calendarDayObject; eventData: Event[] }) => {
  const isCurrentMonthColor = useColorModeValue("black", "white")
  const isNotCrentMonthColor = useColorModeValue("gray.300", "gray.600")

  const matchingEvents =
    data.isCurrentMonth &&
    eventData.filter((event) => data.dayOfMonth === new Date(event.from).getDate())
  const colours = {
    1: "blue",
    4: "green",
  }

  return (
    <Box
      textColor={data.isCurrentMonth ? isCurrentMonthColor : isNotCrentMonthColor}
      height={"7.5rem"}
      p={2}
      width={"100%"}
    >
      {data.dayOfMonth}
      <Flex direction={"column"} gap={1}>
        {matchingEvents &&
          matchingEvents.map((event, idx) => (
            <Tag
              key={idx}
              colorScheme={colours[event.calendarTypeDefinitionId] || "red"}
              overflowWrap={"anywhere"}
            >
              {event.label}
            </Tag>
          ))}
      </Flex>
    </Box>
  )
}

const CalendarSection = () => {
  const [yearAndMonth, setYearAndMonth] = useState([2023, 4])
  const [from, setFrom] = useState(new Date())
  const [to, setTo] = useState(new Date())

  useEffect(() => {
    const fromNow = new Date()
    const toNow = new Date()

    fromNow.setMonth(yearAndMonth[1]! - 2!)
    toNow.setMonth(yearAndMonth[1]!)

    setFrom(fromNow)
    setTo(toNow)
  }, [yearAndMonth])

  const handleMonthNavBackButtonClick = () => {
    let nextYear = yearAndMonth[0]!
    let nextMonth = yearAndMonth[1]! - 1
    if (nextMonth === 0) {
      nextMonth = 12
      nextYear = yearAndMonth[0]! - 1
    }
    setYearAndMonth([nextYear, nextMonth])
  }

  const handleMonthNavForwardButtonClick = () => {
    let nextYear = yearAndMonth[0]!
    let nextMonth = yearAndMonth[1]! + 1
    if (nextMonth === 13) {
      nextMonth = 1
      nextYear = yearAndMonth[0]! + 1
    }
    setYearAndMonth([nextYear, nextMonth])
  }

  const [workdayData] = useQuery(
    getWorkDays,
    { from: from.toDateString(), to: to.toDateString() },
    { suspense: false }
  )

  return (
    <Flex
      minH={"calc(100vh - 4rem)"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} w={"8xl"} py={12} px={6}>
        <HStack gap={5} width={"100%"}>
          <ChevronLeftIcon
            boxSize={10}
            rounded={"full"}
            bg={useColorModeValue("gray.200", "gray.600")}
            cursor={"pointer"}
            onClick={() => handleMonthNavBackButtonClick()}
          />
          <Box rounded="lg" boxShadow={"lg"} m={5} width={"100%"}>
            <Calendar
              yearAndMonth={yearAndMonth}
              renderDay={(calendarDayObject) => (
                <CalendarField
                  data={calendarDayObject}
                  eventData={
                    workdayData?.events.filter(
                      (event) => new Date(event.from).getMonth() + 1 === yearAndMonth[1]!
                    ) || []
                  }
                />
              )}
            />
          </Box>
          <ChevronRightIcon
            boxSize={10}
            rounded={"full"}
            bg={useColorModeValue("gray.200", "gray.600")}
            cursor={"pointer"}
            onClick={() => handleMonthNavForwardButtonClick()}
          />
        </HStack>
      </Stack>
    </Flex>
  )
}

CalendarPage.authenticate = true
export default CalendarPage
