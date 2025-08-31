import { cookies } from "next/headers"

const COOKIE_NAME = "device_id"

function genId() {
  // uuid v4 (simple)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function getOrSetDeviceIdServer() {
  const jar = await cookies()
  const existing = jar.get(COOKIE_NAME)?.value
  if (existing) return existing
  const id = genId()
  ;jar.set(COOKIE_NAME, id, { httpOnly: false, sameSite: "lax", path: "/" })
  return id
}
