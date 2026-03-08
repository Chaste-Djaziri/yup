"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getBlockedEmails, blockEmail, unblockEmail } from "@/app/actions/admin-actions"
import { RefreshCw, Ban, Unlock, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"

type BlockedEmail = {
  id: string
  email: string
  reason: string
  created_at: string
}

export function BlockedEmailsTable() {
  const [blockedEmails, setBlockedEmails] = useState<BlockedEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingAction, setProcessingAction] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [newBlockedEmail, setNewBlockedEmail] = useState("")
  const [blockReason, setBlockReason] = useState("")
  const [emailError, setEmailError] = useState("")

  const fetchBlockedEmails = async () => {
    setLoading(true)
    const result = await getBlockedEmails()
    if (result.success) {
      setBlockedEmails(result.data)
      setError(null)
    } else {
      setError(result.error || "Failed to fetch blocked emails")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBlockedEmails()
  }, [])

  const handleBlockEmail = async () => {
    // Validate email
    if (!newBlockedEmail) {
      setEmailError("Email is required")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newBlockedEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setEmailError("")
    setProcessingAction(true)

    const result = await blockEmail(newBlockedEmail, blockReason)

    if (result.success) {
      toast({
        title: "Email blocked",
        description: `${newBlockedEmail} has been added to the blocked list`,
      })
      setNewBlockedEmail("")
      setBlockReason("")
      setBlockDialogOpen(false)
      fetchBlockedEmails()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to block email",
        variant: "destructive",
      })
    }

    setProcessingAction(false)
  }

  const handleUnblockEmail = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to unblock ${email}?`)) {
      return
    }

    setProcessingAction(true)

    const result = await unblockEmail(id)

    if (result.success) {
      toast({
        title: "Email unblocked",
        description: `${email} has been removed from the blocked list`,
      })
      setBlockedEmails(blockedEmails.filter((item) => item.id !== id))
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to unblock email",
        variant: "destructive",
      })
    }

    setProcessingAction(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading blocked emails...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-foreground/70">
        Error: {error}
        <Button onClick={fetchBlockedEmails} className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ban size={18} />
          <span className="font-medium">Blocked Emails</span>
          <Badge variant="outline" className="ml-2">
            {blockedEmails.length}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus size={16} className="mr-1" />
                <span>Block Email</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block Email Address</DialogTitle>
                <DialogDescription>
                  Add an email address to the blocked list. Blocked emails will not be able to submit contact forms.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    value={newBlockedEmail}
                    onChange={(e) => setNewBlockedEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                  {emailError && <p className="text-sm text-foreground/70">{emailError}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="reason" className="text-sm font-medium">
                    Reason (Optional)
                  </label>
                  <Textarea
                    id="reason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Reason for blocking this email"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBlockEmail} disabled={processingAction}>
                  {processingAction ? "Processing..." : "Block Email"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="sm" onClick={fetchBlockedEmails}>
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {blockedEmails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No blocked emails found.</div>
      ) : (
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted/50">
            <div className="col-span-5">Email</div>
            <div className="col-span-4">Reason</div>
            <div className="col-span-2">Date Blocked</div>
            <div className="col-span-1">Actions</div>
          </div>
          <div className="divide-y">
            {blockedEmails.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                <div className="col-span-5 font-medium">{item.email}</div>
                <div className="col-span-4 text-sm text-muted-foreground">{item.reason || "No reason provided"}</div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnblockEmail(item.id, item.email)}
                    disabled={processingAction}
                    title="Unblock Email"
                  >
                    <Unlock size={16} className="text-foreground/70" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
