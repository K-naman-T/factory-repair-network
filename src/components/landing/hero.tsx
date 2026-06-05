"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { BlurFade } from "@/components/ui/blur-fade"

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#f4f2ee]">
      <div className="mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-4 sm:px-6 lg:px-8 pt-32 md:pt-0">
        <div className="flex flex-1 flex-col md:flex-row md:items-center md:gap-16 lg:gap-24">
          {/* Left: Content (50%) */}
          <div className="flex-1 md:max-w-xl lg:max-w-2xl">
            <BlurFade delay={0.1} inView>
              <div className="mb-6 inline-flex items-center rounded-full border border-[#d4782a]/30 bg-[#d4782a]/5 px-4 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-[#d4782a]">
                Industrial Repair Marketplace
              </div>
            </BlurFade>

            <BlurFade delay={0.15} inView>
              <h1 className="text-[2.25rem] font-bold tracking-tighter leading-none md:text-[4rem] md:tracking-[-2.56px] md:leading-[1.0]">
                From Breakdown
                <br />
                to{" "}
                <span className="text-[#d4782a]">
                  Fix in Hours
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <p className="mt-6 text-[1.125rem] leading-[1.6] text-[#4a4540] max-w-lg">
                India&apos;s first on-demand marketplace connecting factory owners with qualified industrial repair technicians.
              </p>
            </BlurFade>

            <BlurFade delay={0.25} inView className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <ShimmerButton
                  shimmerColor="#fdf0e3"
                  background="#d4782a"
                  className="text-[1rem] font-medium px-8 py-3 rounded-full flex gap-2"
                >
                  Post a Repair Job
                  <ArrowRight className="h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Link href="/register?type=technician">
                <Button
                  variant="outline"
                  className="h-12 px-8 rounded-full border-2 border-[#b0aba5] text-[#1a1a1a] hover:border-[#4a4540] transition-all"
                >
                  I&apos;m a Technician
                </Button>
              </Link>
            </BlurFade>

            <BlurFade delay={0.3} inView className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-white bg-[#d4d0ca]"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">200+ Technicians</p>
                <p className="text-xs text-[#8a8580]">Across 5 cities in Jharkhand</p>
              </div>
            </BlurFade>
          </div>

          {/* Right: Image (50%) */}
          <BlurFade delay={0.35} inView className="relative mt-12 md:mt-0 md:w-1/2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-[#d4d0ca]">
              <img
                src="/images/hero-industrial.jpg"
                alt="Engineer inspecting industrial machinery"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f4f2ee]/80 via-transparent to-transparent" />

              {/* Floating stat card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4782a]">
                    <span className="text-[1.25rem] font-bold text-white">78.5</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Severity Score</p>
                    <p className="text-xs text-white/70">Industrial Repair Index</p>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
