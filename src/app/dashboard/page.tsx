'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Briefcase, CheckCircle, IndianRupee, Clock, PlusCircle, ArrowRight, ClipboardList } from 'lucide-react'

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
}

interface Stats {
  activeJobs: number
  resolvedThisMonth: number
  totalSpending: number
  avgResolutionTime: string
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

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [factoryId, setFactoryId] = useState<number | null>(null)
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
        setUserName(meData.user.name)

        const factoriesRes = await fetch('/api/factories')
        const factories = await factoriesRes.json()
        const factory = (Array.isArray(factories) ? factories : []).find(
          (f: { email: string }) => f.email === meData.user.email
        )
        if (!factory) {
          setLoading(false)
          return
        }
        setFactoryId(factory.id)

        const jobsRes = await fetch(`/api/jobs?factoryId=${factory.id}`)
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

  const activeJobs = jobs.filter((j) => ['open', 'assigned', 'in_progress'].includes(j.status)).length
  const resolvedJobs = jobs.filter((j) => j.status === 'resolved')
  const totalSpending = resolvedJobs.reduce((sum, j) => sum + j.cost, 0)

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const resolvedThisMonth = resolvedJobs.filter((j) => {
    if (!j.resolvedAt) return false
    const d = new Date(j.resolvedAt)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  }).length

  const resolutionTimes = resolvedJobs
    .filter((j) => j.resolvedAt)
    .map((j) => {
      const created = new Date(j.createdAt)
      const resolved = new Date(j.resolvedAt!)
      return (resolved.getTime() - created.getTime()) / (1000 * 60 * 60)
    })
  const avgResolutionTime =
    resolutionTimes.length > 0
      ? (resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length).toFixed(1)
      : '—'

  const recentJobs = jobs.slice(0, 5)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#d4d0ca] rounded-[12px] p-6">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const stats: Stats = { activeJobs, resolvedThisMonth, totalSpending, avgResolutionTime: String(avgResolutionTime) }

  const statCards = [
    { title: 'Active Jobs', value: stats.activeJobs, icon: Briefcase },
    { title: 'Resolved This Month', value: stats.resolvedThisMonth, icon: CheckCircle },
    { title: 'Total Spending', value: `₹${stats.totalSpending.toLocaleString()}`, icon: IndianRupee },
    { title: 'Avg Resolution Time', value: stats.avgResolutionTime === '—' ? '—' : `${stats.avgResolutionTime}h`, icon: Clock },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome{factoryId ? `, ${userName}` : ''}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your repair jobs.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Recent Activity + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white border border-[#d4d0ca] rounded-[12px]">
          <div className="p-6 border-b border-[#d4d0ca]">
            <h3 className="text-[1rem] font-semibold text-[#1a1a1a]">Recent Activity</h3>
          </div>
          <div className="p-6">
            {recentJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardList className="size-12 text-[#8a8580] mb-4" />
                <p className="text-[0.9375rem] text-[#4a4540]">No jobs yet.</p>
                <Link href="/dashboard/jobs/new">
                  <Button className="mt-4">
                    <PlusCircle className="mr-2 size-4" />
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-[#d4d0ca] rounded-[8px] p-3 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.9375rem] font-medium text-[#1a1a1a]">
                        {job.description.slice(0, 60)}{job.description.length > 60 ? '...' : ''}
                      </p>
                      <p className="text-[0.8125rem] text-[#4a4540] mt-0.5">
                        {job.specialtyNeeded} &middot; {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#d4d0ca] rounded-[12px]">
          <div className="p-6 border-b border-[#d4d0ca]">
            <h3 className="text-[1rem] font-semibold text-[#1a1a1a]">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-3">
            <Link href="/dashboard/jobs/new">
              <Button className="w-full bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]">
                <PlusCircle className="mr-2 size-4" />
                Post New Job
              </Button>
            </Link>
            <Link href="/dashboard/jobs">
              <Button variant="outline" className="w-full rounded-[8px]">
                <ArrowRight className="mr-2 size-4" />
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
