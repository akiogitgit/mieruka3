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
      <div className='flex flex-col-reverse gap-3 items-center sm:flex-row'>
        <div className='w-240px'>
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
        <div className='font-bold mb-5 balloon4'>{cheeringMessage}</div>
      </div>
    </Center>
  )
}
