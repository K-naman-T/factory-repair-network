import { Wrench } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">FixForge</span>
          </div>

          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="transition-colors hover:text-foreground">
              How It Works
            </Link>
            <Link href="#stats" className="transition-colors hover:text-foreground">
              Stats
            </Link>
            <Link href="/login" className="transition-colors hover:text-foreground">
              Login
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>Built for the Razorpay FixMyItch Challenge</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} FixForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
