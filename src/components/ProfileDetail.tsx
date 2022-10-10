import { Card, Center, Group, Text } from "@mantine/core"
import { FC, useCallback, useEffect, useState } from "react"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import { Smoked } from "../types/smoked"
import { Profile } from "../types/user"
import { supabase } from "../utils/supabase"
import { calcLifespan } from "./profile/lifespan"
import { calcSavingAmount } from "./profile/savingMoney"
import { User } from "./profile/User"
import { ZoukiKun } from "./profile/ZoukiKun"

async function getProfile(userId: string) {
  const { data, error, status } = await supabase
    .from<Profile>("profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .single()

  if (error && status !== 406) {
    // dataがなかった時はthrow errorしない
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

export const ProfileDetail: FC = () => {
  const session = useIsLoggedIn()

  const [nonSmokingDuration, setNonSmokingDuration] = useState(0)
  const [savingPrice, setSavingPrice] = useState(0)
  const [lifespanStr, setLifespanStr] = useState("")
  const [userName, setUserName] = useState<string | null>(null)

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
    if (
      smokedData !== undefined &&
      smokedData !== null &&
      smokedData?.length > 0
    ) {
      const startNonSmoking = new Date(String(smokedData[0]?.created_at))
      duration = (Date.now() - startNonSmoking.getTime()) / 60 / 60 / 24 / 1000
    } else {
      duration = registeredDurationDay
    }
    setNonSmokingDuration(duration)

    // 節約金額
    const tabacoPrice = profileData?.tabaco_price ?? 0
    const numTabacoPerDay = profileData?.num_tabaco_per_day ?? 0
    const smokingCountAll =
      smokedData?.reduce((sum, item) => sum + item?.num_tabaco ?? 0, 0) ?? 0
    const savingAmount = calcSavingAmount(
      registeredDurationDay,
      tabacoPrice,
      numTabacoPerDay,
      smokingCountAll,
    )
    setSavingPrice(savingAmount)

    // 伸びた寿命
    // ((禁煙開始日から、今日までの吸った本数合計 * -330s) +
    // (禁煙開始日から、今日までの日数) * 一日に吸う本数 * 330s)
    const { lifespanSecond, lifespanMinute, lifespanHour, lifespanDay } =
      calcLifespan(registeredDurationDay, numTabacoPerDay, smokingCountAll)

    setLifespanStr(
      `${lifespanDay}日${lifespanHour}時間${lifespanMinute}分${lifespanSecond}秒`,
    )
    // ユーザ名取得
    setUserName(profileData?.name ?? "ゲスト")
  }, [session])

  useEffect(() => {
    setRecordings()
  }, [setRecordings])

  return (
    <>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Card.Section component='a'>
          <User userName={userName} userId={session?.user?.id ?? ""} />
        </Card.Section>
        <Group position='apart' mt='md' mb='xs'>
          <div>
            <Text weight={700}>禁煙継続日数</Text>
            <div>{nonSmokingDuration}日</div>
          </div>
          <div>
            <Text weight={700}>節約金額</Text>
            <div>{savingPrice}円</div>
          </div>
          <div>
            <Text weight={700}>伸びた寿命</Text>
            <div>{lifespanStr}</div>
          </div>
        </Group>
      </Card>
      <ZoukiKun nonSmokingDuration={nonSmokingDuration} />
    </>
  )
}
