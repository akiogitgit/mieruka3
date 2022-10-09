import { Button, Center, Stack, Image, Group } from "@mantine/core"
import type { NextPage } from "next"
import { Layout } from "../components/Layout"
import Link from "next/link"
import { Sample } from "../types/sample"
import { useCallback, useEffect, useState } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../utils/supabase"
import { useGetApi } from "../hooks/useGetApi"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"

// メイン画面（継続日数、節約金額、応援メッセージ、リスクが下がった）
// 肺の背景が少し明るくするとか
// 臓器くん

const Home: NextPage = () => {
  const session = useIsLoggedIn()

  const [duration, setDuration] = useState(0)
  const [savingPrice, setSavingPrice] = useState(0)
  const [lifespan, setLifespan] = useState(0)

  console.log("sesion", session)

  // ログインしていたら、継続禁煙時間などをセット
  const setRecordings = useCallback(async () => {
    const userId = session?.user?.id
    console.log("userId", userId)
    if (userId !== undefined && userId !== null) {
      const { data, error } = await supabase
        .from("smoked")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .maybeSingle()

      if (error) {
        console.error("data", data)
        throw new Error(error.message)
      }
      console.log("data", data)
    }
  }, [session])

  useEffect(() => {
    setRecordings()
  }, [setRecordings])

  return (
    <Layout>
      <div>
        <Stack className='flex flex-wrap mb-6 gap-10'>
          <div>
            継続日数
            <div>{duration}</div>
          </div>
          <div>
            節約金額
            <div>{savingPrice}</div>
          </div>
          <div>
            伸びた寿命
            <div>{lifespan}</div>
          </div>
          {/* <div>応援メッセージ</div>
          <div>リスクが下がった</div> */}
          <Center>
            <Group spacing='xs'>
              <div>
                <div
                  style={{
                    width: 240,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <div>
                    <Image
                      radius='md'
                      src='/zouki/kanzo.png'
                      alt='zouki image'
                      caption=''
                    />
                  </div>
                </div>
                <div>臓器くんが死にそうです！禁煙してください！</div>
              </div>
              <div className='mb-5 balloon4'>
                <p>寿命が-1000日伸びたよ！</p>
              </div>
            </Group>
          </Center>
        </Stack>
        <Center>
          <Stack>
            <Button radius='xl' size='xl'>
              😖 助けて
            </Button>
            <Button radius='xl' size='xl'>
              😭 吸っちゃったあ
            </Button>
          </Stack>
        </Center>
      </div>
    </Layout>
  )
}

export default Home
