import { ScrollArea, Stack, Text } from "@mantine/core"
import { FC } from "react"

import { Signage } from "./Signage"

export const SignageList: FC = () => {
  return (
    <div className='mt-10'>
      <Text size={20}>人気の病院とあなたへのおすすめ</Text>
      <ScrollArea scrollHideDelay={300} className='h-130 mt-3'>
        <Stack>
          <Signage hospitalNumber={0} />
          <Signage hospitalNumber={1} />
          <Signage hospitalNumber={2} />
          <Signage hospitalNumber={3} />
        </Stack>
      </ScrollArea>
    </div>
  )
}
