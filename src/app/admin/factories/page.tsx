'use client'

import { useEffect, useState, useCallback } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
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
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Factory {
  id: number
  name: string
  address: string
  city: string
  phone: string
  _count?: { jobs: number }
}

interface FormData {
  name: string
  address: string
  city: string
  phone: string
}

const emptyForm: FormData = { name: '', address: '', city: '', phone: '' }

export default function AdminFactories() {
  const [factories, setFactories] = useState<Factory[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Factory | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Factory | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/factories')
      const data = await res.json()
      setFactories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load factories', err)
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

  function openEdit(factory: Factory) {
    setEditing(factory)
    setForm({ name: factory.name, address: factory.address, city: factory.city, phone: factory.phone })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.address || !form.city || !form.phone) {
      toast.error('Please fill all fields')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/factories/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) { const err = await res.json(); toast.error(err.error || 'Failed to update'); return }
        toast.success('Factory updated')
      } else {
        const res = await fetch('/api/factories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) { const err = await res.json(); toast.error(err.error || 'Failed to create'); return }
        toast.success('Factory created')
      }
      setDialogOpen(false)
      loadData()
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(factory: Factory) {
    setDeleting(true)
    try {
      const res = await fetch(`/api/factories/${factory.id}`, { method: 'DELETE' })
      if (!res.ok) { const err = await res.json(); toast.error(err.error || 'Failed to delete'); return }
      toast.success('Factory deleted')
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
          <h1 className="text-2xl font-semibold tracking-tight">Factories</h1>
          <p className="text-sm text-muted-foreground">Manage registered factories.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 size-4" />
          Add Factory
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Jobs</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No factories found.
                  </TableCell>
                </TableRow>
              ) : (
                factories.map((factory) => (
                  <TableRow key={factory.id}>
                    <TableCell className="font-medium">{factory.name}</TableCell>
                    <TableCell>{factory.address}</TableCell>
                    <TableCell>{factory.city}</TableCell>
                    <TableCell>{factory.phone}</TableCell>
                    <TableCell>{factory._count?.jobs ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-xs" onClick={() => openEdit(factory)}>
                          <Pencil className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon-xs" onClick={() => setDeleteConfirm(factory)}>
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
            <DialogTitle>{editing ? 'Edit Factory' : 'Add Factory'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the factory details.' : 'Enter the details for the new factory.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Factory name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Address"
              />
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
            <DialogTitle>Delete Factory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteConfirm?.name}? This will also delete all associated jobs.
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
