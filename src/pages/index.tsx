import { Button, Center } from "@mantine/core"
import type { NextPage } from "next"
import { Layout } from "../components/Layout"
import Link from "next/link"
import { Sample } from "../types/sample"

// メイン画面（継続日数、節約金額、応援メッセージ、リスクが下がった）
// 肺の背景が少し明るくするとか
// 臓器くん

const Home: NextPage = () => {
  const samples: Sample[] = [
    {
      id: 1,
      text: "string",
      label: "good",
      published: true,
      posts: [
        {
          id: 1,
          content: "content",
        },
      ],
    },
    {
      id: 2,
      text: "string2",
      label: "bad",
      published: false,
      posts: [
        {
          id: 1,
          content: "content",
        },
      ],
    },
  ]

  return (
    <Layout>
      <div>
        <div className='flex gap-3'>
          <button className='font-bold bg-blue-500 text-white py-2.3 px-3'>
            button
          </button>
          <Button>button</Button>
        </div>
        <ul className='flex flex-wrap gap-10'>
          {samples?.map(sample => (
            <li key={sample.id} className='w-200px'>
              <p>{sample.id}</p>
              <p>{sample.text}</p>
              <p>{sample.label}</p>
              <p>{sample.published ? "true" : "false"}</p>
            </li>
          ))}
        </ul>
        <Center>
          <Link href='/sample'>sampleページに移動</Link>
        </Center>
      </div>
    </Layout>
  )
}

export default Home
