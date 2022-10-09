import React, { FC, ReactNode, useCallback, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { Burger, Button, Drawer } from "@mantine/core"
import { supabase } from "../utils/supabase"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import { useRouter } from "next/router"

type Props = {
  children: ReactNode
  title?: string
}

// NOTE: authは別にする。ログインしていたらログアウトボタン表示
const menus = [
  { path: "/", label: "ホーム" },
  { path: "/calendar", label: "カレンダー" },
  { path: "/chat", label: "タイムライン" },
  { path: "/direct-message", label: "医者とのDM" },
]

export const Layout: FC<Props> = ({ title = "禁煙ミエルカ", children }) => {
  const [opened, setOpened] = useState(false)
  const session = useIsLoggedIn()
  const router = useRouter()

  // ログアウト
  const signOut = useCallback(() => {
    supabase.auth.signOut()
    console.log("signOut")
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 overflow-hidden'>
      <Head>
        <title>{title}</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className='bg-blue-500 shadow-lg w-full py-2 top-0 z-100'>
        <nav className='flex mx-5 items-center justify-between'>
          <Link href='/'>
            <h1 className='cursor-pointer flex items-center'>
              <Image
                src='/favicon.ico'
                height={50}
                width={50}
                alt=''
                objectFit='contain'
                className='transform scale-140'
              />
              <span className='font-mono text-white ml-3'>禁煙ミエルカ</span>
            </h1>
          </Link>

          <div className='flex flex-row-reverse gap-3 items-center sm:flex-row'>
            <Burger
              className='sm:hidden'
              opened={opened}
              onClick={() => setOpened(o => !o)}
              color='white'
            />
            <div className='hidden sm:(flex gap-3) '>
              {menus.map(menu => (
                <Link href={menu.path} key={menu.path}>
                  <a
                    className={`${
                      router.pathname === menu.path && "border-b"
                    } font-bold text-white text-sm`}
                  >
                    {menu.label}
                  </a>
                </Link>
              ))}
            </div>
            {session ? (
              <Button
                className='hidden sm:block'
                color='blue'
                variant='light'
                onClick={signOut}
              >
                LogOut
              </Button>
            ) : (
              <Link href='/auth'>
                <Button color='blue' variant='light'>
                  LogIn
                </Button>
              </Link>
            )}
          </div>

          <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            padding='xl'
            position='right'
            size='sm'
          >
            <div className='flex flex-col gap-3'>
              {menus.map(menu => (
                <Link href={menu.path} key={menu.path}>
                  <a className='duration-300 hover:(text-blue-500 font-bold) '>
                    {menu.label}
                  </a>
                </Link>
              ))}
              {!session ? (
                <Link href='/auth'>
                  <Button color='blue'>LogIn</Button>
                </Link>
              ) : (
                <Button color='blue' variant='light' onClick={signOut}>
                  LogOut
                </Button>
              )}
            </div>
          </Drawer>
        </nav>
      </header>
      <main>
        <div className='mx-auto max-w-1150px py-10 px-2'>{children}</div>
      </main>
    </div>
  )
}
