"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { BlurFade } from "@/components/ui/blur-fade"

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 bg-[#d4782a]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#d4782a] via-[#e8943a] to-[#d4782a]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwIDIwbDEwLTEwIDEwIDEwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] opacity-20" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <BlurFade inView>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Ready to eliminate production halts?
          </h2>
          <p className="mt-4 text-lg text-white/80 md:text-xl">
            Join 500+ factories already using FixForge to keep their operations running.
          </p>
        </BlurFade>

        <BlurFade inView delay={0.1} className="mt-8">
          <Link href="/register">
            <ShimmerButton
              shimmerColor="#ffffff"
              background="rgba(255, 255, 255, 0.15)"
              className="text-[1rem] font-medium px-10 py-3 rounded-full"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </ShimmerButton>
          </Link>
        </BlurFade>
      </div>
    </section>
  )
}
