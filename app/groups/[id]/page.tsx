"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  getGroup,
  getProposals,
  createProposal,
  voteOnProposal,
  getJoinedGroups,
  type Group,
  type Proposal,
} from "../../../lib/groups"

export default function GroupDetailPage() {
  const params = useParams()
  const groupId = params.id as string

  const [group, setGroup] = useState<Group | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProposal, setNewProposal] = useState({ title: "", description: "" })
  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!groupId) return

    const loadedGroup = getGroup(groupId)
    const loadedProposals = getProposals(groupId)
    const joinedGroups = getJoinedGroups()
    const userIsJoined = joinedGroups.includes(groupId)

    // Load voted proposals from localStorage
    const voted = JSON.parse(localStorage.getItem(`voted_${groupId}`) || "[]")

    setGroup(loadedGroup)
    setProposals(loadedProposals)
    setIsJoined(userIsJoined)
    setVotedProposals(new Set(voted))
    setIsLoading(false)
  }, [groupId])

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProposal.title.trim() || !newProposal.description.trim() || !isJoined) return

    const proposal = createProposal(groupId, newProposal.title.trim(), newProposal.description.trim())
    setProposals([...proposals, proposal])
    setNewProposal({ title: "", description: "" })
    setShowCreateForm(false)
  }

  const handleVote = (proposalId: string, vote: "yes" | "no") => {
    if (!isJoined || votedProposals.has(proposalId)) return

    voteOnProposal(proposalId, vote)

    // Update local state
    const updatedProposals = proposals.map((proposal) => {
      if (proposal.id === proposalId) {
        return {
          ...proposal,
          votes: {
            ...proposal.votes,
            [vote]: proposal.votes[vote] + 1,
          },
        }
      }
      return proposal
    })
    setProposals(updatedProposals)

    // Mark as voted
    const newVotedProposals = new Set(votedProposals)
    newVotedProposals.add(proposalId)
    setVotedProposals(newVotedProposals)
    localStorage.setItem(`voted_${groupId}`, JSON.stringify([...newVotedProposals]))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
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
                  href="/groups/create"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create Group
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
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
                  href="/groups/create"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create Group
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Group Not Found</h1>
          <p className="text-muted-foreground mb-6">The group you're looking for doesn't exist.</p>
          <Link
            href="/groups"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Browse Groups
          </Link>
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
                href="/groups/create"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Create Group
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Group Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/groups" className="hover:text-foreground transition-colors">
              All Groups
            </Link>
            <span>/</span>
            <span>{group.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{group.name}</h1>
          <p className="text-muted-foreground mb-4">{group.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{group.memberCount} members</span>
            <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
            {isJoined && <span className="text-primary font-medium">Joined</span>}
          </div>
        </div>

        {/* Join Notice */}
        {!isJoined && (
          <div className="bg-muted border border-border rounded-lg p-4 mb-8">
            <p className="text-foreground font-medium mb-2">Join this group to participate</p>
            <p className="text-muted-foreground text-sm mb-4">
              You need to join this group to create proposals and vote anonymously.
            </p>
            <Link
              href="/groups"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Go Back to Join
            </Link>
          </div>
        )}

        {/* Create Proposal Section */}
        {isJoined && (
          <div className="mb-8">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Create New Proposal
              </button>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Create New Proposal</h3>
                <form onSubmit={handleCreateProposal} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
                      Proposal Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder="Enter proposal title"
                      required
                      maxLength={200}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      placeholder="Describe your proposal in detail"
                      required
                      maxLength={1000}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Create Proposal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setNewProposal({ title: "", description: "" })
                      }}
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/90 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Proposals List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Proposals {proposals.length > 0 && `(${proposals.length})`}
          </h2>

          {proposals.length === 0 ? (
            <div className="text-center py-12 bg-muted border border-border rounded-lg">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No proposals yet</h3>
              <p className="text-muted-foreground">
                {isJoined
                  ? "Be the first to create a proposal for this group."
                  : "Join this group to see and create proposals."}
              </p>
            </div>
          ) : (
            proposals.map((proposal) => {
              const totalVotes = proposal.votes.yes + proposal.votes.no
              const yesPercentage = totalVotes > 0 ? (proposal.votes.yes / totalVotes) * 100 : 0
              const noPercentage = totalVotes > 0 ? (proposal.votes.no / totalVotes) * 100 : 0
              const hasVoted = votedProposals.has(proposal.id)

              return (
                <div key={proposal.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">{proposal.title}</h3>
                    <p className="text-muted-foreground mb-3">{proposal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created {new Date(proposal.createdAt).toLocaleDateString()}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          proposal.status === "active"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {proposal.status}
                      </span>
                    </div>
                  </div>

                  {/* Voting Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-card-foreground">Total Votes: {totalVotes}</span>
                      {hasVoted && <span className="text-xs text-muted-foreground">You have voted</span>}
                    </div>

                    {/* Vote Buttons */}
                    {isJoined && proposal.status === "active" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVote(proposal.id, "yes")}
                          disabled={hasVoted}
                          className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Yes ({proposal.votes.yes})
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, "no")}
                          disabled={hasVoted}
                          className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md font-medium hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          No ({proposal.votes.no})
                        </button>
                      </div>
                    )}

                    {/* Vote Results */}
                    {totalVotes > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Yes: {yesPercentage.toFixed(1)}%</span>
                          <span className="text-muted-foreground">No: {noPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${yesPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
