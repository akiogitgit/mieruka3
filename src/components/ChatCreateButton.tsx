import {
  Button,
  Checkbox,
  LoadingOverlay,
  MantineTransition,
  Modal,
  PasswordInput,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { FC, useCallback, useEffect, useState } from "react"
import { useGetApi, useSelectEq } from "../hooks/useGetApi"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import { ChatFormParams } from "../types/chat"
import { supabase } from "../utils/supabase"

// ログインしていないなら押せなくする
export const ChatCreateButton: FC = () => {
  const [opened, setOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("")
  const session = useIsLoggedIn()

  const form = useForm<ChatFormParams>({
    initialValues: {
      user_id: "",
      user_name: "",
      message: "",
    },
    validate: {
      message: (v: string) => (v === "" ? "メッセージを入力して下さい" : null),
    },
  })

  const getUserName = useCallback(async () => {
    if (!session) {
      return
    }
    const { data, error, status } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", session?.user?.id)
      .single()

    if (error && status !== 406) {
      throw new Error(error.message)
    }
    if (data) {
      setUserName(data.name)
      console.log("name: ", data.name)
    }
  }, [session])

  useEffect(() => {
    getUserName()
  }, [getUserName])

  useEffect(() => {
    form.setValues({
      user_id: session?.user?.id || null,
      user_name: userName,
      message: "",
    })
  }, [session, userName])

  const createChat = useCallback(async () => {
    const { error } = await supabase.from("chats").insert(form.values, {
      returning: "minimal", //返り値を無くす
    })

    if (error) {
      throw new Error(error.message)
    }
    console.log("投稿に成功しました", form.values)
  }, [form.values])

  const onSubmit = useCallback(async () => {
    console.log(form.values)
    setIsLoading(true)
    await createChat()

    setTimeout(() => {
      setIsLoading(false)
      setOpened(false)
      form.reset()
    }, 300)
  }, [form, createChat])

  if (!session) {
    return <></>
  }

  return (
    <div>
      <Button onClick={() => setOpened(true)}>投稿する</Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title='投稿メッセージを入力して下さい'
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <LoadingOverlay
            loaderProps={{ size: "md", color: "blue", variant: "oval" }}
            overlayOpacity={0.5}
            overlayColor='#c5c5c5'
            visible={isLoading}
          />

          <Stack spacing='md'>
            <Textarea
              placeholder='今日も禁煙がんばるぞ！'
              autosize
              minRows={3}
              {...form.getInputProps("message")}
            />
            <div className='flex justify-end'>
              <Button type='submit'>送信</Button>
            </div>
          </Stack>
        </form>
      </Modal>
    </div>
  )
}
