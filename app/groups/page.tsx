"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import GroupCard from "@/components/group-card"
import { getGroups, getJoinedGroups, joinGroup, type Group } from "@/lib/groups"

export default function AllGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [joinedGroups, setJoinedGroups] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load groups and joined groups from localStorage
    const loadedGroups = getGroups()
    const loadedJoinedGroups = getJoinedGroups()
    setGroups(loadedGroups)
    setJoinedGroups(loadedJoinedGroups)
    setIsLoading(false)
  }, [])

  const handleJoinGroup = async (groupId: string) => {
    joinGroup(groupId)
    setJoinedGroups([...joinedGroups, groupId])
    // Update the groups list to reflect new member count
    const updatedGroups = getGroups()
    setGroups(updatedGroups)
  }

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-foreground">
                  AnonSignal
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/groups" className="text-foreground hover:text-muted-foreground transition-colors">
                  All Groups
                </Link>
                <Link href="/my-groups" className="text-foreground hover:text-muted-foreground transition-colors">
                  My Groups
                </Link>
                <Link
                  href="/create-group"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create Group
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-foreground">
                AnonSignal
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/groups" className="text-foreground hover:text-muted-foreground transition-colors">
                All Groups
              </Link>
              <Link href="/my-groups" className="text-foreground hover:text-muted-foreground transition-colors">
                My Groups
              </Link>
              <Link
                href="/create-group"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Create Group
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Groups</h1>
          <p className="text-muted-foreground">
            Discover and join groups to participate in anonymous feedback and voting.
          </p>
        </div>

        {/* Search and Create Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          <Link
            href="/create-group"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors whitespace-nowrap"
          >
            Create New Group
          </Link>
        </div>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            {groups.length === 0 ? (
              <div>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No groups yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to create a group and start gathering feedback.
                </p>
                <Link
                  href="/create-group"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Create First Group
                </Link>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No groups found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or create a new group.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                showJoinButton={true}
                showViewButton={true}
                isJoined={joinedGroups.includes(group.id)}
                onJoin={handleJoinGroup}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {groups.length > 0 && (
          <div className="mt-12 bg-muted border border-border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">{groups.length}</div>
                <div className="text-sm text-muted-foreground">Total Groups</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{joinedGroups.length}</div>
                <div className="text-sm text-muted-foreground">Groups Joined</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {groups.reduce((sum, group) => sum + group.memberCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
