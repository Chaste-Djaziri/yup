"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getContactSubmissions, updateContactStatus } from "@/app/actions/admin-actions"
import { formatDistanceToNow } from "date-fns"
import { ChevronLeft, ChevronRight, Inbox, Star, Trash2, Archive, Mail, AlertCircle, RefreshCw } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

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
          submission.message.toLowerCase().includes(searchQuery.toLowerCase())
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
        submission.id === id ? { ...submission, status } : submission
      )
      setSubmissions(updatedSubmissions)
      
      // Update selected submission if it's the one being modified
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status })
      }
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

  if (filteredSubmissions.length === 0) {
    return <div className="text-center py-8">No contact submissions found.</div>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default" className="bg-blue-500">New</Badge>
      case "in-progress":
        return <Badge variant="default" className="bg-yellow-500">In Progress</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>
      case "archived":
        return <Badge variant="default" className="bg-gray-500">Archived</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-220px)]">
      {/* List View */}
      <div className={`w-full ${selectedSubmission ? 'hidden md:block md:w-1/3' : 'w-full'} border-r overflow-auto`}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox size={18} />
            <span className="font-medium">Inbox</span>
            <Badge variant="outline" className="ml-2">{filteredSubmissions.length}</Badge>
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
                selectedSubmission?.id === submission.id ? 'bg-blue-50' : ''
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
        <div className={`w-full ${selectedSubmission ? 'block md:w-2/3' : 'hidden'} overflow-auto`}>
          <div className="p-4 border-b flex items-center justify-between">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSelectedSubmission(null)}>
              <ChevronLeft size={16} />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Archive size={16} />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 size={16} />
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
                <div className="text-sm text-gray-500">
                  {new Date(selectedSubmission.created_at).toLocaleString()}
                </div>
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
