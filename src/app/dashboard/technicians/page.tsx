'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Star, MapPin } from 'lucide-react'

interface Technician {
  id: number
  name: string
  email: string
  specialty: string
  city: string
  phone: string
  available: boolean
  rating: number
}

const specialties = ['HVAC', 'Plumbing', 'Electrical', 'Pest', 'Industrial']

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [filteredTechs, setFilteredTechs] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/technicians')
        const data = await res.json()
        const techs = Array.isArray(data) ? data : []
        setTechnicians(techs)
        const uniqueCities = [...new Set(techs.map((t: Technician) => t.city))] as string[]
        setCities(uniqueCities)
      } catch {
        console.error('Failed to load technicians')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let result = [...technicians]
    if (specialtyFilter) result = result.filter((t) => t.specialty === specialtyFilter)
    if (cityFilter) result = result.filter((t) => t.city === cityFilter)
    setFilteredTechs(result)
  }, [technicians, specialtyFilter, cityFilter])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Browse Technicians</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={specialtyFilter} onValueChange={(v) => setSpecialtyFilter(v ?? '')}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All specialties</SelectItem>
            {specialties.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={cityFilter} onValueChange={(v) => setCityFilter(v ?? '')}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All cities</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filteredTechs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No technicians found matching your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTechs.map((tech) => (
            <Card key={tech.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{tech.name}</CardTitle>
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${
                      tech.available ? 'bg-green-500' : 'bg-red-400'
                    }`}
                    title={tech.available ? 'Available' : 'Unavailable'}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{tech.specialty}</Badge>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="size-3 fill-current" />
                    <span className="text-xs font-medium text-foreground">{tech.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  {tech.city}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
