import { Button, Center } from "@mantine/core"
import { NextPage } from "next"
import Link from "next/link"
import { useCallback, useState } from "react"
import { Layout } from "../components/Layout"

const Sample: NextPage = () => {
  const [num, setNum] = useState(0)
  const onClick = useCallback(() => {
    setNum(num + 1)
  }, [num])

  return (
    <Layout>
      <h1>Sample</h1>
      <Button onClick={onClick}>Click me!</Button>
      <p className='text-100px'>{num}</p>
      <Center mt='100px'>
        <Link href='/'>indexページに戻る</Link>
      </Center>
    </Layout>
  )
}

export default Sample
