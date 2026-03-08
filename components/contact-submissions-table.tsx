"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getContactSubmissions, updateContactStatus, deleteContactSubmission, blockEmail } from "@/app/actions/admin-actions"
import { formatDistanceToNow } from "date-fns"
import { ChevronLeft, Inbox, Trash2, Archive, Mail, RefreshCw, ShieldAlert } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

type ContactSubmission = {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  created_at: string
  status: string
}

export function ContactSubmissionsTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [blockReason, setBlockReason] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)

  const fetchSubmissions = async () => {
    setLoading(true)
    const result = await getContactSubmissions()
    if (result.success) {
      setSubmissions(result.data)
      setFilteredSubmissions(result.data)
      setError(null)
    } else {
      setError(result.error || "Failed to fetch submissions")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = submissions.filter(
        (submission) =>
          submission.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          submission.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          submission.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          submission.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredSubmissions(filtered)
    } else {
      setFilteredSubmissions(submissions)
    }
  }, [searchQuery, submissions])

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateContactStatus(id, status)
    if (result.success) {
      // Update the local state
      const updatedSubmissions = submissions.map((submission) =>
        submission.id === id ? { ...submission, status } : submission,
      )
      setSubmissions(updatedSubmissions)

      // Update selected submission if it's the one being modified
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status })
      }

      toast({
        title: "Status updated",
        description: `Submission status changed to ${status}`,
      })
    } else {
      setError(result.error || "Failed to update status")
      toast({
        title: "Error",
        description: result.error || "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSubmission = async () => {
    if (!selectedSubmission) return

    setProcessingAction(true)
    const result = await deleteContactSubmission(selectedSubmission.id)
    setProcessingAction(false)
    
    if (result.success) {
      // Remove from local state
      const updatedSubmissions = submissions.filter((submission) => submission.id !== selectedSubmission.id)
      setSubmissions(updatedSubmissions)
      setFilteredSubmissions(filteredSubmissions.filter((submission) => submission.id !== selectedSubmission.id))
      setSelectedSubmission(null)
      setDeleteDialogOpen(false)
      
      toast({
        title: "Submission deleted",
        description: "The contact submission has been permanently deleted",
      })
    } else {
      setError(result.error || "Failed to delete submission")
      toast({
        title: "Error",
        description: result.error || "Failed to delete submission",
        variant: "destructive",
      })
    }
  }

  const handleBlockEmail = async () => {
    if (!selectedSubmission) return

    setProcessingAction(true)
    const result = await blockEmail(selectedSubmission.email, blockReason)
    setProcessingAction(false)
    
    if (result.success) {
      setBlockDialogOpen(false)
      setBlockReason("")
      
      toast({
        title: "Email blocked",
        description: `${selectedSubmission.email} has been added to the blocked list`,
      })
    } else {
      setError(result.error || "Failed to block email")
      toast({
        title: "Error",
        description: result.error || "Failed to block email",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading submissions...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-foreground/70">
        Error: {error}
        <Button onClick={fetchSubmissions} className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  if (filteredSubmissions.length === 0) {
    return <div className="text-center py-8">No contact submissions found.</div>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="default" className="bg-foreground">
            New
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="bg-secondary">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="default" className="bg-muted-foreground">
            Completed
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="default" className="bg-gray-500">
            Archived
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-220px)]">
      {/* List View */}
      <div className={`w-full ${selectedSubmission ? "hidden md:block md:w-1/3" : "w-full"} border-r overflow-auto`}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox size={18} />
            <span className="font-medium">Inbox</span>
            <Badge variant="outline" className="ml-2">
              {filteredSubmissions.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchSubmissions}>
            <RefreshCw size={16} />
          </Button>
        </div>
        <div className="divide-y">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedSubmission?.id === submission.id ? "bg-muted" : ""
              }`}
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium">
                  {submission.first_name} {submission.last_name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                </div>
              </div>
              <div className="text-sm font-medium truncate">{submission.subject}</div>
              <div className="text-sm text-gray-500 truncate">{submission.message}</div>
              <div className="mt-2 flex items-center justify-between">
                <div>{getStatusIcon(submission.status)}</div>
                <div className="text-xs text-gray-500">{submission.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail View */}
      {selectedSubmission ? (
        <div className={`w-full ${selectedSubmission ? "block md:w-2/3" : "hidden"} overflow-auto`}>
          <div className="p-4 border-b flex items-center justify-between">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSelectedSubmission(null)}>
              <ChevronLeft size={16} />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ShieldAlert size={16} className="text-foreground/70" />
                    <span>Block</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Block Email</DialogTitle>
                    <DialogDescription>
                      This will block all future submissions from {selectedSubmission.email}. This action can be reversed from the Blocked Emails tab.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <label className="block text-sm font-medium mb-2">Reason for blocking</label>
                    <Textarea
                      placeholder="Enter reason for blocking this email"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleBlockEmail}
                      disabled={processingAction || !blockReason.trim()}
                    >
                      {processingAction ? "Processing..." : "Block Email"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Trash2 size={16} className="text-foreground/70" />
                    <span>Delete</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Submission</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this submission? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteSubmission}
                      disabled={processingAction}
                    >
                      {processingAction ? "Processing..." : "Delete Submission"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="icon">
                <Archive size={16} />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail size={16} />
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{selectedSubmission.subject}</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {selectedSubmission.first_name[0]}
                    {selectedSubmission.last_name[0]}
                  </div>
                  <div>
                    <div className="font-medium">
                      {selectedSubmission.first_name} {selectedSubmission.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{selectedSubmission.email}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{new Date(selectedSubmission.created_at).toLocaleString()}</div>
              </div>
            </div>
            <div className="mb-6 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg min-h-[200px]">
              {selectedSubmission.message}
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusIcon(selectedSubmission.status)}
                </div>
                <Select
                  value={selectedSubmission.status}
                  onValueChange={(value) => handleStatusChange(selectedSubmission.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex w-2/3 items-center justify-center">
          <div className="text-center text-gray-500">
            <Mail size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Select a message to view its contents</p>
          </div>
        </div>
      )}
    </div>
  )
}
