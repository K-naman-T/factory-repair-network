'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ClipboardList, User, Menu, LogOut } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { ThemeToggle } from '@/components/theme-toggle'

const navItems = [
  { href: '/technician', label: 'My Assignments', icon: ClipboardList, exact: true },
  { href: '/technician/profile', label: 'Profile', icon: User },
]

export default function TechnicianShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUserName(data.user.name)
          setUserEmail(data.user.email)
        }
      })
      .catch(() => router.push('/login'))
  }, [router])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const sidebar = (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className="px-4">
        <h2 className="text-lg font-semibold tracking-tight">FixForge</h2>
        <p className="text-xs text-muted-foreground">Technician Portal</p>
      </div>
      <Separator />
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#e8eef5] text-[#1e3a5f] font-medium'
                  : 'text-[#4a4540] hover:bg-[#f8f7f5] hover:text-[#1a1a1a]'
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <Separator />
      <div className="px-4">
        <p className="text-xs text-muted-foreground">{userEmail}</p>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#f4f2ee]">
      <Toaster />
      <aside className="hidden w-56 shrink-0 border-r border-[#d4d0ca] bg-white md:block">
        {sidebar}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-56 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-[#d4d0ca] bg-white px-4 md:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex items-center justify-center rounded-lg hover:bg-muted size-8 shrink-0"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation</span>
          </button>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{userName || 'Loading...'}</span>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
