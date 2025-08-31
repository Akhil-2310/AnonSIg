"use client"

import { useState } from "react"
import Link from "next/link"

interface Group {
  id: string
  name: string
  description: string
  createdAt: string
  memberCount: number
}

interface GroupCardProps {
  group: Group
  showJoinButton?: boolean
  showViewButton?: boolean
  isJoined?: boolean
  onJoin?: (groupId: string) => void
}

export default function GroupCard({
  group,
  showJoinButton = false,
  showViewButton = true,
  isJoined = false,
  onJoin,
}: GroupCardProps) {
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async () => {
    if (!onJoin) return
    setIsJoining(true)
    await onJoin(group.id)
    setIsJoining(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-card-foreground">{group.name}</h3>
        <span className="text-sm text-muted-foreground">
          {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="text-muted-foreground mb-4 line-clamp-3">{group.description}</p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Created {formatDate(group.createdAt)}</span>

        <div className="flex gap-2">
          {showJoinButton && !isJoined && (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isJoining ? "Joining..." : "Join Group"}
            </button>
          )}

          {showViewButton && (
            <Link
              href={`/groups/${group.id}`}
              className="border border-border text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            >
              View Group
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
