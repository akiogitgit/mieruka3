import type { AppProps } from "next/app"
import "windi.css"
import { MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import "../styles/balloon.css"

// reqct-query の設定。
// fetchが失敗しても、retryしない
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Component {...pageProps} />
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default MyApp
