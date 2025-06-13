"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminLogin } from "@/components/admin-login"
import { ContactSubmissionsTable } from "@/components/contact-submissions-table"
import { VolunteerApplicationsTable } from "@/components/volunteer-applications-table"
import { AcceptedMembersTable } from "@/components/accepted-members-table"
import { BlockedEmailsTable } from "@/components/blocked-emails-table"
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin-auth"
import { Search, RefreshCw, Users, Mail, UserCheck, ShieldAlert } from 'lucide-react'

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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
        </Tabs>
      </div>
    </div>
  )
}
