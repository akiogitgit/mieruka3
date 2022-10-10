import { Center, Stack } from "@mantine/core"
import type { NextPage } from "next"
import { Layout } from "../components/Layout"
import { ProfileDetail } from "../components/ProfileDetail"
import SmokedButton from "../components/SmokedButton"

// メイン画面（継続日数、節約金額、応援メッセージ、リスクが下がった）
// 肺の背景が少し明るくするとか
// 臓器くん

const Home: NextPage = () => {
  return (
    <Layout>
      <div>
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
