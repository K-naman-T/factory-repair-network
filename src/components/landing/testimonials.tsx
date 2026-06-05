"use client"

import { Star } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"

const testimonials = [
  {
    quote: "Our conveyor belt broke at 2 AM. FixForge had a technician on-site by 6 AM.",
    author: "Plant Manager",
    company: "Tata Steel",
    rating: 5,
  },
  {
    quote: "We used to wait 3 days for an electrician. Now it&apos;s same-day.",
    author: "Operations Head",
    company: "Bhushan Steel",
    rating: 5,
  },
  {
    quote: "The matching is incredible. They sent someone who knew our exact machine model.",
    author: "Maintenance Lead",
    company: "JSW",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="bg-[#f4f2ee] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade inView>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a] md:text-4xl">
              Trusted by Industry Leaders
            </h2>
            <p className="mt-4 text-lg text-[#4a4540]">
              Hear from the factory managers who rely on FixForge.
            </p>
          </div>
        </BlurFade>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <BlurFade key={t.author + t.company} inView delay={0.1 + i * 0.1}>
              <div className="flex h-full flex-col bg-white border border-[#d4d0ca] rounded-[12px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[1.125rem] leading-relaxed text-[#1a1a1a]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 border-t border-[#d4d0ca] pt-4">
                  <p className="font-semibold text-[#1a1a1a]">{t.author}</p>
                  <p className="text-sm text-[#8a8580]">{t.company}</p>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
