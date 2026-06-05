import { Wrench } from "lucide-react"
import Link from "next/link"

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Smart Matching", href: "#features" },
      { label: "Real-time Tracking", href: "#features" },
      { label: "Instant Response", href: "#features" },
      { label: "5 Specialties", href: "#features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Partners", href: "#" },
      { label: "Techicians", href: "/register?type=technician" },
      { label: "Privacy", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[#141210] text-[#9e9790]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[#d4782a]" />
              <span className="text-lg font-bold text-[#e8e4de]">FixForge</span>
            </Link>
            <p className="mt-3 text-sm text-[#9e9790] max-w-xs">
              India&apos;s first on-demand marketplace for industrial repair technicians.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[#e8e4de] mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#9e9790] transition-colors hover:text-[#e8e4de]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#2a2620] pt-6 text-center text-sm text-[#9e9790]">
          <p>Built for the Razorpay FixMyItch Challenge</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} FixForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
