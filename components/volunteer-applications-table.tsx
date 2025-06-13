"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  getVolunteerApplications,
  updateVolunteerStatus,
  deleteVolunteerApplication,
} from "@/app/actions/admin-actions"
import { formatDistanceToNow } from "date-fns"
import { ChevronLeft, RefreshCw, Inbox, Trash2, Archive, Mail, Send, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { sendVolunteerEmail } from "@/app/actions/email-actions"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type VolunteerApplication = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)
  const [requestInfoDialogOpen, setRequestInfoDialogOpen] = useState(false)

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
          (application.country && application.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
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

      toast({
        title: "Status updated",
        description: `Application status changed to ${status}`,
      })

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
      toast({
        title: "Error",
        description: result.error || "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteApplication = async () => {
    if (!selectedApplication) return

    setProcessingAction(true)
    console.log("Deleting application with ID:", selectedApplication.id)

    try {
      const result = await deleteVolunteerApplication(selectedApplication.id)

      if (result.success) {
        console.log("Delete operation successful, updating UI")
        // Remove from local state
        const updatedApplications = applications.filter((application) => application.id !== selectedApplication.id)
        setApplications(updatedApplications)
        setFilteredApplications(filteredApplications.filter((application) => application.id !== selectedApplication.id))
        setSelectedApplication(null)
        setDeleteDialogOpen(false)

        toast({
          title: "Application deleted",
          description: "The volunteer application has been permanently deleted",
        })
      } else {
        console.error("Delete operation failed:", result.error)
        setError(result.error || "Failed to delete application")
        toast({
          title: "Error",
          description: result.error || "Failed to delete application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Exception during delete operation:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the application",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  const sendEmailNotification = async (application: VolunteerApplication, status: string) => {
    try {
      setSendingEmail(true)
      const result = await sendVolunteerEmail({
        to: application.email,
        firstName: application.first_name,
        lastName: application.last_name,
        status,
        opportunity: application.opportunity || "Volunteer position",
        country: application.country || "Rwanda", // Pass the country, default to Rwanda if not specified
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

  const requestMissingInformation = async () => {
    if (!selectedApplication) return

    try {
      setSendingEmail(true)

      // Determine what information is missing
      const missingFields = []
      if (!selectedApplication.country) missingFields.push("country")
      if (!selectedApplication.phone) missingFields.push("phone number")
      if (!selectedApplication.skills) missingFields.push("skills")

      if (missingFields.length === 0) {
        toast({
          title: "No missing information",
          description: "This application has all required information.",
        })
        setRequestInfoDialogOpen(false)
        return
      }

      const result = await sendVolunteerEmail({
        to: selectedApplication.email,
        firstName: selectedApplication.first_name,
        lastName: selectedApplication.last_name,
        status: "info-request",
        opportunity: selectedApplication.opportunity || "Volunteer position",
        missingFields: missingFields.join(", "),
      })

      if (result.success) {
        toast({
          title: "Request sent",
          description: `Email requesting missing information has been sent to ${selectedApplication.email}`,
          variant: "default",
        })
        setRequestInfoDialogOpen(false)
      } else {
        toast({
          title: "Failed to send request",
          description: result.error || "There was an error sending the email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Failed to send request",
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

  const hasMissingInformation = (application: VolunteerApplication) => {
    return !application.country || !application.phone || !application.skills
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
                <div className="font-medium flex items-center gap-1">
                  {application.first_name} {application.last_name}
                  {hasMissingInformation(application) && (
                    <AlertCircle size={14} className="text-amber-500" title="Missing information" />
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                </div>
              </div>
              <div className="text-sm font-medium truncate">{application.opportunity || "Volunteer Application"}</div>
              <div className="text-sm text-gray-500 truncate">{application.motivation}</div>
              <div className="mt-2 flex items-center justify-between">
                <div>{getStatusIcon(application.status)}</div>
                <div className="text-xs text-gray-500">
                  {application.country ? `${application.email} (${application.country})` : application.email}
                </div>
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
                className="flex items-center gap-1"
              >
                <Send size={16} className="mr-1" />
                <span>Send Email</span>
              </Button>

              {hasMissingInformation(selectedApplication) && (
                <Dialog open={requestInfoDialogOpen} onOpenChange={setRequestInfoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <AlertCircle size={16} className="text-amber-500 mr-1" />
                      <span>Request Info</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Missing Information</DialogTitle>
                      <DialogDescription>
                        Send an email to request missing information from this applicant.
                        {!selectedApplication.country && <p className="mt-2">• Country is missing</p>}
                        {!selectedApplication.phone && <p>• Phone number is missing</p>}
                        {!selectedApplication.skills && <p>• Skills information is missing</p>}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setRequestInfoDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={requestMissingInformation} disabled={sendingEmail}>
                        {sendingEmail ? "Sending..." : "Send Request"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Trash2 size={16} className="text-red-500" />
                    <span>Delete</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Application</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this application? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteApplication} disabled={processingAction}>
                      {processingAction ? "Processing..." : "Delete Application"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="icon">
                <Archive size={16} />
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

            <Tabs defaultValue="details" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Application Details</TabsTrigger>
                <TabsTrigger value="status">Status & Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Personal Information</h3>
                    <div className="text-sm space-y-2">
                      <p>
                        <span className="font-medium">Full Name:</span> {selectedApplication.first_name}{" "}
                        {selectedApplication.last_name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {selectedApplication.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedApplication.phone || (
                          <span className="text-amber-500 flex items-center gap-1">
                            <AlertCircle size={14} />
                            Not provided
                          </span>
                        )}
                      </p>
                      <p>
                        <span className="font-medium">Country:</span>{" "}
                        {selectedApplication.country || (
                          <span className="text-amber-500 flex items-center gap-1">
                            <AlertCircle size={14} />
                            Not specified
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Volunteer Details</h3>
                    <div className="text-sm space-y-2">
                      <p>
                        <span className="font-medium">Opportunity:</span>{" "}
                        {selectedApplication.opportunity || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Availability:</span>{" "}
                        {selectedApplication.availability || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Application Date:</span>{" "}
                        {new Date(selectedApplication.created_at).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Terms Accepted:</span> {selectedApplication.terms ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Skills & Experience</h3>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                    {selectedApplication.skills || (
                      <span className="text-amber-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        Not provided
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Motivation</h3>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                    {selectedApplication.motivation || "Not provided"}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="status" className="space-y-4 pt-4">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium mb-2">Current Status</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusIcon(selectedApplication.status)}
                    <span className="text-sm">
                      {selectedApplication.status === "new" && "New application awaiting review"}
                      {selectedApplication.status === "in-progress" && "Application is being processed"}
                      {selectedApplication.status === "accepted" && "Applicant has been accepted"}
                      {selectedApplication.status === "rejected" && "Application has been rejected"}
                      {selectedApplication.status === "archived" && "Application has been archived"}
                    </span>
                  </div>

                  <h3 className="font-medium mb-2">Update Status</h3>
                  <Select
                    value={selectedApplication.status}
                    onValueChange={(value) => handleStatusChange(selectedApplication.id, value)}
                  >
                    <SelectTrigger className="w-full mb-4">
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

                  <h3 className="font-medium mb-2">Actions</h3>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={sendingEmail}
                      onClick={() => sendEmailNotification(selectedApplication, selectedApplication.status)}
                    >
                      <Send size={16} className="mr-2" />
                      Send Status Notification Email
                    </Button>

                    {hasMissingInformation(selectedApplication) && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setRequestInfoDialogOpen(true)}
                        disabled={sendingEmail}
                      >
                        <AlertCircle size={16} className="mr-2 text-amber-500" />
                        Request Missing Information
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 size={16} className="mr-2 text-red-500" />
                      Delete Application
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
