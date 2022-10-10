import React, { useCallback } from "react"
import { useState } from "react"
import { Layout } from "../components/Layout"
import { AiOutlineSend } from "react-icons/ai"

import {
  Affix,
  Button,
  Center,
  Indicator,
  Avatar,
  Paper,
  Textarea,
  Stack,
} from "@mantine/core"
import { useForm } from "@mantine/form"

// setMessages([...messages, newMssege])

const DirectMessage = () => {
  const [directMessages, setDirectMessages] = useState([
    {
      user_name: "Doctor",
      message: "何かあったらメッセージをください",
    },
  ])

  const form = useForm<{ text: string }>({
    initialValues: {
      text: "",
    },
    validate: {
      text: (v: string) => (v === "" ? "メッセージを入力してください" : null),
    },
  })

  const addMsg = useCallback(() => {
    console.table(directMessages)
    setDirectMessages(v => [
      ...v,
      {
        user_name: "Doctor",
        message: "我慢してください",
      },
    ])
  }, [])

  const onSubmit = () => {
    setDirectMessages(v => [
      ...v,
      {
        user_name: "tabakoMan",
        message: form.values.text,
      },
    ])
    // form.reset()
    console.log(directMessages)
    setTimeout(addMsg, 3000)
  }

  return (
    <Layout>
      <div className='flex flex-col mt-4 gap-6'>
        {directMessages?.map((directMessage, index) => (
          <div key={index} className='flex gap-3 items-start'>
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
                src={`${
                  directMessage.user_name === "Doctor"
                    ? "/doctor.png"
                    : "/tabakoMan.png"
                }`}
              />
            </Indicator>
            <div>
              <p>{directMessage.user_name}</p>
              <Paper shadow='sm' p='sm'>
                <div className='whitespace-pre-wrap'>
                  {directMessage.message}
                </div>
                <div className='cursor-pointer mt-2 text-sm inline'></div>
              </Paper>
            </div>
          </div>
        ))}

        <Stack mt={20}>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Textarea
              placeholder='お医者さんへのメッセージを入力してください'
              // なくても良さそう↓
              label='お医者さんへのメッセージ'
              {...form.getInputProps("text")}
            />
            {/* {JSsON.stringify(form.values)} */}
            <Button type='submit'>
              <AiOutlineSend />
            </Button>
          </form>
        </Stack>
      </div>
    </Layout>
  )
}
export default DirectMessage
