import {
  Button,
  Center,
  Stack,
  Image,
  Group,
  NumberInput,
  Text,
  Modal,
  LoadingOverlay,
} from "@mantine/core"
import type { NextPage } from "next"
import { Layout } from "../components/Layout"
import Link from "next/link"
import { Sample } from "../types/sample"
import { useCallback, useEffect, useState } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../utils/supabase"
import { useGetApi } from "../hooks/useGetApi"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import { Smoked } from "../types/smoked"
import { Profile } from "../types/user"
import { timeStamp } from "console"
import { ProfileDetail } from "../components/ProfileDetail"

// メイン画面（継続日数、節約金額、応援メッセージ、リスクが下がった）
// 肺の背景が少し明るくするとか
// 臓器くん

const Home: NextPage = () => {
  const session = useIsLoggedIn()

  console.log("sesion", session)
  // 喫煙ボタンが押された時の処理
  const [opened, setOpened] = useState(false)

  const openSmokedModal = useCallback(() => {
    setOpened(true)
  }, [])
  const closeSmokedModal = useCallback(() => {
    setOpened(false)
  }, [])
  const createSmokedCount = useCallback(async () => {
    closeSmokedModal()
    const userId = session?.user?.id
    if (userId === undefined || userId === null) {
      return
    }

    const { error } = await supabase.from("smoked").insert(
      {
        user_id: userId,
      },
      {
        returning: "minimal", //返り値を無くす
      },
    )

    if (error) {
      throw new Error(error.message)
    }
  }, [session])

  return (
    <Layout>
      <div>
        <Stack className='mb-6'>
          <ProfileDetail />
          {/* <div>応援メッセージ</div>
          <div>リスクが下がった</div> */}
        </Stack>
        <Center>
          <Stack>
            <Button radius='xl' size='xl'>
              😖 助けて
            </Button>
            <Button radius='xl' size='xl' onClick={openSmokedModal}>
              😭 吸っちゃったあ
            </Button>
            <Modal
              opened={opened}
              onClose={closeSmokedModal}
              title='本当に吸っちゃったの。。。？'
              centered
            >
              <Stack spacing='md'>
                <div className='flex justify-end'>
                  <Button onClick={createSmokedCount}>はい</Button>
                </div>
              </Stack>
            </Modal>
          </Stack>
        </Center>
      </div>
    </Layout>
  )
}

export default Home
