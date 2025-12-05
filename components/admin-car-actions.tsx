"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function AdminCarActions({ id, featured, status }: { id: string; featured: boolean; status: 'PENDING' | 'APPROVED' | 'REJECTED' }) {
  const [busy, setBusy] = useState(false)

  const toggleFeatured = async () => {
    try {
      setBusy(true)
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
      })
      if (!res.ok) throw new Error('Failed to update')
      location.reload()
    } finally {
      setBusy(false)
    }
  }

  const setStatus = async (next: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      setBusy(true)
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      location.reload()
    } finally {
      setBusy(false)
    }
  }

  const del = async () => {
    if (!confirm('Delete this car?')) return
    try {
      setBusy(true)
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      location.reload()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={toggleFeatured} disabled={busy}>
        {featured ? 'Unfeature' : 'Feature'}
      </Button>
      {status !== 'APPROVED' && (
        <Button size="sm" variant="default" onClick={() => setStatus('APPROVED')} disabled={busy}>
          Approve
        </Button>
      )}
      {status !== 'REJECTED' && (
        <Button size="sm" variant="secondary" onClick={() => setStatus('REJECTED')} disabled={busy}>
          Reject
        </Button>
      )}
      <Button size="sm" variant="destructive" onClick={del} disabled={busy}>
        Delete
      </Button>
    </div>
  )
}
