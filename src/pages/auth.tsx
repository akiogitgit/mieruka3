import {
  Alert,
  Autocomplete,
  PasswordInput,
  NumberInput,
  Button,
  TextInput,
  Center,
} from "@mantine/core"
import { useForm, yupResolver } from "@mantine/form"
import { Session } from "@supabase/supabase-js"
import React, { useCallback, useEffect, useState } from "react"
import { Layout } from "../components/Layout"
import { AuthFormParams } from "../types/user"
import { supabase } from "../utils/supabase"

// 新規登録・ログインページ
// 一日の本数・一箱の金額の入力Form
// email, password, name, num_tabaco_per_day, tabaco_price

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")
  const [session, setSession] = useState<Session | null>(null)

  const form = useForm<AuthFormParams>({
    initialValues: {
      email: "",
      password: "",
      name: "",
      num_tabaco_per_day: 0,
      tabaco_price: 550,
    },
    validate: {
      email: (v: string) => {
        if (v.length === 0) {
          return "Emailは必須項目です"
        }
        if (!/^\S+@\S+$/.test(v)) {
          return "Emailのフォーマットで入力して下さい"
        }
        return null
      },
      password: (v: string) =>
        v.length < 6 ? "パスワードは6文字以上で入力して下さい" : null,
      name: (v: string) => (v === "" ? "名前は必須項目です" : null),
      num_tabaco_per_day: v => (v === 0 ? "一日に吸う本数は一本以上に" : null),
      tabaco_price: v => (v === 0 ? "タバコは0円以上で入力して下さい" : null),
    },
  })

  // form送信
  const onSubmit = useCallback(async () => {
    console.log("submit!")
    // 新規作成
    if (isRegister) {
      try {
        // 新規作成 supabaseのAuthenticatedに追加
        const { error: signUpError } = await supabase.auth.signUp({
          email: form.values.email,
          password: form.values.password,
        })

        if (signUpError) {
          setError(signUpError.message)
          return
        }

        // profiles作成
        const { error: profilesError } = await supabase
          .from("profiles")
          .insert({
            user_id: supabase.auth.user()?.id,
            name: form.values.name,
            num_tabaco_per_day: form.values.num_tabaco_per_day,
            tabaco_price: form.values.tabaco_price,
          })

        if (profilesError) {
          setError(profilesError.message)
          return
        }
      } catch (e) {
        // supabaseが取得出来ないエラー
        console.error(e)
      }

      form.reset() // フォームをリセット
    } else {
      // ログイン
      const { error } = await supabase.auth.signIn({
        email: form.values.email,
        password: form.values.password,
      })

      if (error) {
        setError(error.message)
        return
      }

      form.reset()
    }
  }, [form, isRegister])

  const onChangeForm = useCallback(() => {
    setIsRegister(!isRegister)
    setError("")

    if (isRegister) {
      form.setValues({
        email: "",
        password: "",
        name: "a",
        num_tabaco_per_day: 100,
        tabaco_price: 550,
      })
      return
    }
    form.reset()
  }, [form, isRegister])

  // ログインしていたら、setSessionに格納
  useEffect(() => {
    setSession(supabase.auth.session())
    // 最新のSessionで更新
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    console.log(session)
  }, [setSession, session])

  // ログアウト
  const signOut = useCallback(() => {
    supabase.auth.signOut()
    console.log("signOut")
  }, [])

  return (
    <Layout>
      <Center>
        <div className='w-300px'>
          <div className='flex flex-col justify-center items-center'>
            {/* <Center> */}
            {error && (
              <Alert
                mt='md'
                title='Authorization Error'
                color='red'
                radius='md'
              >
                {error}
              </Alert>
            )}
          </div>
          <div>
            {session ? (
              <Button
                color='red'
                variant='gradient'
                gradient={{ from: "yellow", to: "red" }}
                onClick={signOut}
              >
                Logout
              </Button>
            ) : (
              "ログインして下さい"
            )}
          </div>

          {/* form(定義したやつ)をsubmitする時onSubmitを発火 */}
          <form onSubmit={form.onSubmit(onSubmit)}>
            <div className='flex flex-col gap-3'>
              <Autocomplete
                label='Email'
                placeholder='example@gmail.com'
                withAsterisk
                data={
                  form.values.email.length > 0 &&
                  !form.values.email.includes("@")
                    ? [
                        "gmail.com",
                        "outlook.com",
                        "yahoo.com",
                        "icloud.com",
                      ].map(provider => `${form.values.email}@${provider}`)
                    : [""]
                }
                {...form.getInputProps("email")}
              />
              <PasswordInput
                withAsterisk
                label='パスワード'
                description='6文字以上で入力して下さい'
                {...form.getInputProps("password")}
              />
              {isRegister && (
                <>
                  <TextInput
                    label='名前'
                    placeholder=''
                    withAsterisk
                    {...form.getInputProps("name")}
                  />
                  <NumberInput
                    label=' タバコの一箱の値段'
                    description='普段吸っているタバコの金額を入力して下さい'
                    withAsterisk
                    min={0}
                    step={10}
                    {...form.getInputProps("tabaco_price")}
                  />
                  <NumberInput
                    label='一日に吸うタバコの本数'
                    withAsterisk
                    min={0}
                    {...form.getInputProps("num_tabaco_per_day")}
                  />
                </>
              )}
              <div className='flex justify-between'>
                <p className='text-sm' onClick={onChangeForm}>
                  {isRegister ? "ログイン" : "新規登録"}は
                  <span className='cursor-pointer text-blue-500'>こちら</span>
                </p>
                <Button mt='md' variant='gradient' type='submit'>
                  {isRegister ? "新規登録" : "ログイン"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Center>
    </Layout>
  )
}

export default Auth
