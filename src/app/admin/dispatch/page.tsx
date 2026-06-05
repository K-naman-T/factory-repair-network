'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Job {
  id: number
  specialtyNeeded: string
  description: string
  status: string
  urgency: string
  createdAt: string
  factory: { id: number; name: string }
  technician: { id: number; name: string } | null
}

interface Technician {
  id: number
  name: string
  specialty: string
  city: string
  phone: string
  available: boolean
  rating: number
}

const columns = [
  { key: 'open', label: 'Open', color: 'bg-blue-500' },
  { key: 'assigned', label: 'Assigned', color: 'bg-yellow-500' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-orange-500' },
  { key: 'resolved', label: 'Resolved', color: 'bg-green-500' },
]

const urgencyBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'> = {
  low: 'secondary',
  normal: 'default',
  high: 'destructive',
  critical: 'destructive',
}

export default function DispatchPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [dispatchJob, setDispatchJob] = useState<Job | null>(null)
  const [selectedTech, setSelectedTech] = useState<number | null>(null)
  const [dispatching, setDispatching] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [jobsRes, techRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/technicians'),
      ])
      const jobsData = await jobsRes.json()
      const techData = await techRes.json()
      setJobs(Array.isArray(jobsData) ? jobsData : [])
      setTechnicians(Array.isArray(techData) ? techData : [])
    } catch (err) {
      console.error('Failed to load data', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const grouped = {
    open: jobs.filter((j) => j.status === 'open'),
    assigned: jobs.filter((j) => j.status === 'assigned'),
    in_progress: jobs.filter((j) => j.status === 'in_progress'),
    resolved: jobs.filter((j) => j.status === 'resolved'),
  }

  async function handleAssign() {
    if (!dispatchJob || !selectedTech) return
    setDispatching(true)
    try {
      const res = await fetch(`/api/jobs/${dispatchJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianId: selectedTech, status: 'assigned' }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Failed to dispatch')
        return
      }
      toast.success('Job dispatched successfully')
      setDispatchJob(null)
      setSelectedTech(null)
      loadData()
    } catch {
      toast.error('Failed to dispatch')
    } finally {
      setDispatching(false)
    }
  }

  async function handleStatusChange(jobId: number, newStatus: string) {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Failed to update')
        return
      }
      toast.success(`Job moved to ${newStatus.replace('_', ' ')}`)
      loadData()
    } catch {
      toast.error('Failed to update')
    }
  }

  const matchingTechs = dispatchJob
    ? technicians.filter(
        (t) =>
          t.specialty === dispatchJob.specialtyNeeded && t.available
      )
    : []

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[280px] flex-1">
              <Skeleton className="h-6 w-24 mb-3" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-32 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dispatch Board</h1>
        <p className="text-sm text-muted-foreground">
          Manage and assign repair jobs to technicians.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colJobs = grouped[col.key as keyof typeof grouped]
          return (
            <div key={col.key} className="min-w-[280px] flex-1">
              <div className="mb-3 flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${col.color}`} />
                <h3 className="font-semibold text-sm">{col.label}</h3>
                <span className="text-xs text-muted-foreground">({colJobs.length})</span>
              </div>
              <div className="space-y-3">
                {colJobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No jobs</p>
                ) : (
                  colJobs.map((job) => (
                    <Card key={job.id} size="sm">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm">{job.factory.name}</CardTitle>
                          <Badge variant={urgencyBadge[job.urgency] || 'default'} className="shrink-0">
                            {job.urgency}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{job.specialtyNeeded}</span>
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        {job.technician && (
                          <p className="text-xs text-muted-foreground">
                            Assigned to: {job.technician.name}
                          </p>
                        )}
                        <div className="pt-1">
                          {job.status === 'open' && (
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => setDispatchJob(job)}
                            >
                              Assign
                            </Button>
                          )}
                          {job.status === 'assigned' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-full"
                              onClick={() => handleStatusChange(job.id, 'in_progress')}
                            >
                              Start
                            </Button>
                          )}
                          {job.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => handleStatusChange(job.id, 'resolved')}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={!!dispatchJob} onOpenChange={(open) => { if (!open) { setDispatchJob(null); setSelectedTech(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispatch Job</DialogTitle>
            <DialogDescription>
              Select a technician to assign this job to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {dispatchJob && (
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{dispatchJob.factory.name}</p>
                <p className="text-muted-foreground">{dispatchJob.description}</p>
                <p className="text-muted-foreground">Specialty: {dispatchJob.specialtyNeeded}</p>
              </div>
            )}
            {matchingTechs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No available technicians found for this specialty.
              </p>
            ) : (
              <div className="space-y-2">
                {matchingTechs.map((tech) => (
                  <label
                    key={tech.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                      selectedTech === tech.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="technician"
                      value={tech.id}
                      checked={selectedTech === tech.id}
                      onChange={() => setSelectedTech(tech.id)}
                      className="size-4 accent-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {tech.city} &middot; Rating: {tech.rating}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          <DialogFooter showCloseButton>
            <Button
              onClick={handleAssign}
              disabled={!selectedTech || dispatching}
            >
              {dispatching ? 'Dispatching...' : 'Dispatch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
