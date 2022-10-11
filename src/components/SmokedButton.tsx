import { Stack, Button, Modal } from "@mantine/core"
import React, { useCallback, useState } from "react"
import { supabase } from "../utils/supabase"
import { showNotification } from "@mantine/notifications"
import useStore from "../store"

const SmokedButton = () => {
  const session = useStore(s => s.session)

  // 喫煙ボタンが押された時の処理
  const [opened, setOpened] = useState(false)

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

  return (
    <>
      <Stack>
        <Button radius='xl' size='xl'>
          😖 助けて
        </Button>
        <Button radius='xl' size='xl' onClick={openSmokedModal}>
          😭 吸っちゃったあ
        </Button>
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
