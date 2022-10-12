import { Badge, Card, Center, Group, Stack, Text } from "@mantine/core"
import { FC, useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import { Smoked } from "../types/smoked"
import { Profile } from "../types/user"
import { supabase } from "../utils/supabase"
import { Chart } from "./Chart"
import { calcSavingAmount } from "./profile/savingMoney"
import { calcSplitTime } from "./profile/splitSeconds"
import { User } from "./profile/User"
import { ZoukiKun } from "./profile/ZoukiKun"

type Props = {
  hospitalNumber: number
}

export const Signage: FC<Props> = ({ hospitalNumber = 0 }) => {
  // 適当に病院のリスト作成
  const hospitals = [
    {
      name: "禁煙大学病院",
      imgSrc: "/signage/byoinkanban.jpeg",
      place: "神田駅(120m)",
      description: "ニコチン依存症治療に保険を適用することができます！",
      badges: [
        { type: "reservation", name: "WEB予約" },
        { type: "method", name: "オンライン診療可" },
        { type: "frequency", name: "利用回数が多い" },
      ],
      closed: "休診日：日曜・祝日",
    },
    {
      name: "エムティーアイデンタルクリニック",
      imgSrc: "/signage/doctor_haisya_faceshield.png",
      place: "新宿駅(234m)",
      description: "どんなヤニでも落としてみせましょう",
      badges: [
        { type: "reservation", name: "WEB予約" },
        { type: "frequency", name: "利用回数が多い" },
      ],
      closed: "休診日：水曜・日曜・祝日",
    },
    {
      name: "近未来AR病院",
      imgSrc: "/signage/medical_mr_ar_glass.png",
      place: "八王子駅(100m)",
      description: "複合現実を使って内臓の状態を確認します！",
      badges: [
        { type: "reservation", name: "WEB予約" },
        { type: "method", name: "オンライン診療可" },
        // { type: "frequency", name: "利用回数が多い" },
      ],
      closed: "休診日：日曜・祝日",
    },
    {
      name: "先端禁煙研究センター",
      imgSrc: "/signage/saisentan.jpeg",
      place: "御茶ノ水(1m)",
      description: "世界最先端の禁煙研究をしています。",
      badges: [
        { type: "reservation", name: "WEB予約" },
        // { type: "method", name: "オンライン診療可" },
        { type: "frequency", name: "利用回数が多い" },
      ],
      closed: "休診日：火曜・日曜・祝日",
    },
  ]
  return (
    <div>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Group ml={20} position='apart' mt='md' mb='xs'>
          <Text weight={700}>{hospitals[hospitalNumber].name}</Text>
        </Group>
        <Card.Section ml={20} component='a'>
          <Group>
            <Image
              src={hospitals[hospitalNumber].imgSrc}
              height={160}
              width={160}
              alt='画像'
            />
            <Stack>
              <Text weight={700}>{hospitals[hospitalNumber].place}</Text>
              <div>{hospitals[hospitalNumber].description}</div>

              <div>
                {hospitals[hospitalNumber].badges.map((item, key) => {
                  let color = "blue"
                  if (item.type === "frequency") {
                    color = "orange"
                  }
                  if (item.type === "method") {
                    color = "lime"
                  }
                  return (
                    <Badge
                      key={key}
                      color={color}
                      size='xl'
                      variant='filled'
                      mr={7}
                    >
                      {item.name}
                    </Badge>
                  )
                })}
              </div>
            </Stack>
          </Group>
          <Group position='apart' mt='md' mb='xs'>
            <Text weight={400} color='#4a4a4a'>
              {hospitals[hospitalNumber].closed}
            </Text>
          </Group>
        </Card.Section>
      </Card>
    </div>
  )
}
