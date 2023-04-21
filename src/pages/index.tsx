import { BlitzPage } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { LoginForm } from "src/auth/components/LoginForm"
import { useRouter } from "next/router"
import { Flex, Heading, Stack, useColorModeValue, Text, Box } from "@chakra-ui/react"

const HomePage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Layout title="Log In">
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"xl"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Login met je Actief account
            </Heading>
            <Text fontSize={"lg"} color={useColorModeValue("gray.600", "gray.400")}>
              Robotland{" "}
              <Text as={"span"} color={useColorModeValue("orange.400", "orange.500")}>
                aanwezigheden
              </Text>{" "}
              door te geven 📆
            </Text>
          </Stack>
          <Box rounded="lg" bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <LoginForm
                onSuccess={(_user) => {
                  const next = router.query.next
                    ? decodeURIComponent(router.query.next as string)
                    : "/dashboard"
                  return router.push(next)
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Layout>
  )
}

export default HomePage
