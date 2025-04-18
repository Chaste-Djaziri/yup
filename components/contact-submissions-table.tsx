"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getContactSubmissions, updateContactStatus } from "@/app/actions/admin-actions"
import { formatDistanceToNow } from "date-fns"

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

export function ContactSubmissionsTable() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubmissions = async () => {
    setLoading(true)
    const result = await getContactSubmissions()
    if (result.success) {
      setSubmissions(result.data)
      setError(null)
    } else {
      setError(result.error || "Failed to fetch submissions")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateContactStatus(id, status)
    if (result.success) {
      // Update the local state
      setSubmissions(
        submissions.map((submission) =>
          submission.id === id ? { ...submission, status } : submission
        )
      )
    } else {
      setError(result.error || "Failed to update status")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading submissions...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error}
        <Button onClick={fetchSubmissions} className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  if (submissions.length === 0) {
    return <div className="text-center py-8">No contact submissions found.</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                {submission.first_name} {submission.last_name}
              </TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell>{submission.subject}</TableCell>
              <TableCell className="max-w-xs truncate">{submission.message}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    submission.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : submission.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : submission.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {submission.status}
                </span>
              </TableCell>
              <TableCell>
                <Select
                  value={submission.status}
                  onValueChange={(value) => handleStatusChange(submission.id, value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
