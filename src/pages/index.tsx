import { Center, Stack, Text } from "@mantine/core"
import type { NextPage } from "next"
import { Layout } from "../components/Layout"
import { ProfileDetail } from "../components/ProfileDetail"
import SmokedButton from "../components/SmokedButton"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"

// メイン画面（継続日数、節約金額、応援メッセージ、リスクが下がった）
// 肺の背景が少し明るくするとか
// 臓器くん

const Home: NextPage = () => {
  const session = useIsLoggedIn()

  return (
    <Layout>
      <div>
        {!session && <Text color='orange'>ログインしてください</Text>}
        <Stack className='mb-6'>
          <ProfileDetail />
        </Stack>
        <Center>
          <SmokedButton />
        </Center>
      </div>
    </Layout>
  )
}

export default Home
