export type Chat = {
  id: number
  created_at: string
  user_id: string
  user_name: string
  message: string
  nice_count: number
}

export type ChatFormParams = Pick<Chat, "user_id" | "user_name" | "message">
