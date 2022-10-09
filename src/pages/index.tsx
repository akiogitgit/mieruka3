import { Button, Center, Stack, Image, Group } from "@mantine/core"
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
        <Stack className='flex flex-wrap gap-10'>
          <div>
            継続日数
            <div></div>
          </div>
          <div>節約金額</div>
          <div>寿命伸びた</div>
          <div>応援メッセージ</div>
          <div>リスクが下がった</div>
          <div>
            臓器くん
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
                      radius='md'
                      src='/zouki/kanzo.png'
                      alt='zouki image'
                      caption=''
                    />
                  </div>
                </div>
                <div>臓器くんが死にそうです！禁煙してください！</div>
              </div>
              <div className='mb-5 balloon4'>
                <p>寿命が-1000日伸びたよ！</p>
              </div>
            </Group>
          </div>
        </Stack>
        <Center>
          <Stack>
            <Button radius='xl' size='xl'>
              😖 助けて
            </Button>
            <Button radius='xl' size='xl'>
              😭 吸っちゃったあ
            </Button>
          </Stack>
        </Center>
      </div>
    </Layout>
  )
}

export default Home
