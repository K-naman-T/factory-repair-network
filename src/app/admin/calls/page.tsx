'use client'

import { useEffect, useState, useCallback } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Phone } from 'lucide-react'

function IntentBadge({ intent }: { intent: string }) {
  const styles: Record<string, string> = {
    repair_request: 'bg-[#e8eef5] text-[#1e3a5f]',
    emergency: 'bg-[#f9e8e8] text-[#c62828]',
    inquiry: 'bg-[#e8f5ec] text-[#2d7d46]',
    follow_up: 'bg-[#fdf0e3] text-[#d4782a]',
  }
  return (
    <span className={`inline-flex items-center rounded-[9999px] px-2.5 py-0.5 text-[0.75rem] font-medium capitalize ${styles[intent] || 'bg-[#f8f7f5] text-[#4a4540]'}`}>
      {intent.replace(/_/g, ' ')}
    </span>
  )
}

interface CallLog {
  id: number
  phone: string
  intent: string
  transcript: string | null
  createdAt: string
}

export default function AdminCalls() {
  const [calls, setCalls] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/calls')
      const data = await res.json()
      setCalls(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load calls', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

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
      <div className="flex items-center gap-2">
        <Phone className="size-5 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Call Logs</h1>
          <p className="text-sm text-muted-foreground">
            Incoming call history from the Twilio webhook.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#d4d0ca] rounded-[12px] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8f7f5]">
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Phone</TableHead>
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Intent</TableHead>
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Transcript</TableHead>
              <TableHead className="px-4 py-3 text-[0.8125rem] font-medium text-[#8a8580] uppercase tracking-wider">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="px-4 py-8 text-center text-[0.9375rem] text-[#8a8580]">
                  No call logs yet.
                </TableCell>
              </TableRow>
            ) : (
              calls.map((call) => (
                <TableRow key={call.id} className="transition-colors hover:bg-[#f8f7f5]">
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#1a1a1a] font-mono">{call.phone}</TableCell>
                  <TableCell className="px-4 py-3">
                    <IntentBadge intent={call.intent} />
                  </TableCell>
                  <TableCell className="px-4 py-3 max-w-xs">
                    <p className="truncate text-[0.9375rem] text-[#4a4540]">
                      {call.transcript || '—'}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[0.9375rem] text-[#4a4540]">
                    {new Date(call.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
