'use client'

import { useEffect, useState, useCallback } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Pencil, Trash2 } from 'lucide-react'

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
        <Button onClick={openAdd}>
          <Plus className="mr-2 size-4" />
          Add Technician
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No technicians found.
                  </TableCell>
                </TableRow>
              ) : (
                technicians.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>{tech.specialty}</TableCell>
                    <TableCell>{tech.city}</TableCell>
                    <TableCell>{tech.phone}</TableCell>
                    <TableCell>
                      <Badge variant={tech.available ? 'default' : 'secondary'}>
                        {tech.available ? 'Available' : 'Busy'}
                      </Badge>
                    </TableCell>
                    <TableCell>{tech.rating}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-xs" onClick={() => openEdit(tech)}>
                          <Pencil className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon-xs" onClick={() => setDeleteConfirm(tech)}>
                          <Trash2 className="size-3 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Technician' : 'Add Technician'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the technician details.' : 'Enter the details for the new technician.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Technician name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select
                value={form.specialty}
                onValueChange={(v) => v && setForm({ ...form, specialty: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Technician</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteConfirm?.name}? This will unassign any open jobs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
