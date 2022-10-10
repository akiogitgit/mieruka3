import type { AppProps } from "next/app"
import "windi.css"
import { MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import "../styles/balloon.css"
import { NotificationsProvider } from "@mantine/notifications"

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
        <NotificationsProvider position='top-right' zIndex={2077}>
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default MyApp
