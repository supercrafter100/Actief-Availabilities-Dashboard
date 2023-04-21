import React, { Suspense } from "react"
import { BlitzPage } from "@blitzjs/next"
import DashboardLayout from "src/core/layouts/DashboardLayout"
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  SimpleGrid,
  Stack,
  StatGroup,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import StatisticsCard from "src/core/components/dash/StatisticsCard"
import getWorkedDates from "src/actief/queries/getWorkedDates"
import { getFirstDay, getLastDay } from "src/util/helpers"
import dayjs from "dayjs"
import "dayjs/locale/nl-be"
import { calculateMoneyEarned } from "src/util/currencyHelper"
import { Workday } from "@prisma/client"
import updateStartTime from "src/actief/mutations/updateStartTime"
import updateEndTime from "src/actief/mutations/updateEndTime"
import getStatistics from "src/actief/queries/getStatistics"
import { CheckIcon } from "@chakra-ui/icons"
import markPaid from "src/actief/mutations/markPaid"

const DashboardPage: BlitzPage = () => {
  return (
    <DashboardLayout title="Dashboard">
      <Suspense fallback={"loading..."}>
        <Stack
          minH={"calc(100vh - 4rem)"}
          maxW={"80vw"}
          mx={"auto"}
          direction={"column"}
          spacing={10}
        >
          <Box mt={5}>
            <Suspense fallback={"loading..."}>
              <StatisticsSection />
            </Suspense>
          </Box>
          <Box bg={useColorModeValue("gray.50", "gray.700")} boxShadow={"lg"} rounded={"lg"}>
            <Suspense fallback={"loading..."}>
              <WorkdaysSection />
            </Suspense>
          </Box>
        </Stack>
      </Suspense>
    </DashboardLayout>
  )
}

const StatisticsSection = () => {
  const [statistics] = useQuery(getStatistics, undefined)

  return (
    <StatGroup gap={5}>
      <StatisticsCard
        title="uren gewerkt"
        stat={statistics ? statistics.totalHoursWorked.toString() : "?"}
        helptext="altijd"
      />
      <StatisticsCard
        title="uren gewerkt"
        stat={statistics ? statistics.expectedHoursWorked.toString() : "?"}
        helptext="deze week"
      />
      <StatisticsCard
        title="Totaal inkomen"
        stat={"€" + (statistics ? statistics.totalIncome.replace(".", ",") : "?")}
        helptext="altijd"
      />
      <StatisticsCard
        title="Verwacht inkomen"
        stat={"€" + (statistics ? statistics.expectedIncome.replace(".", ",") : "?")}
        helptext="deze week"
      />
    </StatGroup>
  )
}

const WorkdaysSection = () => {
  const oneWeekEarlier = new Date()
  oneWeekEarlier.setDate(oneWeekEarlier.getDate() - 7)
  const oneWeekLater = new Date()
  oneWeekLater.setDate(oneWeekEarlier.getDate() + 7)
  dayjs.locale("nl-be")

  const [workdays, { refetch }] = useQuery(getWorkedDates, {
    from: getFirstDay(oneWeekEarlier).toDateString(),
    to: getLastDay(oneWeekLater).toDateString(),
  })

  return (
    <TableContainer>
      <Table variant={"simple"}>
        <Thead>
          <Tr>
            <Th>Datum</Th>
            <Th>Starttijd</Th>
            <Th>Eindtijd</Th>
            <Th>Gewerkte uren</Th>
            <Th>Verwachte inkomst</Th>
          </Tr>
        </Thead>
        <Tbody>
          {workdays?.map((day) => (
            <WorkdayRow day={day} key={day.id} refetch={refetch} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

const WorkdayRow = ({ day, refetch }: { day: Workday; refetch: Function }) => {
  const moneyEarned = calculateMoneyEarned(day.start, day.end, day.hourlyWage)
  const [euro, cents] = moneyEarned.toString().split(".")

  const msWorked = day.end.getTime() - day.start.getTime()
  const hoursWorked = msWorked / 1000 / 60 / 60 - 0.5

  const toast = useToast()

  const [updateStartTimeMutation] = useMutation(updateStartTime)
  const [updateEndTimeMutation] = useMutation(updateEndTime)
  const [markPaidMutation] = useMutation(markPaid)

  const updateStart = async (newTime: string) => {
    const [hours, minutes] = newTime.split(":")
    if (!hours || !minutes) return

    day.start.setHours(parseInt(hours))
    day.start.setMinutes(parseInt(minutes))
    await updateStartTimeMutation({ id: day.id, new: day.start.toString() })
    toast({
      title: "Start tijd gewijzigd",
      description: `De start tijd is gewijzigd naar ${newTime}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const updateEnd = async (newTime: string) => {
    const [hours, minutes] = newTime.split(":")
    if (!hours || !minutes) return

    day.end.setHours(parseInt(hours))
    day.end.setMinutes(parseInt(minutes))
    await updateEndTimeMutation({ id: day.id, new: day.end.toString() })
    toast({
      title: "Eind tijd gewijzigd",
      description: `De eind tijd is gewijzigd naar ${newTime}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Tr key={day.id}>
      <Td>
        {dayjs(day.date).format("dd DD/MM/YYYY")}{" "}
        {day.paid && (
          <Tag variant={"subtle"} colorScheme="green">
            Betaald
          </Tag>
        )}
        {!day.paid && (
          <Button
            colorScheme="green"
            size={"xs"}
            variant={"outline"}
            verticalAlign={"center"}
            onClick={async () => {
              await markPaidMutation({ id: day.id })
              refetch()
            }}
          >
            <CheckIcon />
          </Button>
        )}
      </Td>
      <Td>
        <Editable defaultValue={dayjs(day.start).format("HH:mm")} onSubmit={(e) => updateStart(e)}>
          <EditablePreview />
          <EditableInput type="time" />
        </Editable>
      </Td>
      <Td>
        <Editable defaultValue={dayjs(day.end).format("HH:mm")} onSubmit={(e) => updateEnd(e)}>
          <EditablePreview />
          <EditableInput type="time" />
        </Editable>
      </Td>
      <Td>{hoursWorked.toFixed(2).toString().replace(".", ",")}</Td>
      <Td>
        €{euro}
        {cents ? "," + cents?.padEnd(2, "0") : ""}
      </Td>
    </Tr>
  )
}

DashboardPage.authenticate = true
export default DashboardPage
