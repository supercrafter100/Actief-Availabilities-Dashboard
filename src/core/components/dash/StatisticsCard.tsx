import { Stat, StatHelpText, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react"
import React from "react"

interface StatsCardProps {
  title: string
  stat: string
  helptext?: string
}

const StatisticsCard = ({ title, stat, helptext }: StatsCardProps) => {
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      <StatLabel isTruncated>{title}</StatLabel>
      <StatNumber fontWeight={"medium"}>{stat}</StatNumber>
      {helptext && <StatHelpText>{helptext}</StatHelpText>}
    </Stat>
  )
}

export default StatisticsCard
