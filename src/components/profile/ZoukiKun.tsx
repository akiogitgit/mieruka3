import { Center, Group } from "@mantine/core"
import Image from "next/image"
import { FC, useEffect, useState } from "react"
import { riskReductionMessage } from "./riskReductionMessage"
import { zokikunImage } from "./zoukikunImage"

type Props = {
  continuousNonSmokingDuration: number
}

export const ZoukiKun: FC<Props> = ({ continuousNonSmokingDuration }) => {
  const [cheeringMessage, setCheeringMessage] = useState("")
  useEffect(() => {
    // setCheeringMessage("血中の酸素濃度が上昇してきたよ")
    setCheeringMessage(riskReductionMessage(continuousNonSmokingDuration))
    console.log("continuousNonSmokingDuration", continuousNonSmokingDuration)
  }, [continuousNonSmokingDuration])

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
                src={zokikunImage(continuousNonSmokingDuration)}
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
