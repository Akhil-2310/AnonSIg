"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/", label: "Home" },
  { href: "/groups", label: "All Groups" },
  { href: "/my-groups", label: "My Groups" },
  { href: "/create-group", label: "Create Group" },
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <header className="w-full border-b border-black/10 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight text-black">
          Anonymous Signalling
        </Link>
        <ul className="flex items-center gap-4">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    "text-sm " + (active ? "text-black underline underline-offset-4" : "text-black/70 hover:text-black")
                  }
                >
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
