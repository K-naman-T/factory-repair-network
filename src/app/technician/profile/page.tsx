'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Star, Save, ArrowLeft, User } from 'lucide-react'

interface Technician {
  id: number
  name: string
  email?: string | null
  specialty: string
  city: string
  phone: string
  available: boolean
  rating: number
}

export default function TechnicianProfilePage() {
  const router = useRouter()
  const [technician, setTechnician] = useState<Technician | null>(null)
  const [phone, setPhone] = useState('')
  const [available, setAvailable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (!meData.user) {
          router.push('/login')
          return
        }

        const techRes = await fetch('/api/technicians')
        const techs: Technician[] = await techRes.json()
        const tech = techs.find((t: Technician) => t.email === meData.user.email)
        if (!tech) {
          setLoading(false)
          return
        }
        setTechnician(tech)
        setPhone(tech.phone)
        setAvailable(tech.available)
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  async function handleSave() {
    if (!technician) return
    setSaving(true)
    try {
      const res = await fetch(`/api/technicians/${technician.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, available }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update profile')
      }
      const updated = await res.json()
      setTechnician((prev) => prev ? { ...prev, ...updated } : null)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-4 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!technician) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Technician profile not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/technician')}>
          Back to Assignments
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Button variant="ghost" size="sm" onClick={() => router.push('/technician')}>
        <ArrowLeft className="mr-2 size-4" />
        Back to Assignments
      </Button>

      <div className="bg-white border border-[#d4d0ca] rounded-[12px]">
        <div className="p-6 border-b border-[#d4d0ca]">
          <h3 className="text-[1rem] font-semibold text-[#1a1a1a]">Profile</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1">Name</p>
              <p className="text-[0.9375rem] text-[#1a1a1a]">{technician.name}</p>
            </div>
            <div>
              <p className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1">Email</p>
              <p className="text-[0.9375rem] text-[#1a1a1a]">{technician.email || '—'}</p>
            </div>
            <div>
              <p className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1">Specialty</p>
              <span className="inline-flex items-center rounded-[9999px] px-2.5 py-0.5 text-[0.75rem] font-medium bg-[#f8f7f5] text-[#4a4540]">{technician.specialty}</span>
            </div>
            <div>
              <p className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1">City</p>
              <p className="text-[0.9375rem] text-[#1a1a1a]">{technician.city}</p>
            </div>
            <div>
              <p className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1">Rating</p>
              {renderStars(technician.rating)}
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1.5 block">Phone Number</label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="bg-white border border-[#d4d0ca] rounded-[8px] px-3 py-2 text-[0.9375rem] text-[#1a1a1a] placeholder:text-[#8a8580] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition"
            />
          </div>

          <div className="flex items-center justify-between bg-white border border-[#d4d0ca] rounded-[8px] p-3">
            <div>
              <p className="text-[0.9375rem] font-medium text-[#1a1a1a]">Available for new jobs</p>
              <p className="text-[0.8125rem] text-[#4a4540]">
                {available ? 'You are visible for new assignments' : 'You are hidden from new assignments'}
              </p>
            </div>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </div>

          <Button onClick={handleSave} disabled={saving} className="bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]">
            <Save className="mr-2 size-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
