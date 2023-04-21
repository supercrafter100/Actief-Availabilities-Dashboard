import { BlitzLayout } from "@blitzjs/next"
import { Box } from "@chakra-ui/react"
import Head from "next/head"

import React from "react"
import Navbar from "../components/Navbar"

const DashboardLayout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "Robotland Aanwezigheden"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box minH={"100vh"}>
        <Navbar />
        {children}
      </Box>
    </>
  )
}
export default DashboardLayout
