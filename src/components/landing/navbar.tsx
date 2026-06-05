"use client"

import { useState } from "react"
import Link from "next/link"
import { Wrench, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#stats", label: "Stats" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-[#f4f2ee]/80 backdrop-blur-md supports-backdrop-filter:bg-[#f4f2ee]/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-[#1e3a5f]" />
          <span className="text-[1.25rem] font-bold text-[#1e3a5f]">FixForge</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.875rem] text-[#4a4540] transition-colors hover:text-[#1a1a1a]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/register">
            <Button
              className="bg-[#d4782a] text-white rounded-[8px] px-4 py-2 text-[0.8125rem] font-medium hover:bg-[#e8943a] transition-all active:scale-[0.98]"
              size="sm"
            >
              Get Started
            </Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon-sm" />}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="right" showCloseButton={true}>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="mt-8 flex flex-col gap-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-[#4a4540] transition-colors hover:text-[#1a1a1a]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-3 pt-4 border-t border-[#d4d0ca]">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-[#d4782a] text-white rounded-[8px] hover:bg-[#e8943a] transition-all active:scale-[0.98]">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
