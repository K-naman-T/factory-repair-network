"use client"

import { Star } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Card } from "@/components/ui/card"

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
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade inView>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Trusted by Industry Leaders
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hear from the factory managers who rely on FixForge.
            </p>
          </div>
        </BlurFade>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <BlurFade key={t.author + t.company} inView delay={0.1 + i * 0.1}>
              <Card className="flex h-full flex-col p-6">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 border-t pt-4">
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.company}</p>
                </div>
              </Card>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
