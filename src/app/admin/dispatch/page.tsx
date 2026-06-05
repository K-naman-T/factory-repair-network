'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
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
  { key: 'open', label: 'Open', color: '#1e3a5f' },
  { key: 'assigned', label: 'Assigned', color: '#d4782a' },
  { key: 'in_progress', label: 'In Progress', color: '#d4782a' },
  { key: 'resolved', label: 'Resolved', color: '#2d7d46' },
]

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

function StatusDot({ status }: { status: string }) {
  const dotColors: Record<string, string> = {
    open: 'bg-[#1e3a5f]',
    assigned: 'bg-[#d4782a]',
    in_progress: 'bg-[#d4782a]',
    resolved: 'bg-[#2d7d46]',
  }
  return <span className={`inline-block size-2.5 rounded-full ${dotColors[status] || 'bg-[#8a8580]'}`} />
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
            <div key={i} className="min-w-[280px] flex-1 bg-[#f8f7f5] rounded-[12px] p-4">
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
            <div key={col.key} className="min-w-[280px] flex-1 bg-[#f8f7f5] rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="text-[0.8125rem] font-semibold text-[#1a1a1a]">{col.label}</h3>
                <span className="text-[0.75rem] text-[#8a8580]">({colJobs.length})</span>
              </div>
              <div className="space-y-3">
                {colJobs.length === 0 ? (
                  <p className="text-[0.8125rem] text-[#8a8580] py-8 text-center">No jobs</p>
                ) : (
                  colJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-[#d4d0ca] rounded-[8px] p-4 mb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-[0.9375rem] font-medium text-[#1a1a1a]">{job.factory.name}</h4>
                        <UrgencyBadge urgency={job.urgency} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.8125rem] text-[#4a4540] line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex items-center justify-between text-[0.75rem] text-[#8a8580]">
                          <span>{job.specialtyNeeded}</span>
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        {job.technician && (
                          <p className="text-[0.75rem] text-[#4a4540]">
                            Assigned to: {job.technician.name}
                          </p>
                        )}
                        <div className="pt-1">
                          {job.status === 'open' && (
                            <Button
                              size="sm"
                              className="w-full bg-[#d4782a] text-white hover:bg-[#e8943a] transition-colors rounded-[8px]"
                              onClick={() => setDispatchJob(job)}
                            >
                              Assign
                            </Button>
                          )}
                          {job.status === 'assigned' && (
                            <Button
                              size="sm"
                              className="w-full bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]"
                              onClick={() => handleStatusChange(job.id, 'in_progress')}
                            >
                              Start
                            </Button>
                          )}
                          {job.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#e8eef5] transition-colors rounded-[8px]"
                              onClick={() => handleStatusChange(job.id, 'resolved')}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={!!dispatchJob} onOpenChange={(open) => { if (!open) { setDispatchJob(null); setSelectedTech(null) } }}>
        <DialogContent className="bg-white rounded-[16px] p-8 max-w-lg w-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)]">
          <DialogHeader>
            <DialogTitle className="text-[1.125rem] font-semibold text-[#1a1a1a] mb-2">Dispatch Job</DialogTitle>
            <DialogDescription className="text-[0.9375rem] text-[#4a4540] mb-6">
              Select a technician to assign this job to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {dispatchJob && (
              <div className="bg-white border border-[#d4d0ca] rounded-[8px] p-3">
                <p className="text-[0.9375rem] font-medium text-[#1a1a1a]">{dispatchJob.factory.name}</p>
                <p className="text-[0.8125rem] text-[#4a4540] mt-1">{dispatchJob.description}</p>
                <p className="text-[0.8125rem] text-[#4a4540]">Specialty: {dispatchJob.specialtyNeeded}</p>
              </div>
            )}
            {matchingTechs.length === 0 ? (
              <p className="text-[0.9375rem] text-[#4a4540]">
                No available technicians found for this specialty.
              </p>
            ) : (
              <div className="space-y-2">
                {matchingTechs.map((tech) => (
                  <label
                    key={tech.id}
                    className={`flex cursor-pointer items-center gap-3 bg-white border border-[#d4d0ca] rounded-[8px] p-3 text-[0.9375rem] transition-colors ${
                      selectedTech === tech.id
                        ? 'border-[#1e3a5f] bg-[#e8eef5]'
                        : 'hover:bg-[#f8f7f5]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="technician"
                      value={tech.id}
                      checked={selectedTech === tech.id}
                      onChange={() => setSelectedTech(tech.id)}
                      className="size-4 accent-[#1e3a5f]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-[#1a1a1a]">{tech.name}</p>
                      <p className="text-[0.8125rem] text-[#4a4540]">
                        {tech.city} &middot; Rating: {tech.rating}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          <DialogFooter showCloseButton className="flex justify-end gap-3 pt-6 border-t border-[#d4d0ca]">
            <Button
              onClick={handleAssign}
              disabled={!selectedTech || dispatching}
              className="bg-[#d4782a] text-white hover:bg-[#e8943a] transition-colors rounded-[8px]"
            >
              {dispatching ? 'Dispatching...' : 'Dispatch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
