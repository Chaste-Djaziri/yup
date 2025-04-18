"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AdminLogin } from "@/components/admin-login"
import { ContactSubmissionsTable } from "@/components/contact-submissions-table"
import { VolunteerApplicationsTable } from "@/components/volunteer-applications-table"
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin-auth"

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteer Applications</TabsTrigger>
          </TabsList>
          <TabsContent value="contacts" className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contact Submissions</h2>
            <ContactSubmissionsTable />
          </TabsContent>
          <TabsContent value="volunteers" className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Volunteer Applications</h2>
            <VolunteerApplicationsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
