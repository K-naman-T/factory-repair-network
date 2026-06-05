'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { label: string; className: string }> = {
    assigned: { label: 'Pending Acceptance', className: 'bg-[#fdf0e3] text-[#d4782a]' },
    in_progress: { label: 'In Progress', className: 'bg-[#fdf0e3] text-[#d4782a]' },
    resolved: { label: 'Completed', className: 'bg-[#e8f5ec] text-[#2d7d46]' },
  }
  const s = styles[status] || { label: status.replace('_', ' '), className: 'bg-[#f8f7f5] text-[#4a4540]' }
  return (
    <span className={`inline-flex items-center rounded-[9999px] px-2.5 py-0.5 text-[0.75rem] font-medium ${s.className}`}>
      {s.label}
    </span>
  )
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const styles: Record<string, string> = {
    low: 'bg-[#f8f7f5] text-[#4a4540]',
    normal: 'bg-[#e8eef5] text-[#1e3a5f]',
    high: 'bg-[#fdf0e3] text-[#d4782a]',
    critical: 'bg-[#f9e8e8] text-[#c62828]',
  }
  return (
    <span className={`inline-flex items-center rounded-[9999px] px-2.5 py-0.5 text-[0.75rem] font-medium ${styles[urgency] || 'bg-[#f8f7f5] text-[#4a4540]'}`}>
      {urgency}
    </span>
  )
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

      <div className="bg-white border border-[#d4d0ca] rounded-[12px] p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-[1.125rem] font-semibold text-[#1a1a1a]">Job #{job.id}</h3>
            <p className="text-[0.875rem] text-[#4a4540] mt-0.5">{job.specialtyNeeded}</p>
          </div>
          <div className="flex items-center gap-2">
            <UrgencyBadge urgency={job.urgency} />
            <StatusBadge status={job.status} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-[0.875rem] font-medium text-[#1a1a1a] mb-2">Issue Description</h4>
            <p className="text-[0.9375rem] text-[#4a4540] leading-relaxed">{job.description}</p>
          </div>

          <div className="bg-white border border-[#d4d0ca] rounded-[8px] p-4 space-y-3">
            <h4 className="text-[0.875rem] font-medium text-[#1a1a1a]">Factory Details</h4>
            <div className="grid gap-2 text-[0.9375rem] sm:grid-cols-2">
              <div className="flex items-center gap-2 text-[#4a4540]">
                <Building2 className="size-4 shrink-0" />
                <span>{job.factory.name}</span>
              </div>
              <div className="flex items-center gap-2 text-[#4a4540]">
                <MapPin className="size-4 shrink-0" />
                <span>{job.factory.address}, {job.factory.city}</span>
              </div>
              <div className="flex items-center gap-2 text-[#4a4540]">
                <Phone className="size-4 shrink-0" />
                <span>{job.factory.phone}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[0.875rem] font-medium text-[#1a1a1a] mb-3">Timeline</h4>
            <div className="space-y-2">
              {timelineSteps.map((step, idx) => {
                const Icon = step.icon
                const isActive = idx <= statusIdx
                const isCurrent = idx === statusIdx
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`flex size-8 items-center justify-center rounded-full ${
                      isActive ? 'bg-[#e8eef5] text-[#1e3a5f]' : 'bg-[#f8f7f5] text-[#8a8580]'
                    }`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-[0.9375rem] font-medium ${isActive ? 'text-[#1a1a1a]' : 'text-[#8a8580]'}`}>
                        {step.label}
                        {isCurrent && ' (Current)'}
                      </p>
                      {step.key === 'created' && (
                        <p className="text-[0.8125rem] text-[#4a4540]">{formatDate(job.createdAt)}</p>
                      )}
                      {step.key === 'resolved' && job.resolvedAt && (
                        <p className="text-[0.8125rem] text-[#4a4540]">{formatDate(job.resolvedAt)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {job.status === 'assigned' && (
              <>
                <Button className="bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]" onClick={() => handleStatusUpdate('in_progress')}>
                  Accept Job
                </Button>
                <Button variant="destructive" className="rounded-[8px]" onClick={() => handleStatusUpdate('cancelled')}>
                  Decline
                </Button>
              </>
            )}
            {job.status === 'in_progress' && (
              <Button className="bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]" onClick={() => handleStatusUpdate('resolved')}>
                Mark Resolved
              </Button>
            )}
            {job.status === 'resolved' && (
              <p className="text-[0.9375rem] text-[#4a4540]">This job has been completed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
