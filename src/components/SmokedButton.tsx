import { Stack, Button, Modal } from "@mantine/core"
import Image from "next/image"
import React, { useCallback, useState } from "react"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import { supabase } from "../utils/supabase"

const SmokedButton = () => {
  const session = useIsLoggedIn()

  // 喫煙ボタンが押された時の処理
  const [opened, setOpened] = useState(false)
  const [isSmoked, setIsSmoked] = useState(false)

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
    setIsSmoked(s => !s)
    setTimeout(closeSmokedModal, 1000)
    // closeSmokedModal()
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
