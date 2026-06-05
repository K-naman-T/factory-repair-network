'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Factory, Users, Briefcase, Clock, CheckCircle, BarChart3 } from 'lucide-react'

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
            <div key={i} className="bg-white border border-[#d4d0ca] rounded-[12px] p-6">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-8 w-16" />
            </div>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white border border-[#d4d0ca] rounded-[12px]">
          <div className="p-6 border-b border-[#d4d0ca]">
            <h3 className="text-[1rem] font-semibold text-[#1a1a1a]">Jobs by Specialty</h3>
          </div>
          <div className="p-6">
            {specialtyEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BarChart3 className="size-12 text-[#8a8580] mb-4" />
                <p className="text-[0.9375rem] text-[#4a4540]">No data yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {specialtyEntries.map(([specialty, count]) => (
                  <div key={specialty} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[0.9375rem]">
                      <span className="font-medium text-[#1a1a1a]">{specialty}</span>
                      <span className="text-[#8a8580]">{count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f8f7f5]">
                      <div
                        className="h-2 rounded-full bg-[#1e3a5f] transition-all"
                        style={{ width: `${(count / maxSpecialtyCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#d4d0ca] rounded-[12px]">
          <div className="p-6 border-b border-[#d4d0ca]">
            <h3 className="text-[1rem] font-semibold text-[#1a1a1a]">Recent Activity</h3>
          </div>
          <div className="p-6">
            {(!stats?.recentActivity || stats.recentActivity.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="size-12 text-[#8a8580] mb-4" />
                <p className="text-[0.9375rem] text-[#4a4540]">No recent activity.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.map((job) => (
                  <div key={job.id} className="bg-white border border-[#d4d0ca] rounded-[8px] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.9375rem] font-medium text-[#1a1a1a]">
                          {job.description.slice(0, 50)}{job.description.length > 50 ? '...' : ''}
                        </p>
                        <p className="text-[0.8125rem] text-[#4a4540] mt-0.5">
                          {job.factory.name}
                          {job.technician ? ` \u00b7 ${job.technician.name}` : ''}
                        </p>
                        <p className="text-[0.8125rem] text-[#4a4540]">
                          {job.specialtyNeeded} &middot; {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
