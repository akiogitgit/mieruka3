import { Button, Center, Loader, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { NextPage } from "next"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { Layout } from "../components/Layout"

type Form = {
  id: number
  title: "aa" | "bb"
}

const Sample: NextPage = () => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
    },
  })
  const [num, setNum] = useState(0)
  const [name, setName] = useState("aaaa")
  const onClick = useCallback(() => {
    setNum(num + 1)
  }, [num])

  useEffect(() => {
    // alert(num)
    setNum(num + 1)
  }, [])

  const onSubmit = useCallback(() => {
    // alert(JSON.stringify(form.values))
    // alert(form.values.email)
  }, [form.values])

  const style = "text-200px hover:text-100px"

  return (
    <Layout>
      <h1>Sample</h1>
      {JSON.stringify(form.values)}
      {!form.values.email && <Loader />}

      <div>
        <button
          className=' bg-blue-500 text-white py-23px px-4 transform duration-300 
        hover:(rotate-360 scale-200 bg-red-500 translate-x-200px) '
        >
          button
        </button>
        <Button>button</Button>
      </div>
      <div className='bg-red-500 inline hover:bg-blue-500'>aaa</div>
      {name}
      <input type='text' value={name} onChange={e => setName(e.target.value)} />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput {...form.getInputProps("name")} />
        <TextInput {...form.getInputProps("email")} />
        <Button type='submit'>Submit</Button>
      </form>
      <Button onClick={onClick}>Click me!</Button>
      <p className='text-100px'>{num}</p>
      <Center mt='100px'>
        <Link href='/'>indexページに戻る</Link>
      </Center>
    </Layout>
  )
}

export default Sample
