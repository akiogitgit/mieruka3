import { Center, Stack, Text } from "@mantine/core"
import type { NextPage } from "next"
import { Layout } from "../components/Layout"
import { ProfileDetail } from "../components/profileDetail/ProfileDetail"
import { SignageList } from "../components/SignageList"
import SmokedButton from "../components/SmokedButton"
import { SmokedChart } from "../components/chart/SmokedChart"
import useStore from "../store"
import { SavingAmountChart } from "../components/chart/SavingAmountChart"
import { LifespanChart } from "../components/chart/LifespanChart"

// メイン画面（継続日数、節約金額、応援メッセージ、リスクが下がった）
// 肺の背景が少し明るくするとか
// 臓器くん

const Home: NextPage = () => {
  const session = useStore(state => state.session)
  const userInfo = useStore(state => state.userInfo)

  return (
    <Layout>
      <div>
        {!session && <Text color='orange'>ログインしてください</Text>}
        <Stack className='mb-6'>
          <ProfileDetail />
        </Stack>
        {session && (
          <Stack>
            <SmokedButton />
            <div className='mt-6'>
              <Text size={20} mb='sm'>
                今週の禁煙グラフ
              </Text>

              <SmokedChart userName={userInfo?.name ?? "ゲスト"} />
              <SavingAmountChart userName={userInfo?.name ?? "ゲスト"} />
              <LifespanChart userName={userInfo?.name ?? "ゲスト"} />
            </div>
            <SignageList />
          </Stack>
        )}
      </div>
    </Layout>
  )
}

export default Home
