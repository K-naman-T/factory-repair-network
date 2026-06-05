'use client'

import { useEffect, useState, useCallback } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'

interface Technician {
  id: number
  name: string
  specialty: string
  city: string
  phone: string
  available: boolean
  rating: number
}

const specialties = [
  'Mechanical',
  'Electrical',
  'Hydraulics',
  'Welding',
  'CNC',
  'PLC',
  'HVAC',
  'General',
]

interface FormData {
  name: string
  specialty: string
  city: string
  phone: string
}

const emptyForm: FormData = { name: '', specialty: 'Mechanical', city: '', phone: '' }

export default function AdminTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Technician | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Technician | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/technicians')
      const data = await res.json()
      setTechnicians(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load technicians', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(tech: Technician) {
    setEditing(tech)
    setForm({ name: tech.name, specialty: tech.specialty, city: tech.city, phone: tech.phone })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.specialty || !form.city || !form.phone) {
      toast.error('Please fill all fields')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/technicians/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) { const err = await res.json(); toast.error(err.error || 'Failed to update'); return }
        toast.success('Technician updated')
      } else {
        const res = await fetch('/api/technicians', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) { const err = await res.json(); toast.error(err.error || 'Failed to create'); return }
        toast.success('Technician created')
      }
      setDialogOpen(false)
      loadData()
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(tech: Technician) {
    setDeleting(true)
    try {
      const res = await fetch(`/api/technicians/${tech.id}`, { method: 'DELETE' })
      if (!res.ok) { const err = await res.json(); toast.error(err.error || 'Failed to delete'); return }
      toast.success('Technician deleted')
      setDeleteConfirm(null)
      loadData()
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Technicians</h1>
          <p className="text-sm text-muted-foreground">Manage repair technicians.</p>
        </div>
        <Button onClick={openAdd} className="bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]">
          <Plus className="mr-2 size-4" />
          Add Technician
        </Button>
      </div>

      <div className="bg-white border border-[#d4d0ca] rounded-[12px] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8f7f5]">
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Name</TableHead>
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Specialty</TableHead>
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">City</TableHead>
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Phone</TableHead>
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Available</TableHead>
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Rating</TableHead>
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {technicians.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-8 text-center text-[0.9375rem] text-[#8a8580]">
                  No technicians found.
                </TableCell>
              </TableRow>
            ) : (
              technicians.map((tech) => (
                <TableRow key={tech.id} className="transition-colors hover:bg-[#f8f7f5]">
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#1a1a1a] font-medium">{tech.name}</TableCell>
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#1a1a1a]">{tech.specialty}</TableCell>
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#1a1a1a]">{tech.city}</TableCell>
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#1a1a1a]">{tech.phone}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-[0.9375rem] text-[#1a1a1a]">
                      <span className={`inline-block size-2 rounded-full ${tech.available ? 'bg-[#2d7d46]' : 'bg-[#c62828]'}`} />
                      {tech.available ? 'Available' : 'Busy'}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#1a1a1a]">{tech.rating}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-xs" onClick={() => openEdit(tech)}>
                        <Pencil className="size-3" />
                      </Button>
                      <Button variant="ghost" size="icon-xs" onClick={() => setDeleteConfirm(tech)}>
                        <Trash2 className="size-3 text-[#c62828]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white rounded-[16px] p-8 max-w-lg w-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)]">
          <DialogHeader>
            <DialogTitle className="text-[1.125rem] font-semibold text-[#1a1a1a] mb-2">{editing ? 'Edit Technician' : 'Add Technician'}</DialogTitle>
            <DialogDescription className="text-[0.9375rem] text-[#4a4540] mb-6">
              {editing ? 'Update the technician details.' : 'Enter the details for the new technician.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1.5 block">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Technician name"
                className="bg-white border border-[#d4d0ca] rounded-[8px] px-3 py-2 text-[0.9375rem] text-[#1a1a1a] placeholder:text-[#8a8580] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition"
              />
            </div>
            <div>
              <label className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1.5 block">Specialty</label>
              <Select
                value={form.specialty}
                onValueChange={(v) => v && setForm({ ...form, specialty: v })}
              >
                <SelectTrigger className="w-full bg-white border border-[#d4d0ca] rounded-[8px] px-3 py-2 text-[0.9375rem] text-[#1a1a1a] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1.5 block">City</label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
                className="bg-white border border-[#d4d0ca] rounded-[8px] px-3 py-2 text-[0.9375rem] text-[#1a1a1a] placeholder:text-[#8a8580] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition"
              />
            </div>
            <div>
              <label className="text-[0.875rem] font-medium text-[#1a1a1a] mb-1.5 block">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
                className="bg-white border border-[#d4d0ca] rounded-[8px] px-3 py-2 text-[0.9375rem] text-[#1a1a1a] placeholder:text-[#8a8580] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition"
              />
            </div>
          </div>
          <DialogFooter showCloseButton className="flex justify-end gap-3 pt-6 border-t border-[#d4d0ca]">
            <Button onClick={handleSave} disabled={saving} className="bg-[#1e3a5f] text-white hover:bg-[#264d7a] transition-colors rounded-[8px]">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null) }}>
        <DialogContent className="bg-white rounded-[16px] p-8 max-w-lg w-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)]">
          <DialogHeader>
            <DialogTitle className="text-[1.125rem] font-semibold text-[#1a1a1a] mb-2">Delete Technician</DialogTitle>
            <DialogDescription className="text-[0.9375rem] text-[#4a4540] mb-6">
              Are you sure you want to delete {deleteConfirm?.name}? This will unassign any open jobs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton className="flex justify-end gap-3 pt-6 border-t border-[#d4d0ca]">
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleting}
              className="rounded-[8px]"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
