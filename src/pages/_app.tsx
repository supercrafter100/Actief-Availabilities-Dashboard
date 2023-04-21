import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps, Routes } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { withBlitz } from "src/blitz-client"
import "src/styles/globals.css"
import router from "next/router"

import { ChakraProvider } from "@chakra-ui/react"
import ProgressBar from "@badrap/bar-of-progress"

// Progress Bar
const progress = new ProgressBar({
  size: 2,
  color: "#8BFFF8",
  delay: 100,
})

router.events.on("routeChangeStart", progress.start)
router.events.on("routeChangeComplete", progress.finish)
router.events.on("routeChangeError", progress.finish)

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <ErrorComponent statusCode={401} title="Sorry, you are not allowed to access this" />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <ChakraProvider>
      <ErrorBoundary FallbackComponent={RootErrorFallback}>
        {getLayout(<Component {...pageProps} />)}
      </ErrorBoundary>
    </ChakraProvider>
  )
}

export default withBlitz(MyApp)
