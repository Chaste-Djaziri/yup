"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getVolunteerApplications, updateVolunteerStatus } from "@/app/actions/admin-actions"
import { formatDistanceToNow } from "date-fns"

type VolunteerApplication = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  opportunity: string
  availability: string
  skills: string
  motivation: string
  terms: boolean
  created_at: string
  status: string
}

export function VolunteerApplicationsTable() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = async () => {
    setLoading(true)
    const result = await getVolunteerApplications()
    if (result.success) {
      setApplications(result.data)
      setError(null)
    } else {
      setError(result.error || "Failed to fetch applications")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateVolunteerStatus(id, status)
    if (result.success) {
      // Update the local state
      setApplications(
        applications.map((application) => (application.id === id ? { ...application, status } : application)),
      )
    } else {
      setError(result.error || "Failed to update status")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error}
        <Button onClick={fetchApplications} className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  if (applications.length === 0) {
    return <div className="text-center py-8">No volunteer applications found.</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Opportunity</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                {application.first_name} {application.last_name}
              </TableCell>
              <TableCell>{application.email}</TableCell>
              <TableCell>{application.phone || "N/A"}</TableCell>
              <TableCell>{application.opportunity || "N/A"}</TableCell>
              <TableCell>{application.availability || "N/A"}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    application.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : application.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : application.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {application.status}
                </span>
              </TableCell>
              <TableCell>
                <Select value={application.status} onValueChange={(value) => handleStatusChange(application.id, value)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
