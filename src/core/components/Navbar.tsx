import {
  useColorModeValue,
  Box,
  Flex,
  Stack,
  Button,
  useColorMode,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"

import React, { Suspense } from "react"
import { useMutation } from "@blitzjs/rpc"
import logout from "src/auth/mutations/logout"
import { useRouter } from "next/router"
import { Routes } from "@blitzjs/next"
import Logo from "public/robotland-robot.webp"
import Image from "next/image"
import NextLink from "next/link"
import { useSession } from "@blitzjs/auth"

const UserMenu = () => {
  const user = useSession()
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)

  const getAvatar = (username: string | null | undefined) => {
    return `https://ui-avatars.com/api/?background=random&name=${
      username ? encodeURIComponent(username) : "User"
    }`
  }

  return (
    <Menu>
      <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
        <Avatar
          size={"sm"}
          src={`https://ui-avatars.com/api/?background=random&name=${getAvatar(
            user.userData?.given_name + " " + user.userData?.family_name
          )}`}
        />
      </MenuButton>
      <MenuList alignItems={"center"}>
        <br />
        <Center>
          <Avatar
            size={"2xl"}
            src={`https://ui-avatars.com/api/?background=random&name=${getAvatar(
              user.userData?.given_name + " " + user.userData?.family_name
            )}`}
          />
        </Center>
        <br />
        <Center>
          <p>{user.userData?.given_name + " " + user.userData?.family_name}</p>
        </Center>
        <br />
        <MenuDivider />
        <MenuItem
          onClick={async () => {
            await logoutMutation()
            await router.push(Routes.HomePage())
          }}
        >
          Log uit
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Flex direction={"row"} alignItems={"center"}>
          <Image
            src={Logo}
            alt={"logo"}
            width={48}
            onClick={() => router.push(Routes.DashboardPage())}
            style={{ cursor: "pointer" }}
          />
          <Flex ml={10} gap={5} direction={"row"}>
            <Link as={NextLink} href={Routes.DashboardPage().href}>
              Home
            </Link>
            <Link as={NextLink} href={Routes.CalendarPage().href}>
              Kalender
            </Link>
          </Flex>
        </Flex>
        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Suspense fallback="loading...">
              <UserMenu />
            </Suspense>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar
