'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
            <Card key={i}>
              <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  const statCards = [
    { title: 'Active Jobs', value: activeJobs, icon: Briefcase, color: 'text-blue-600' },
    { title: 'Completed This Week', value: completedThisWeek, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Earnings', value: `₹${earnings.toLocaleString()}`, icon: IndianRupee, color: 'text-purple-600' },
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
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`size-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardList className="mb-4 size-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No assignments yet. We&apos;ll notify you when a job matches your specialty.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const config = statusConfig[job.status] || { label: job.status, variant: 'outline' as const }
            return (
              <Card key={job.id} className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => router.push(`/technician/jobs/${job.id}`)}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{job.factory.name}</p>
                      <Badge variant="outline" className="text-xs">{job.specialtyNeeded}</Badge>
                      <Badge variant={urgencyVariant[job.urgency] || 'outline'} className="text-xs">
                        {job.urgency}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {job.description.slice(0, 100)}{job.description.length > 100 ? '...' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <Badge variant={config.variant}>{config.label}</Badge>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {job.status === 'assigned' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(job.id, 'in_progress')}>
                            Accept Job
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(job.id, 'cancelled')}>
                            Decline
                          </Button>
                        </>
                      )}
                      {job.status === 'in_progress' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleStatusUpdate(job.id, 'resolved')}>
                          Mark Resolved
                        </Button>
                      )}
                      {job.status === 'resolved' && (
                        <Button size="sm" variant="outline" onClick={() => router.push(`/technician/jobs/${job.id}`)}>
                          View Summary
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
