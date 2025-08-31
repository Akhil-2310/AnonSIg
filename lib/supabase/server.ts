import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

let _client: ReturnType<typeof createServerClient> | null = null

export function getSupabaseServer() {
  if (_client) return _client
  const cookieStore = cookies()

  _client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      async get(name: string) {
        return (await cookieStore).get(name)?.value
      },
      async set(name: string, value: string, options: any) {
        (await cookieStore).set(name, value, options)
      },
      async remove(name: string, options: any) {
        (await cookieStore).set(name, "", { ...options, maxAge: 0 })
      },
    },
  })

  return _client
}
