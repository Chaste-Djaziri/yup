"use client"

import { useState, useEffect, useTransition, type FormEvent } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminLogin } from "@/components/admin-login"
import { ContactSubmissionsTable } from "@/components/contact-submissions-table"
import { VolunteerApplicationsTable } from "@/components/volunteer-applications-table"
import { AcceptedMembersTable } from "@/components/accepted-members-table"
import { BlockedEmailsTable } from "@/components/blocked-emails-table"
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin-auth"
import { sendCustomEmail } from "@/app/actions/email-actions"
import { toast } from "@/components/ui/use-toast"
import { Search, RefreshCw, Users, Mail, UserCheck, ShieldAlert, Send } from 'lucide-react'

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [emailTo, setEmailTo] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [isSending, startTransition] = useTransition()

  useEffect(() => {
    // Check if admin is authenticated
    setIsAuthenticated(isAdminAuthenticated())
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    logoutAdmin()
    setIsAuthenticated(false)
  }

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    startTransition(async () => {
      const result = await sendCustomEmail({
        to: emailTo,
        subject: emailSubject,
        message: emailMessage,
      })

      if (result.success) {
        toast({
          title: "Email sent",
          description: "Your message has been delivered successfully.",
        })
        setEmailTo("")
        setEmailSubject("")
        setEmailMessage("")
      } else {
        toast({
          title: "Unable to send email",
          description: result.error ?? "Please try again later.",
          variant: "destructive",
        })
      }
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search submissions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <RefreshCw size={18} />
          </Button>
        </div>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail size={16} />
              <span>Contact Submissions</span>
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="flex items-center gap-2">
              <Users size={16} />
              <span>Volunteer Applications</span>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="flex items-center gap-2">
              <UserCheck size={16} />
              <span>Accepted Members</span>
            </TabsTrigger>
            <TabsTrigger value="blocked" className="flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>Blocked Emails</span>
            </TabsTrigger>
            <TabsTrigger value="custom-email" className="flex items-center gap-2">
              <Send size={16} />
              <span>Send Email</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="contacts" className="bg-white rounded-lg shadow">
            <ContactSubmissionsTable searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="volunteers" className="bg-white rounded-lg shadow">
            <VolunteerApplicationsTable searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="accepted" className="bg-white rounded-lg shadow">
            <AcceptedMembersTable searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="blocked" className="bg-white rounded-lg shadow">
            <BlockedEmailsTable searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="custom-email" className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="emailTo" className="text-sm font-medium text-gray-700">
                  Recipient email
                </label>
                <Input
                  id="emailTo"
                  type="email"
                  placeholder="recipient@example.com"
                  value={emailTo}
                  onChange={(event) => setEmailTo(event.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="emailSubject" className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <Input
                  id="emailSubject"
                  placeholder="Subject line"
                  value={emailSubject}
                  onChange={(event) => setEmailSubject(event.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="emailMessage" className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <Textarea
                  id="emailMessage"
                  placeholder="Type your message"
                  value={emailMessage}
                  onChange={(event) => setEmailMessage(event.target.value)}
                  required
                  className="mt-1 min-h-[200px]"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSending}>
                  {isSending ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
