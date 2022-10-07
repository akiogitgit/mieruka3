import type { AppProps } from "next/app"
import "windi.css"
import { MantineProvider } from "@mantine/core"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      // theme={{
      //   fontFamily: "Verdana, sans-serif",
      // }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  )
}

export default MyApp
