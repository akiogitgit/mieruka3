import { Stack, Button, Modal } from "@mantine/core"
import React, { useCallback, useState } from "react"
import { supabase } from "../utils/supabase"
import { showNotification } from "@mantine/notifications"
import useStore from "../store"
import Link from "next/link"

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
    <div>
      <div className='flex flex-col gap-3 items-center'>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button
            radius='xl'
            size='xl'
            onClick={() => setOpenedHelpModal(v => !v)}
            color='red'
          >
            😖 助けて
          </Button>
          <Button radius='xl' size='xl' onClick={openSmokedModal}>
            😭 吸っちゃったあ
          </Button>
        </div>
        <Button radius='xl' size='xl' color='green'>
          SNSに成果を共有
        </Button>
      </div>
      <Modal
        opened={openedHelpModal}
        onClose={() => setOpenedHelpModal(v => !v)}
        centered
      >
        <div className='ml-4'>
          <p className='font-bold text-2xl'>がんばれ！！負けるな！！</p>
          <p className='mt-30px'>禁断症状の対処法</p>
          <Stack spacing='sm' my='md' ml='sm'>
            <p>① 甘いものを食べてみよう！</p>
            <p>② 運動してみよう！</p>
            <p>③ ガムたばこで我慢しよう！</p>
          </Stack>

          <p className='mt-10'>
            現在<span className='font-bold'>24</span>人がたばこを我慢しています
          </p>
          <div className='flex mt-5 justify-between'>
            <Link href='/direct-message'>
              <Button>お医者さんに相談する</Button>
            </Link>
            <Button onClick={onClickHelpButton}>みんなに助けを求める</Button>
          </div>
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
    </div>
  )
}

export default SmokedButton
