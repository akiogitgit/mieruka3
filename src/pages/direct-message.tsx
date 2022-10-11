import React, { useCallback, useEffect } from "react"
import { useState } from "react"
import { Layout } from "../components/Layout"
import { AiOutlineSend } from "react-icons/ai"
import { User } from "../components/UserAvatar"

import {
  Affix,
  Button,
  Indicator,
  Avatar,
  Paper,
  Textarea,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { NextPage } from "next"
import useStore from "../store"

const DirectMessage: NextPage = () => {
  const [resCount, setResCount] = useState(0)
  const userInfo = useStore(s => s.userInfo)

  // formの入力に関する記述
  const form = useForm<{ text: string }>({
    initialValues: {
      text: "",
    },
    validate: {
      text: (v: string) => (v === "" ? "メッセージを入力してください" : null),
    },
  })
  const [directMessages, setDirectMessages] = useState([
    {
      user_name: "Doctor",
      message: "何かあったらメッセージをください",
    },
  ])

  const addMsg = useCallback(() => {
    const resList = [
      "どんな症状ですか？",
      "診断の予約をしますか？",
      "承知しました。",
    ]
    setDirectMessages(v => [
      ...v,
      {
        user_name: "Doctor",
        message: resList[resCount],
      },
    ])

    console.log(resCount)
    setResCount(resCount + 1)
  }, [resCount])

  const onSubmit = useCallback(() => {
    setDirectMessages(v => [
      ...v,
      {
        user_name: userInfo?.name ?? "ゲスト",
        message: form.values.text,
      },
    ])

    form.reset()
    console.log(directMessages)
    setTimeout(addMsg, 3000)
  }, [addMsg, directMessages, form, userInfo?.name])

  return (
    <Layout>
      <div className='flex flex-col mt-4 mb-50 gap-6'>
        {directMessages?.map((directMessage, index) => (
          <div
            key={index}
            className={`${
              directMessage.user_name !== "Doctor"
                ? "justify-content-end flex-row-reverse "
                : ""
            } flex gap-3 items-start`}
          >
            {directMessage.user_name === "Doctor" ? (
              <Indicator
                inline
                label=''
                size={16}
                offset={7} // 内側に7
                color='green'
                position='bottom-end'
                withBorder // 外側の白
                processing // 主張激しくなる
              >
                <Avatar
                  size='lg'
                  radius='xl'
                  className='transform duration-300 hover:scale-105'
                  src='/doctor.png'
                />
              </Indicator>
            ) : (
              <User userName='' userId={userInfo?.user_id ?? ""} />
            )}

            <div>
              <p
                className={`${
                  directMessage.user_name !== "Doctor" && "text-right"
                }`}
              >
                {directMessage.user_name}
              </p>
              <Paper shadow='sm' p='sm' className='min-w-200px max-w-400px'>
                <div className='whitespace-pre-wrap'>
                  {directMessage.message}
                </div>
                <div className='cursor-pointer mt-2 text-sm inline'></div>
              </Paper>
            </div>
          </div>
        ))}

        <Affix
          position={{ bottom: 0 }}
          className='flex w-[100%] z-10 items-center justify-center'
        >
          <div className='bg-light-50 w-[calc(100%-1rem)]'>
            <form onSubmit={form.onSubmit(onSubmit)}>
              <div className='flex flex-col items-end'>
                <Textarea
                  placeholder='お医者さんへのメッセージを入力してください'
                  // なくても良さそう↓
                  // label='お医者さんへのメッセージ'
                  {...form.getInputProps("text")}
                  className='w-[100%]'
                  minRows={3}
                />

                <Button type='submit' className='w-20 justify-end' mt={6}>
                  <AiOutlineSend />
                </Button>
              </div>
            </form>
          </div>
        </Affix>
      </div>
    </Layout>
  )
}
export default DirectMessage
