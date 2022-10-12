import { Button, LoadingOverlay, Modal, Stack, Textarea } from "@mantine/core"
import { useForm } from "@mantine/form"
import { FC, useCallback, useEffect, useState } from "react"
import { ChatFormParams } from "../../types/chat"
import { supabase } from "../../utils/supabase"
import { showNotification } from "@mantine/notifications"
import useStore from "../../store"

// ログインしていないなら押せなくする
export const ChatCreateButton: FC = () => {
  const [opened, setOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const session = useStore(s => s.session)
  const userInfo = useStore(s => s.userInfo)

  const form = useForm<{ message: string }>({
    initialValues: {
      message: "",
    },
    validate: {
      message: (v: string) => (v === "" ? "メッセージを入力して下さい" : null),
    },
  })

  const createChat = useCallback(async () => {
    const { error } = await supabase.from("chats").insert(
      {
        user_id: userInfo?.user_id,
        user_name: userInfo?.name,
        message: form.values.message,
      },
      {
        returning: "minimal", //返り値を無くす
      },
    )

    if (error) {
      throw new Error(error.message)
    }
    console.log("投稿に成功しました", form.values)
  }, [form.values, userInfo?.name, userInfo?.user_id])

  const onSubmit = useCallback(async () => {
    console.log(form.values)
    setIsLoading(true)
    await createChat()

    showNotification({
      title: "投稿を送信しました",
      message: "",
    })
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
