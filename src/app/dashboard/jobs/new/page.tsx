'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import Link from 'next/link'

const specialties = ['HVAC', 'Plumbing', 'Electrical', 'Pest', 'Industrial']
const urgencies = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

export default function NewJobPage() {
  const router = useRouter()
  const [factoryId, setFactoryId] = useState<number | null>(null)
  const [specialty, setSpecialty] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (!meData.user) { router.push('/login'); return }

        const factoriesRes = await fetch('/api/factories')
        const factories = await factoriesRes.json()
        const factory = (Array.isArray(factories) ? factories : []).find(
          (f: { email: string }) => f.email === meData.user.email
        )
        if (!factory) { router.push('/dashboard'); return }
        setFactoryId(factory.id)
      } catch {
        router.push('/login')
      }
    }
    load()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!factoryId || !specialty || !description) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factoryId,
          specialtyNeeded: specialty,
          urgency,
          description,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to create job')
        return
      }

      toast.success('Job posted successfully!')
      router.push('/dashboard/jobs')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Post a New Job</h1>
      </div>

      <div className="bg-white border border-[#d4d0ca] rounded-[12px]">
        <div className="p-6 border-b border-[#d4d0ca]">
          <h3 className="text-[1rem] font-semibold text-[#1a1a1a]">Job Details</h3>
          <p className="text-[0.875rem] text-[#4a4540] mt-1">Describe the repair issue and submit it for technicians.</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1.5 block">Specialty Needed</label>
              <Select value={specialty} onValueChange={(v) => setSpecialty(v ?? '')} required>
                <SelectTrigger className="w-full bg-white border border-[#d4d0ca] rounded-[8px] px-3 py-2 text-[0.9375rem] text-[#1a1a1a] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition">
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1.5 block">Urgency</label>
              <Select value={urgency} onValueChange={(v) => setUrgency(v ?? 'normal')}>
                <SelectTrigger className="w-full bg-white border border-[#d4d0ca] rounded-[8px] px-3 py-2 text-[0.9375rem] text-[#1a1a1a] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {urgencies.map((u) => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1.5 block">Description</label>
              <Textarea
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="bg-white border border-[#d4d0ca] rounded-[8px] px-3 py-2 text-[0.9375rem] text-[#1a1a1a] placeholder:text-[#8a8580] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition"
              />
            </div>

            <Button type="submit" className="w-full bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]" disabled={submitting || !factoryId}>
              {submitting ? 'Submitting...' : 'Submit Job'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
