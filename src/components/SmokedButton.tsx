import { Stack, Button, Modal } from "@mantine/core"
import React, { useCallback, useState } from "react"
import { supabase } from "../utils/supabase"
import { showNotification } from "@mantine/notifications"
import useStore from "../store"

const SmokedButton = () => {
  const session = useStore(s => s.session)
  const userInfo = useStore(s => s.userInfo)

  // 喫煙ボタンが押された時の処理
  const [opened, setOpened] = useState(false)
  const [openedHelpModal, setOpenedHelpModal] = useState(false)

  const openSmokedModal = useCallback(() => {
    setOpened(true)
  }, [])
  const closeSmokedModal = useCallback(() => {
    setOpened(false)
  }, [])

  const createSmokedCount = useCallback(async () => {
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

    closeSmokedModal()
    showNotification({
      title: "吸っちゃったね。",
      message: "",
      color: "red",
    })
  }, [session, closeSmokedModal])

  const createHelpChat = useCallback(async () => {
    const { error } = await supabase.from("chats").insert(
      {
        user_id: userInfo?.user_id,
        user_name: userInfo?.name,
        message: `${userInfo?.name}さんが助けを求めてるよ！`,
      },
      {
        returning: "minimal", //返り値を無くす
      },
    )

    if (error) {
      throw new Error(error.message)
    }
  }, [userInfo?.name, userInfo?.user_id])

  const onClickHelpButton = useCallback(() => {
    createHelpChat()
    setOpenedHelpModal(false)
    showNotification({
      title: "タイムラインに投稿しました",
      message: "",
    })
  }, [createHelpChat])

  return (
    <>
      <Stack>
        <Button
          radius='xl'
          size='xl'
          onClick={() => setOpenedHelpModal(v => !v)}
        >
          😖 助けて
        </Button>
        <Button radius='xl' size='xl' onClick={openSmokedModal}>
          😭 吸っちゃったあ
        </Button>
        <Modal
          opened={openedHelpModal}
          onClose={() => setOpenedHelpModal(v => !v)}
          title='禁断症状の対処法'
          centered
        >
          <Stack spacing='sm' ml='sm' my='xl'>
            <p>① 甘いものを食べてみよう！</p>
            <p>② 運動してみよう！</p>
            <p>③ ガムたばこで我慢しよう！</p>
          </Stack>
          <div className='flex mt-5 justify-end'>
            <Button onClick={onClickHelpButton}>みんなに助けを求める</Button>
          </div>
        </Modal>
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
    </>
  )
}

export default SmokedButton
