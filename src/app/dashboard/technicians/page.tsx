'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Star, MapPin, Users } from 'lucide-react'

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

function SpecialtyBadge({ specialty }: { specialty: string }) {
  const colors: Record<string, string> = {
    HVAC: 'bg-[#e8eef5] text-[#1e3a5f]',
    Plumbing: 'bg-[#fdf0e3] text-[#d4782a]',
    Electrical: 'bg-[#e8f5ec] text-[#2d7d46]',
    Pest: 'bg-[#f9e8e8] text-[#c62828]',
    Industrial: 'bg-[#f8f7f5] text-[#4a4540]',
  }
  return (
    <span className={`inline-flex items-center rounded-[9999px] px-2.5 py-0.5 text-[0.75rem] font-medium ${colors[specialty] || 'bg-[#f8f7f5] text-[#4a4540]'}`}>
      {specialty}
    </span>
  )
}

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
            <div key={i} className="bg-white border border-[#d4d0ca] rounded-[12px] p-6">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
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
          <SelectTrigger className="w-[160px] bg-white border border-[#d4d0ca] rounded-[8px] text-[0.9375rem] text-[#1a1a1a] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition">
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
          <SelectTrigger className="w-[160px] bg-white border border-[#d4d0ca] rounded-[8px] text-[0.9375rem] text-[#1a1a1a] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition">
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
            <div key={tech.id} className="bg-white border border-[#d4d0ca] rounded-[12px] p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[1rem] font-semibold text-[#1a1a1a]">{tech.name}</h3>
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${
                    tech.available ? 'bg-[#2d7d46]' : 'bg-[#c62828]'
                  }`}
                  title={tech.available ? 'Available' : 'Unavailable'}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <SpecialtyBadge specialty={tech.specialty} />
                  <div className="flex items-center gap-0.5">
                    <Star className="size-3.5 fill-[#d4782a] text-[#d4782a]" />
                    <span className="text-[0.8125rem] font-medium text-[#4a4540]">{tech.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[0.8125rem] text-[#4a4540]">
                  <MapPin className="size-3.5" />
                  {tech.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
