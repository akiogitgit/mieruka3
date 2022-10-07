export type SamplePost = {
  id: number
  content: string
}

export type Sample = {
  id: number
  text: string
  label: "good" | "bad"
  published: boolean
  posts: SamplePost[]
}
