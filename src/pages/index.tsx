import { Button } from "@mantine/core"
import type { NextPage } from "next"
import { Layout } from "../components/Layout"
import Link from "next/link"

const Home: NextPage = () => {
  return (
    <Layout>
      <div className='flex gap-3'>
        <button className='font-bold bg-blue-500 text-white py-2.3 px-3'>
          button
        </button>
        <Button>button</Button>
        <Link href='/sample'>sampleページに移動</Link>
      </div>
    </Layout>
  )
}

export default Home
