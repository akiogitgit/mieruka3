import { Center, Group } from "@mantine/core"
import Image from "next/image"
import { FC, useEffect, useState } from "react"

type Props = {
  nonSmokingDuration: number
}

export const ZoukiKun: FC<Props> = ({ nonSmokingDuration }) => {
  const [cheeringMessage, setCheeringMessage] = useState("")
  useEffect(() => {
    if (nonSmokingDuration > 0.5) {
      setCheeringMessage("aaaa")
    }
    setCheeringMessage("血中の酸素濃度が上昇してきたよ")
    console.log("nonSmokingDuration", nonSmokingDuration)
  }, [nonSmokingDuration])

  return (
    <Center>
      <Group spacing='xs'>
        <div>
          <div
            style={{
              width: 240,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div>
              <Image
                width={300}
                height={300}
                objectFit='contain'
                src='/zouki/kanzo.png'
                alt='zouki image'
              />
            </div>
          </div>
          <div>臓器くんが死にそうです！禁煙してください！</div>
        </div>
        <div className='mb-5 balloon4'>
          <p>{cheeringMessage}</p>
        </div>
      </Group>
    </Center>
  )
}
