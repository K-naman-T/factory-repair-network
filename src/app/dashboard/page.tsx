'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Briefcase, CheckCircle, IndianRupee, Clock, PlusCircle, ArrowRight } from 'lucide-react'

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

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'link' | 'ghost'> = {
  open: 'default',
  assigned: 'secondary',
  in_progress: 'outline',
  resolved: 'ghost',
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
            <Card key={i}>
              <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const stats: Stats = { activeJobs, resolvedThisMonth, totalSpending, avgResolutionTime: String(avgResolutionTime) }

  const statCards = [
    { title: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'text-blue-600' },
    { title: 'Resolved This Month', value: stats.resolvedThisMonth, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Total Spending', value: `₹${stats.totalSpending.toLocaleString()}`, icon: IndianRupee, color: 'text-purple-600' },
    { title: 'Avg Resolution Time', value: stats.avgResolutionTime === '—' ? '—' : `${stats.avgResolutionTime}h`, icon: Clock, color: 'text-orange-600' },
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

      {/* Recent Activity + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No jobs yet.</p>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {job.description.slice(0, 60)}{job.description.length > 60 ? '...' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {job.specialtyNeeded} &middot; {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={statusVariant[job.status] || 'outline'}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/jobs/new">
              <Button className="w-full">
                <PlusCircle className="mr-2 size-4" />
                Post New Job
              </Button>
            </Link>
            <Link href="/dashboard/jobs">
              <Button variant="outline" className="w-full">
                <ArrowRight className="mr-2 size-4" />
                View All Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
