import { Center, Group } from "@mantine/core"
import Image from "next/image"
import { FC, useEffect, useState } from "react"
import { riskReductionMessage } from "./riskReductionMessage"
import { zokikunImage } from "./zoukikunImage"

type Props = {
  nonSmokingDuration: number
}

export const ZoukiKun: FC<Props> = ({ nonSmokingDuration }) => {
  const [cheeringMessage, setCheeringMessage] = useState("")
  useEffect(() => {
    // setCheeringMessage("血中の酸素濃度が上昇してきたよ")
    setCheeringMessage(riskReductionMessage(nonSmokingDuration))
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
                src={zokikunImage(nonSmokingDuration)}
                alt='zouki image'
              />
            </div>
          </div>
        </div>
        <div className='mb-5 balloon4'>
          <p>{cheeringMessage}</p>
        </div>
      </Group>
    </Center>
  )
}
