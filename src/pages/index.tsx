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

// メイン画面（継続日数、節約金額、応援メッセージ、リスクが下がった）
// 肺の背景が少し明るくするとか
// 臓器くん

async function getProfile(userId: string) {
  const { data, error, status } = await supabase
    .from<Profile>("profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .single()

  if (error && status !== 406) {
    // dataがなかった時はthrow errorしない
    console.error("data", data)
    throw new Error(error.message)
  }
  return data
}

async function getSmokedCreatedAt(userId: string) {
  const { data, error, status } = await supabase
    .from<Smoked>("smoked")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error && status !== 406) {
    // dataがなかった時はthrow errorしない
    throw new Error(error.message)
  }
  return data
}

const Home: NextPage = () => {
  const session = useIsLoggedIn()

  const [nonSmokingDuration, setNonSmokingDuration] = useState(0)
  const [savingPrice, setSavingPrice] = useState(0)
  const [lifespanStr, setLifespanStr] = useState("")

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

  // ログインしていたら、継続禁煙時間などをセット
  const setRecordings = useCallback(async () => {
    const userId = session?.user?.id
    console.log("userId", userId)
    if (userId === undefined || userId === null) {
      return
    }
    const profileData = await getProfile(userId)
    const smokedData = await getSmokedCreatedAt(userId)
    console.log("profile data", profileData)
    console.log("smoked data", smokedData)
    // 継続禁煙時間
    let duration
    const registeredDate = new Date(String(profileData?.created_at))
    const registeredDurationSecond = Date.now() - registeredDate.getTime()
    const registeredDurationDay = registeredDurationSecond / 60 / 60 / 24 / 1000
    console.log("登録してから現在まで", registeredDurationDay)
    if (smokedData !== undefined && smokedData !== null) {
      const startNonSmoking = new Date(String(smokedData[0]?.created_at))
      duration = (Date.now() - startNonSmoking.getTime()) / 60 / 60 / 24 / 1000
    } else {
      duration = registeredDurationDay
    }
    setNonSmokingDuration(duration)

    // 節約金額
    const tabaco_price = profileData?.tabaco_price ?? 0
    const num_tabaco_per_day = profileData?.num_tabaco_per_day ?? 0
    const savingPriceAll =
      (tabaco_price * num_tabaco_per_day * registeredDurationDay) / 19
    const smokingCountAll =
      smokedData?.reduce((sum, item) => sum + item?.num_tabaco ?? 0, 0) ?? 0
    console.log("吸ってしまった本数", smokingCountAll)
    const notSavingPrice = (tabaco_price * smokingCountAll) / 19
    console.log("節約金額", savingPriceAll)
    setSavingPrice(savingPriceAll - notSavingPrice)

    // 伸びた寿命
    // ((禁煙開始日から、今日までの吸った本数合計 * -330s) +
    // (禁煙開始日から、今日までの日数) * 一日に吸う本数 * 330s)
    let lifespanSecond = ~~(registeredDurationDay * num_tabaco_per_day * 330)
    lifespanSecond = lifespanSecond - smokingCountAll * 330
    let lifespanMinute = ~~(lifespanSecond / 60)
    lifespanSecond = lifespanSecond - lifespanMinute * 60
    let lifespanHour = ~~(lifespanMinute / 60)
    lifespanMinute = lifespanMinute - lifespanHour * 60
    let lifespanDay = ~~(lifespanHour / 60)
    lifespanHour = lifespanHour - lifespanDay * 60

    console.log("lifespanSecond", lifespanSecond)
    console.log("lifespanMinute", lifespanMinute)
    console.log("lifespanHour", lifespanHour)
    console.log("lifespanDay", lifespanDay)
    setLifespanStr(
      `${lifespanDay}日${lifespanHour}時間${lifespanMinute}分${lifespanSecond}秒`,
    )
  }, [session])

  useEffect(() => {
    setRecordings()
  }, [setRecordings])

  // 一日の金額 ＝ 一箱の値段 * 吸った本数 / 19(本)
  // (禁煙開始日から、今日までの日数) * 一日に吸う本数//19*1箱あたりの値段

  useEffect(() => {}, [])

  return (
    <Layout>
      <div>
        <Stack className='mb-6'>
          <div>
            禁煙継続日数
            <div>{nonSmokingDuration}日</div>
          </div>
          <div>
            節約金額
            <div>{savingPrice}円</div>
          </div>
          <div>
            伸びた寿命
            <div>{lifespanStr}日</div>
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
                <p>血液中の酸素濃度が増加してきたよ</p>
              </div>
            </Group>
          </Center>
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
