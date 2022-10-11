import { Card, Center, Group, Text } from "@mantine/core"
import { FC, useCallback, useEffect, useState } from "react"
import useStore from "../store"
import { Smoked } from "../types/smoked"
import { Profile } from "../types/user"
import { supabase } from "../utils/supabase"
import { Chart } from "./Chart"
import { calcSavingAmount } from "./profile/savingMoney"
import { calcSplitTime } from "./profile/splitSeconds"
import { User } from "./profile/User"
import { ZoukiKun } from "./profile/ZoukiKun"

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
  const [nonSmokingDuration, setNonSmokingDuration] = useState(0)
  const [nonSmokingDurationStr, setNonSmokingDurationStr] = useState("0日")
  const [savingPrice, setSavingPrice] = useState(0)
  const [lifespanStr, setLifespanStr] = useState("0日")

  const session = useStore(s => s.session)
  const userInfo = useStore(s => s.userInfo)

  // ログインしていたら、継続禁煙時間などをセット
  const setRecordings = useCallback(async () => {
    const userId = session?.user?.id
    console.log("userId", userId)
    if (userId === undefined || userId === null) {
      return
    }
    // const userInfo = await getProfile(userId)
    const smokedData = await getSmokedCreatedAt(userId)
    console.log("profile data", userInfo)
    console.log("smoked data", smokedData)
    // 継続禁煙時間
    let continuousNonSmokingDurationSecond
    const registeredDate = new Date(String(userInfo?.created_at))
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
    setNonSmokingDurationStr(
      `${continuousNonSmoking.day}日${continuousNonSmoking.hour}時間${continuousNonSmoking.minute}分${continuousNonSmoking.second}秒`,
    )
    setNonSmokingDuration(continuousNonSmokingDurationSecond)

    // 節約金額
    const tabacoPrice = userInfo?.tabaco_price ?? 0
    const numTabacoPerDay = userInfo?.num_tabaco_per_day ?? 0
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
  }, [session])

  useEffect(() => {
    setRecordings()
  }, [setRecordings])

  return (
    <>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Card.Section component='a'>
          <User
            userName={userInfo?.name ?? "ゲスト"}
            userId={session?.user?.id ?? ""}
          />
        </Card.Section>
        <Group position='apart' mt='md' mb='xs'>
          <div>
            <Text weight={700}>禁煙継続日数</Text>
            <div>{nonSmokingDurationStr}</div>
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
      {session && <Chart userName={userInfo?.name ?? "ゲスト"} />}
      {session && <ZoukiKun nonSmokingDuration={nonSmokingDuration} />}
    </>
  )
}
