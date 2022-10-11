import { Card, Center, Group, Text } from "@mantine/core"
import { FC, useCallback, useEffect, useState } from "react"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import { Smoked } from "../types/smoked"
import { Profile } from "../types/user"
import { supabase } from "../utils/supabase"
import { calcSavingAmount } from "./profile/savingMoney"
import { calcSplitTime } from "./profile/splitSeconds"
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
  const [continuousNonSmokingDuration, setContinuousNonSmokingDuration] =
    useState(0)
  const [continuousNonSmokingDurationStr, setContinuousNonSmokingDurationStr] =
    useState("0日")
  const [savingPrice, setSavingPrice] = useState(0)
  const [lifespanStr, setLifespanStr] = useState("0日")
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
    let continuousNonSmokingDurationSecond
    const registeredDate = new Date(String(profileData?.created_at))
    const registeredDurationSecond = ~~(
      (Date.now() - registeredDate.getTime()) /
      1000
    )
    const registeredDurationDay = registeredDurationSecond / 24 / 60 / 60
    if (
      smokedData !== undefined &&
      smokedData !== null &&
      smokedData?.length > 0
    ) {
      const startNonSmoking = new Date(String(smokedData[0]?.created_at))
      continuousNonSmokingDurationSecond = ~~(
        (Date.now() - startNonSmoking.getTime()) /
        1000
      )
    } else {
      continuousNonSmokingDurationSecond = registeredDurationSecond
    }
    const continuousNonSmoking = calcSplitTime(
      continuousNonSmokingDurationSecond,
    )
    setContinuousNonSmokingDurationStr(
      `${continuousNonSmoking.day}日${continuousNonSmoking.hour}時間${continuousNonSmoking.minute}分${continuousNonSmoking.second}秒`,
    )
    setContinuousNonSmokingDuration(continuousNonSmokingDurationSecond)

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
    let lifespanSecond = ~~(registeredDurationDay * numTabacoPerDay * 330)
    lifespanSecond = lifespanSecond - smokingCountAll * 330
    const lifespan = calcSplitTime(lifespanSecond)

    setLifespanStr(
      `${lifespan.day}日${lifespan.hour}時間${lifespan.minute}分${lifespan.second}秒`,
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
            <div>{continuousNonSmokingDurationStr}</div>
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
      {session && (
        <ZoukiKun nonSmokingDuration={continuousNonSmokingDuration} />
      )}
    </>
  )
}
