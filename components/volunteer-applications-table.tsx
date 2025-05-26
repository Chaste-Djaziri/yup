"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getVolunteerApplications, updateVolunteerStatus } from "@/app/actions/admin-actions"
import { formatDistanceToNow } from "date-fns"
import { ChevronLeft, RefreshCw, Inbox, Trash2, Archive, Mail, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { sendVolunteerEmail } from "@/app/actions/email-actions"
import { toast } from "@/components/ui/use-toast"

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

export function VolunteerApplicationsTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [applications, setApplications] = useState<VolunteerApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<VolunteerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<VolunteerApplication | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)

  const fetchApplications = async () => {
    setLoading(true)
    const result = await getVolunteerApplications()
    if (result.success) {
      setApplications(result.data)
      setFilteredApplications(result.data)
      setError(null)
    } else {
      setError(result.error || "Failed to fetch applications")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = applications.filter(
        (application) =>
          application.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          application.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          application.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (application.opportunity && application.opportunity.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (application.motivation && application.motivation.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredApplications(filtered)
    } else {
      setFilteredApplications(applications)
    }
  }, [searchQuery, applications])

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateVolunteerStatus(id, status)
    if (result.success) {
      // Update the local state
      const updatedApplications = applications.map((application) =>
        application.id === id ? { ...application, status } : application,
      )
      setApplications(updatedApplications)

      // Update selected application if it's the one being modified
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication({ ...selectedApplication, status })
      }

      // If status is accepted or rejected, ask if they want to send an email
      if ((status === "accepted" || status === "rejected") && selectedApplication) {
        const shouldSendEmail = window.confirm(
          `Do you want to send an email notification about this ${status} application?`,
        )
        if (shouldSendEmail) {
          await sendEmailNotification(selectedApplication, status)
        }
      }
    } else {
      setError(result.error || "Failed to update status")
    }
  }

  const sendEmailNotification = async (application: VolunteerApplication, status: string) => {
    try {
      setSendingEmail(true)
      const result = await sendVolunteerEmail({
        applicationId: application.id,       // <-- here
        to: application.email,
        firstName: application.first_name,
        lastName: application.last_name,
        status,
        opportunity: application.opportunity || "Volunteer position",
      })
    
      if (result.success) {
        toast({
          title: "Email sent",
          description: `Notification email has been sent to ${application.email}`,
          variant: "default",
        })
      } else {
        toast({
          title: "Failed to send email",
          description: result.error || "There was an error sending the email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Failed to send email",
        description: "There was an unexpected error sending the email",
        variant: "destructive",
      })
    } finally {
      setSendingEmail(false)
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

  if (filteredApplications.length === 0) {
    return <div className="text-center py-8">No volunteer applications found.</div>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="default" className="bg-blue-500">
            New
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="bg-yellow-500">
            In Progress
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="default" className="bg-green-500">
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="default" className="bg-red-500">
            Rejected
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
      <div className={`w-full ${selectedApplication ? "hidden md:block md:w-1/3" : "w-full"} border-r overflow-auto`}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox size={18} />
            <span className="font-medium">Applications</span>
            <Badge variant="outline" className="ml-2">
              {filteredApplications.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchApplications}>
            <RefreshCw size={16} />
          </Button>
        </div>
        <div className="divide-y">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedApplication?.id === application.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedApplication(application)}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium">
                  {application.first_name} {application.last_name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                </div>
              </div>
              <div className="text-sm font-medium truncate">{application.opportunity || "Volunteer Application"}</div>
              <div className="text-sm text-gray-500 truncate">{application.motivation}</div>
              <div className="mt-2 flex items-center justify-between">
                <div>{getStatusIcon(application.status)}</div>
                <div className="text-xs text-gray-500">{application.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail View */}
      {selectedApplication ? (
        <div className={`w-full ${selectedApplication ? "block md:w-2/3" : "hidden"} overflow-auto`}>
          <div className="p-4 border-b flex items-center justify-between">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSelectedApplication(null)}>
              <ChevronLeft size={16} />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={sendingEmail}
                onClick={() => sendEmailNotification(selectedApplication, selectedApplication.status)}
              >
                <Send size={16} className="mr-2" />
                Send Email
              </Button>
              <Button variant="ghost" size="icon">
                <Archive size={16} />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{selectedApplication.opportunity || "Volunteer Application"}</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {selectedApplication.first_name[0]}
                    {selectedApplication.last_name[0]}
                  </div>
                  <div>
                    <div className="font-medium">
                      {selectedApplication.first_name} {selectedApplication.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{selectedApplication.email}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{new Date(selectedApplication.created_at).toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Contact Information</h3>
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Email:</span> {selectedApplication.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {selectedApplication.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Availability</h3>
                <div className="text-sm">
                  <p>{selectedApplication.availability || "Not specified"}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                {selectedApplication.skills || "Not provided"}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Motivation</h3>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                {selectedApplication.motivation}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusIcon(selectedApplication.status)}
                </div>
                <Select
                  value={selectedApplication.status}
                  onValueChange={(value) => handleStatusChange(selectedApplication.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
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
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex w-2/3 items-center justify-center">
          <div className="text-center text-gray-500">
            <Mail size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Select an application to view its details</p>
          </div>
        </div>
      )}
    </div>
  )
}
