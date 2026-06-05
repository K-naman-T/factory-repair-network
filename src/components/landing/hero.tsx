"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-background">
      {/* Background texture */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[90%] w-[55%] bg-gradient-to-bl from-secondary/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col md:flex-row md:items-center md:gap-16 lg:gap-24">
          {/* Left: Content */}
          <div className="flex-1 pt-32 md:pt-0 md:max-w-xl lg:max-w-2xl">
            <BlurFade delay={0.1} inView>
              <div className="mb-6 inline-flex items-center rounded-full border border-secondary/30 bg-secondary/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-secondary">
                Razorpay FixMyItch Challenge
              </div>
            </BlurFade>

            <BlurFade delay={0.15} inView>
              <h1 className="text-5xl font-bold tracking-tighter leading-none md:text-7xl lg:text-8xl">
                From Breakdown
                <br />
                to{" "}
                <span className="text-secondary">
                  Fix in Hours
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl md:max-w-lg">
                India&apos;s first on-demand marketplace connecting factory owners with qualified industrial repair technicians.
              </p>
            </BlurFade>

            <BlurFade delay={0.25} inView className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <ShimmerButton
                  shimmerColor="#ffffff"
                  background="#d4782a"
                  className="text-sm px-8 py-3 rounded-full"
                >
                  Post a Repair Job
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Link href="/register?type=technician">
                <Button variant="outline" size="lg" className="h-12 px-8 rounded-full border-2 border-muted-foreground/20 text-sm">
                  I&apos;m a Technician
                </Button>
              </Link>
            </BlurFade>

            <BlurFade delay={0.3} inView className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background bg-muted"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">200+ Technicians</p>
                <p className="text-xs text-muted-foreground">Across 5 cities in Jharkhand</p>
              </div>
            </BlurFade>
          </div>

          {/* Right: Image */}
          <BlurFade delay={0.35} inView className="relative mt-12 md:mt-0 md:w-[45%]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/50">
              <img
                src="/images/hero-industrial.jpg"
                alt="Engineer inspecting industrial machinery"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              {/* Floating stat card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <span className="text-xl font-bold text-white">78.5</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Severity Score</p>
                    <p className="text-xs text-white/70">Razorpay FixMyItch Index</p>
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
