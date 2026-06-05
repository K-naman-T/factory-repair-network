'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Briefcase, CheckCircle, IndianRupee, ClipboardList } from 'lucide-react'
import { toast } from 'sonner'

interface Technician {
  id: number
  name: string
  specialty: string
  city: string
  phone: string
  available: boolean
  rating: number
  email?: string | null
}

interface Factory {
  id: number
  name: string
  address: string
  city: string
  phone: string
  email?: string | null
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
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return d >= startOfWeek
}

export default function TechnicianPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
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

        const techRes = await fetch(`/api/technicians`)
        const techs: Technician[] = await techRes.json()
        const tech = techs.find((t) => t.email === meData.user.email)
        if (!tech) {
          setLoading(false)
          return
        }

        const jobsRes = await fetch(`/api/jobs?technicianId=${tech.id}`)
        const jobsData = await jobsRes.json()
        setJobs(Array.isArray(jobsData) ? jobsData : [])
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  async function handleStatusUpdate(jobId: number, newStatus: string) {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update job')
      }
      const updated = await res.json()
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...updated } : j)))
      toast.success(`Job moved to "${newStatus.replace('_', ' ')}"`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update job')
    }
  }

  const activeJobs = jobs.filter((j) => ['assigned', 'in_progress'].includes(j.status)).length
  const completedThisWeek = jobs.filter((j) => j.status === 'resolved' && isThisWeek(j.resolvedAt || '')).length
  const earnings = jobs.filter((j) => j.status === 'resolved').reduce((sum, j) => sum + j.cost, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#d4d0ca] rounded-[12px] p-6">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  const statCards = [
    { title: 'Active Jobs', value: activeJobs, icon: Briefcase },
    { title: 'Completed This Week', value: completedThisWeek, icon: CheckCircle },
    { title: 'Earnings', value: `₹${earnings.toLocaleString()}`, icon: IndianRupee },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Assignments</h1>
        <p className="text-sm text-muted-foreground">Manage your repair jobs and assignments.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white border border-[#d4d0ca] rounded-[12px] p-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[0.875rem] text-[#4a4540]">{stat.title}</p>
                <Icon className="size-4 text-[#8a8580]" />
              </div>
              <p className="text-[1.75rem] font-semibold text-[#1a1a1a]">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-[#d4d0ca] rounded-[12px] p-12 flex flex-col items-center justify-center text-center">
          <ClipboardList className="size-12 text-[#8a8580] mb-4" />
          <p className="text-[0.9375rem] text-[#4a4540]">
            No assignments yet. We&apos;ll notify you when a job matches your specialty.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            return (
              <div key={job.id} className="bg-white border border-[#d4d0ca] rounded-[12px] p-4 cursor-pointer transition-colors hover:bg-[#f8f7f5]" onClick={() => router.push(`/technician/jobs/${job.id}`)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[0.9375rem] font-medium text-[#1a1a1a]">{job.factory.name}</p>
                      <span className="inline-flex items-center rounded-[9999px] px-2.5 py-0.5 text-[0.75rem] font-medium bg-[#f8f7f5] text-[#4a4540]">{job.specialtyNeeded}</span>
                      <UrgencyBadge urgency={job.urgency} />
                    </div>
                    <p className="text-[0.8125rem] text-[#4a4540]">
                      {job.description.slice(0, 100)}{job.description.length > 100 ? '...' : ''}
                    </p>
                    <p className="text-[0.8125rem] text-[#8a8580]">
                      Created {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <StatusBadge status={job.status} />
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {job.status === 'assigned' && (
                        <>
                          <Button size="sm" className="bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]" onClick={() => handleStatusUpdate(job.id, 'in_progress')}>
                            Accept Job
                          </Button>
                          <Button size="sm" variant="destructive" className="rounded-[8px]" onClick={() => handleStatusUpdate(job.id, 'cancelled')}>
                            Decline
                          </Button>
                        </>
                      )}
                      {job.status === 'in_progress' && (
                        <Button size="sm" className="bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]" onClick={() => handleStatusUpdate(job.id, 'resolved')}>
                          Mark Resolved
                        </Button>
                      )}
                      {job.status === 'resolved' && (
                        <Button size="sm" variant="outline" className="rounded-[8px]" onClick={() => router.push(`/technician/jobs/${job.id}`)}>
                          View Summary
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
