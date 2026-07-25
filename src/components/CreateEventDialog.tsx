import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { createEvent } from '@/lib/events'
import type { EventRow } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

interface CreateEventDialogProps {
  onCreated: (event: EventRow) => void
}

export function CreateEventDialog({ onCreated }: CreateEventDialogProps) {
  const { session } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!session) return

    setIsSubmitting(true)
    try {
      const created = await createEvent(session.user.id, name, eventDate || null)
      onCreated(created)
      toast.success('Etkinlik oluşturuldu')
      setName('')
      setEventDate('')
      setIsOpen(false)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
      toast.error('Etkinlik oluşturulamadı', { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button>Yeni Etkinlik</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Yeni Etkinlik Oluştur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Etkinlik Adı</Label>
            <Input
              id="event-name"
              required
              placeholder="Ayşe & Mehmet'in Düğünü"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-date">Tarih (opsiyonel)</Label>
            <Input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Oluşturuluyor…' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
