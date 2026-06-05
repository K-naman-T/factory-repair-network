'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { ArrowLeft, MapPin, Phone, Building2, Clock, CheckCircle2, Wrench } from 'lucide-react'

interface Technician {
  id: number
  name: string
  specialty: string
}

interface Factory {
  id: number
  name: string
  address: string
  city: string
  phone: string
}

interface Job {
  id: number
  specialtyNeeded: string
  description: string
  status: string
  urgency: string
  cost: number
  createdAt: string
  resolvedAt: string | null
  factoryId: number
  technicianId: number | null
  factory: Factory
  technician?: Technician | null
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' }> = {
  assigned: { label: 'Pending Acceptance', variant: 'secondary' },
  in_progress: { label: 'In Progress', variant: 'outline' },
  resolved: { label: 'Completed', variant: 'ghost' },
}

const urgencyVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  low: 'secondary',
  normal: 'default',
  high: 'destructive',
  critical: 'destructive',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const timelineSteps = [
  { key: 'created', label: 'Created', icon: Clock },
  { key: 'assigned', label: 'Assigned', icon: Building2 },
  { key: 'in_progress', label: 'In Progress', icon: Wrench },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2 },
]

function getStatusIndex(status: string) {
  const order = ['open', 'assigned', 'in_progress', 'resolved']
  return order.indexOf(status)
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (!meData.user) {
          router.push('/login')
          return
        }

        const res = await fetch(`/api/jobs/${params.id}`)
        if (!res.ok) {
          router.push('/technician')
          return
        }
        const data = await res.json()
        setJob(data)
      } catch {
        router.push('/technician')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, router])

  async function handleStatusUpdate(newStatus: string) {
    if (!job) return
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update job')
      }
      const updated = await res.json()
      setJob(updated)
      toast.success(`Job moved to "${newStatus.replace('_', ' ')}"`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update job')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Job not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/technician')}>
          Back to Assignments
        </Button>
      </div>
    )
  }

  const statusIdx = getStatusIndex(job.status)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/technician')}>
        <ArrowLeft className="mr-2 size-4" />
        Back to Assignments
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Job #{job.id}</CardTitle>
              <p className="text-sm text-muted-foreground">{job.specialtyNeeded}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={urgencyVariant[job.urgency] || 'outline'}>{job.urgency}</Badge>
              <Badge variant={statusConfig[job.status]?.variant || 'outline'}>
                {statusConfig[job.status]?.label || job.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium">Issue Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="text-sm font-medium">Factory Details</h3>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="size-4 shrink-0" />
                <span>{job.factory.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <span>{job.factory.address}, {job.factory.city}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4 shrink-0" />
                <span>{job.factory.phone}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Timeline</h3>
            <div className="space-y-2">
              {timelineSteps.map((step, idx) => {
                const Icon = step.icon
                const isActive = idx <= statusIdx
                const isCurrent = idx === statusIdx
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`flex size-8 items-center justify-center rounded-full ${
                      isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                        {isCurrent && ' (Current)'}
                      </p>
                      {step.key === 'created' && (
                        <p className="text-xs text-muted-foreground">{formatDate(job.createdAt)}</p>
                      )}
                      {step.key === 'resolved' && job.resolvedAt && (
                        <p className="text-xs text-muted-foreground">{formatDate(job.resolvedAt)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3">
            {job.status === 'assigned' && (
              <>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate('in_progress')}>
                  Accept Job
                </Button>
                <Button variant="destructive" onClick={() => handleStatusUpdate('cancelled')}>
                  Decline
                </Button>
              </>
            )}
            {job.status === 'in_progress' && (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleStatusUpdate('resolved')}>
                Mark Resolved
              </Button>
            )}
            {job.status === 'resolved' && (
              <p className="text-sm text-muted-foreground">This job has been completed.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
