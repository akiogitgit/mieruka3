import React, { FC, ReactNode, useCallback, useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { Burger, Button, Drawer } from "@mantine/core"
import { supabase } from "../utils/supabase"
import { useRouter } from "next/router"
import { showNotification } from "@mantine/notifications"
import useStore from "../store"

type Props = {
  children: ReactNode
  title?: string
}

const menus = [
  { path: "/", label: "ホーム" },
  { path: "/calendar", label: "カレンダー" },
  { path: "/chat", label: "タイムライン" },
  { path: "/direct-message", label: "医者とのDM" },
]

export const Layout: FC<Props> = ({ title = "禁煙ミエルカ", children }) => {
  const [opened, setOpened] = useState(false)
  const [menuAnimateFire, setMenuAnimateFire] = useState(false)
  const session = useStore(s => s.session)
  const router = useRouter()

  // ログアウト
  const signOut = useCallback(() => {
    supabase.auth.signOut()
    setOpened(false)
    showNotification({
      title: "ログアウトに成功しました",
      message: "",
    })
    console.log("signOut")
  }, [])

  const onOpenMenu = useCallback(() => {
    setOpened(true)
    setTimeout(() => {
      setMenuAnimateFire(true)
    }, 100)
  }, [])

  const onCloseMenu = useCallback(() => {
    setOpened(false)
    setTimeout(() => {
      setMenuAnimateFire(false)
    }, 100)
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 overflow-hidden'>
      <Head>
        <title>{title}</title>
        <meta
          name='description'
          content='禁煙をモチベーションを保ち、続けられるサービス'
        />
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

          <div className='flex flex-row-reverse gap-3 items-center md:flex-row'>
            <Burger
              className='md:hidden'
              opened={opened}
              onClick={onOpenMenu}
              color='white'
            />
            <div className='hidden md:(flex gap-3) '>
              {menus.map(menu => (
                <Link href={menu.path} key={menu.path}>
                  <a className={`font-bold text-white text-sm group`}>
                    {menu.label}
                    <div
                      className={`
                    ${
                      router.pathname === menu.path ? "w-full" : "w-0"
                    } bg-white h-1px mt-1 duration-150 group-hover:w-full`}
                    ></div>
                  </a>
                </Link>
              ))}
            </div>
            {session ? (
              <Button
                className='hidden md:block'
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
            onClose={onCloseMenu}
            padding='xl'
            position='right'
            size='sm'
          >
            <div className='flex flex-col gap-3 items-start'>
              {menus.map((menu, index) => (
                <Link href={menu.path} key={menu.path}>
                  <a
                    className={`${
                      router.pathname === menu.path &&
                      "text-blue-500 font-bold "
                    }
                      ${menuAnimateFire ? "translate-x-0" : "translate-x-20"}
                      ${index === 1 && "delay-50"}
                      ${index === 2 && "delay-100"}
                      ${index === 3 && "delay-150"}
                    } group transform ease-in duration-300 ,
                    )}`}
                  >
                    {menu.label}
                    <div className='bg-blue-500 h-1 w-0 duration-100 group-hover:w-[100%]'></div>
                  </a>
                </Link>
              ))}
              {session ? (
                <Button
                  color='blue'
                  variant='light'
                  onClick={signOut}
                  className='w-full'
                >
                  LogOut
                </Button>
              ) : (
                <Link href='/auth'>
                  <Button color='blue' className='w-full'>
                    LogIn
                  </Button>
                </Link>
              )}
            </div>
          </Drawer>
        </nav>
      </header>
      <main>
        <div className='mx-auto max-w-800px py-10 px-4'>{children}</div>
      </main>
    </div>
  )
}
