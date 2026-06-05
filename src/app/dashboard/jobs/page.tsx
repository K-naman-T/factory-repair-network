'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Search, PlusCircle, ClipboardList } from 'lucide-react'
import Link from 'next/link'

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
  technician?: { id: number; name: string } | null
  factory?: { id: number; name: string } | null
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-[#e8eef5] text-[#1e3a5f]',
    assigned: 'bg-[#fdf0e3] text-[#d4782a]',
    in_progress: 'bg-[#fdf0e3] text-[#d4782a]',
    resolved: 'bg-[#e8f5ec] text-[#2d7d46]',
  }
  return (
    <span className={`inline-flex items-center rounded-[9999px] px-2.5 py-0.5 text-[0.75rem] font-medium ${styles[status] || 'bg-[#f8f7f5] text-[#4a4540]'}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

const specialties = ['HVAC', 'Plumbing', 'Electrical', 'Pest', 'Industrial']
const statuses = ['open', 'assigned', 'in_progress', 'resolved']

export default function JobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

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
        if (!factory) { setLoading(false); return }

        const res = await fetch(`/api/jobs?factoryId=${factory.id}`)
        const data = await res.json()
        setJobs(Array.isArray(data) ? data : [])
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  useEffect(() => {
    let result = [...jobs]
    if (statusFilter) result = result.filter((j) => j.status === statusFilter)
    if (specialtyFilter) result = result.filter((j) => j.specialtyNeeded === specialtyFilter)
    if (search) result = result.filter((j) => j.description.toLowerCase().includes(search.toLowerCase()))
    setFilteredJobs(result)
  }, [jobs, statusFilter, specialtyFilter, search])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">My Jobs</h1>
        <Link href="/dashboard/jobs/new">
          <Button className="bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]">
            <PlusCircle className="mr-2 size-4" />
            Post Job
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#d4d0ca] rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 size-4 text-[#8a8580]" />
            <Input
              placeholder="Search jobs..."
              className="pl-8 bg-white border-[#d4d0ca] rounded-[8px] text-[0.9375rem] text-[#1a1a1a] placeholder:text-[#8a8580] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? '')}>
            <SelectTrigger className="w-[140px] bg-white border-[#d4d0ca] rounded-[8px] text-[0.9375rem] text-[#1a1a1a] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={specialtyFilter} onValueChange={(v) => setSpecialtyFilter(v ?? '')}>
            <SelectTrigger className="w-[140px] bg-white border-[#d4d0ca] rounded-[8px] text-[0.9375rem] text-[#1a1a1a] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition">
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All specialties</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white border border-[#d4d0ca] rounded-[12px] overflow-hidden">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="size-12 text-[#8a8580] mb-4" />
            <p className="text-[0.9375rem] text-[#4a4540]">
              No jobs yet. Post your first repair job.
            </p>
            <Link href="/dashboard/jobs/new">
              <Button className="mt-4 bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]">
                <PlusCircle className="mr-2 size-4" />
                Post a Job
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f8f7f5]">
                <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">ID</TableHead>
                <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Specialty</TableHead>
                <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Status</TableHead>
                <TableHead className="hidden md:table-cell px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Technician</TableHead>
                <TableHead className="hidden md:table-cell px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Created</TableHead>
                <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="cursor-pointer transition-colors hover:bg-[#f8f7f5]"
                  onClick={() => setSelectedJob(job)}
                >
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#1a1a1a] font-medium">#{job.id}</TableCell>
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#1a1a1a]">{job.specialtyNeeded}</TableCell>
                  <TableCell className="px-4 py-3">
                    <StatusBadge status={job.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-4 py-3 text-[0.9375rem] text-[#1a1a1a]">
                    {job.technician?.name || '—'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-4 py-3 text-[0.9375rem] text-[#1a1a1a]">{formatDate(job.createdAt)}</TableCell>
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#1a1a1a] text-right">₹{job.cost.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => { if (!open) setSelectedJob(null) }}>
        {selectedJob && (
          <DialogContent className="bg-white rounded-[16px] p-8 max-w-lg w-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)]">
            <DialogHeader>
              <DialogTitle className="text-[1.125rem] font-semibold text-[#1a1a1a] mb-2">Job #{selectedJob.id}</DialogTitle>
              <DialogDescription className="text-[0.9375rem] text-[#4a4540]">{selectedJob.specialtyNeeded}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-[0.9375rem] text-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#4a4540]">Status:</span>
                <StatusBadge status={selectedJob.status} />
              </div>
              <div>
                <span className="font-medium text-[#4a4540]">Urgency: </span>
                {selectedJob.urgency}
              </div>
              <div>
                <span className="font-medium text-[#4a4540]">Description: </span>
                <p className="mt-1 text-[0.9375rem] text-[#4a4540]">{selectedJob.description}</p>
              </div>
              <div>
                <span className="font-medium text-[#4a4540]">Technician: </span>
                {selectedJob.technician?.name || 'Not assigned'}
              </div>
              <div>
                <span className="font-medium text-[#4a4540]">Cost: </span>
                ₹{selectedJob.cost.toLocaleString()}
              </div>
              <div>
                <span className="font-medium text-[#4a4540]">Created: </span>
                {formatDate(selectedJob.createdAt)}
              </div>
              {selectedJob.resolvedAt && (
                <div>
                  <span className="font-medium text-[#4a4540]">Resolved: </span>
                  {formatDate(selectedJob.resolvedAt)}
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
