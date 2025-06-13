"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getAcceptedMembers } from "@/app/actions/admin-actions"
import { RefreshCw, Users, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { sendVolunteerEmail } from "@/app/actions/email-actions"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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

export function AcceptedMembersTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [members, setMembers] = useState<VolunteerApplication[]>([])
  const [filteredMembers, setFilteredMembers] = useState<VolunteerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)

  const fetchMembers = async () => {
    setLoading(true)
    const result = await getAcceptedMembers()
    if (result.success) {
      setMembers(result.data)
      setFilteredMembers(result.data)
      setError(null)
    } else {
      setError(result.error || "Failed to fetch accepted members")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = members.filter(
        (member) =>
          member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (member.country && member.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (member.opportunity && member.opportunity.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredMembers(filtered)
    } else {
      setFilteredMembers(members)
    }
  }, [searchQuery, members])

  const sendGroupEmail = async () => {
    try {
      setSendingEmail(true)

      // Confirm before sending to multiple recipients
      if (!window.confirm(`Send an email to all ${filteredMembers.length} members?`)) {
        setSendingEmail(false)
        return
      }

      let successCount = 0
      let failCount = 0

      // Send emails in sequence to avoid rate limits
      for (const member of filteredMembers) {
        const result = await sendVolunteerEmail({
          to: member.email,
          firstName: member.first_name,
          lastName: member.last_name,
          status: "group-message",
          opportunity: member.opportunity || "Volunteer position",
        })

        if (result.success) {
          successCount++
        } else {
          failCount++
        }

        // Small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      if (successCount > 0) {
        toast({
          title: "Emails sent",
          description: `Successfully sent ${successCount} emails${failCount > 0 ? `, ${failCount} failed` : ""}`,
          variant: failCount > 0 ? "default" : "default",
        })
      } else {
        toast({
          title: "Failed to send emails",
          description: "There was an error sending the emails",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending group email:", error)
      toast({
        title: "Failed to send emails",
        description: "There was an unexpected error sending the emails",
        variant: "destructive",
      })
    } finally {
      setSendingEmail(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading members...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error}
        <Button onClick={fetchMembers} className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  if (filteredMembers.length === 0) {
    return <div className="text-center py-8">No accepted members found.</div>
  }

  // Group members by country
  const membersByCountry: Record<string, VolunteerApplication[]> = {}
  filteredMembers.forEach((member) => {
    const country = member.country || "Unknown"
    if (!membersByCountry[country]) {
      membersByCountry[country] = []
    }
    membersByCountry[country].push(member)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} />
          <span className="font-medium">Accepted Members</span>
          <Badge variant="outline" className="ml-2">
            {filteredMembers.length}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={sendingEmail || filteredMembers.length === 0}
            onClick={sendGroupEmail}
          >
            <Send size={16} className="mr-1" />
            <span>{sendingEmail ? "Sending..." : "Email All"}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchMembers}>
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Statistics</CardTitle>
          <CardDescription>Overview of accepted members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Members</div>
              <div className="text-2xl font-bold">{filteredMembers.length}</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Countries</div>
              <div className="text-2xl font-bold">{Object.keys(membersByCountry).length}</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Most Common Country</div>
              <div className="text-2xl font-bold">
                {Object.entries(membersByCountry).sort((a, b) => b[1].length - a[1].length)[0]?.[0] || "N/A"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members by country */}
      <div className="space-y-6">
        {Object.entries(membersByCountry)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([country, countryMembers]) => (
            <Card key={country}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{country}</CardTitle>
                  <Badge variant="outline">{countryMembers.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countryMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Avatar>
                        <AvatarFallback>
                          {member.first_name[0]}
                          {member.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.opportunity || "General Volunteer"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
