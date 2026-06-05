'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Star, Save, ArrowLeft } from 'lucide-react'

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

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <p className="text-sm font-medium">{technician.name}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm font-medium">{technician.email || '—'}</p>
            </div>
            <div className="space-y-2">
              <Label>Specialty</Label>
              <div>
                <Badge variant="outline">{technician.specialty}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <p className="text-sm font-medium">{technician.city}</p>
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              {renderStars(technician.rating)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Available for new jobs</p>
              <p className="text-xs text-muted-foreground">
                {available ? 'You are visible for new assignments' : 'You are hidden from new assignments'}
              </p>
            </div>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            <Save className="mr-2 size-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
