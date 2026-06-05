'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Factory, Users, Briefcase, Clock, CheckCircle } from 'lucide-react'

interface Stats {
  totalFactories: number
  totalTechnicians: number
  totalJobs: number
  openJobs: number
  assignedJobs: number
  inProgressJobs: number
  resolvedJobs: number
  jobsBySpecialty: Record<string, number>
  recentActivity: Array<{
    id: number
    specialtyNeeded: string
    description: string
    status: string
    urgency: string
    createdAt: string
    factory: { name: string }
    technician: { name: string } | null
  }>
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'> = {
  open: 'default',
  assigned: 'secondary',
  in_progress: 'outline',
  resolved: 'ghost',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsRes] = await Promise.all([
          fetch('/api/stats'),
        ])
        const statsData = await statsRes.json()
        setStats(statsData)
      } catch (err) {
        console.error('Failed to load stats', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    { title: 'Total Factories', value: stats?.totalFactories ?? 0, icon: Factory },
    { title: 'Total Technicians', value: stats?.totalTechnicians ?? 0, icon: Users },
    { title: 'Total Jobs', value: stats?.totalJobs ?? 0, icon: Briefcase },
    { title: 'Open Jobs', value: stats?.openJobs ?? 0, icon: Clock },
    { title: 'Resolved Jobs', value: stats?.resolvedJobs ?? 0, icon: CheckCircle },
  ]

  const specialtyEntries = stats?.jobsBySpecialty
    ? Object.entries(stats.jobsBySpecialty).sort(([, a], [, b]) => b - a)
    : []

  const maxSpecialtyCount = specialtyEntries.length > 0
    ? Math.max(...specialtyEntries.map(([, c]) => c))
    : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">System Overview</h1>
        <p className="text-sm text-muted-foreground">
          At-a-glance view of the entire platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Jobs by Specialty</CardTitle>
          </CardHeader>
          <CardContent>
            {specialtyEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {specialtyEntries.map(([specialty, count]) => (
                  <div key={specialty} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{specialty}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${(count / maxSpecialtyCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {(!stats?.recentActivity || stats.recentActivity.length === 0) ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.map((job) => (
                  <div key={job.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {job.description.slice(0, 50)}{job.description.length > 50 ? '...' : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.factory.name}
                          {job.technician ? ` \u00b7 ${job.technician.name}` : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.specialtyNeeded} &middot; {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={statusVariant[job.status] || 'outline'}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
