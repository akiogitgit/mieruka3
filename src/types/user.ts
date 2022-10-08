export type AuthFormParams = {
  email: string
  password: string
  name: string
  num_tabaco_per_day: number
  tabaco_price: number
}

export type AuthUser = {
  id: string
  email: string
}

export type Profile = {
  id: string
  name: string
  created_at: string
  num_tabaco_per_day: number
  tabaco_price: number
}
