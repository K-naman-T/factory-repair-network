'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Search, PlusCircle } from 'lucide-react'
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

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  assigned: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  in_progress: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
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
          <Button>
            <PlusCircle className="mr-2 size-4" />
            Post Job
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? '')}>
            <SelectTrigger className="w-[140px]">
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
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All specialties</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No jobs yet. Post your first repair job!
              </p>
              <Link href="/dashboard/jobs/new">
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="mr-2 size-4" />
                  Post a Job
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Technician</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <TableCell className="font-medium">#{job.id}</TableCell>
                    <TableCell>{job.specialtyNeeded}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[job.status] || ''}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {job.technician?.name || '—'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(job.createdAt)}</TableCell>
                    <TableCell className="text-right">₹{job.cost.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => { if (!open) setSelectedJob(null) }}>
        {selectedJob && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Job #{selectedJob.id}</DialogTitle>
              <DialogDescription>{selectedJob.specialtyNeeded}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Status: </span>
                <Badge className={statusColors[selectedJob.status] || ''}>
                  {selectedJob.status.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Urgency: </span>
                {selectedJob.urgency}
              </div>
              <div>
                <span className="font-medium">Description: </span>
                <p className="mt-1 text-muted-foreground">{selectedJob.description}</p>
              </div>
              <div>
                <span className="font-medium">Technician: </span>
                {selectedJob.technician?.name || 'Not assigned'}
              </div>
              <div>
                <span className="font-medium">Cost: </span>
                ₹{selectedJob.cost.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Created: </span>
                {formatDate(selectedJob.createdAt)}
              </div>
              {selectedJob.resolvedAt && (
                <div>
                  <span className="font-medium">Resolved: </span>
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
