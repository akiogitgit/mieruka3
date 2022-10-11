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
import SmokedButton from "../components/SmokedButton"

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
