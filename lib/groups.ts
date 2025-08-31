export interface Group {
    id: string
    name: string
    description: string
    createdAt: string
    memberCount: number
  }
  
  export interface Proposal {
    id: string
    groupId: string
    title: string
    description: string
    createdAt: string
    votes: {
      yes: number
      no: number
    }
    status: "active" | "closed"
  }
  
  // Group management functions
  export const getGroups = (): Group[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem("groups") || "[]")
  }
  
  export const getGroup = (id: string): Group | null => {
    const groups = getGroups()
    return groups.find((group) => group.id === id) || null
  }
  
  export const getJoinedGroups = (): string[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem("joinedGroups") || "[]")
  }
  
  export const joinGroup = (groupId: string): void => {
    const joinedGroups = getJoinedGroups()
    if (!joinedGroups.includes(groupId)) {
      const updatedJoinedGroups = [...joinedGroups, groupId]
      localStorage.setItem("joinedGroups", JSON.stringify(updatedJoinedGroups))
  
      // Increment member count
      const groups = getGroups()
      const updatedGroups = groups.map((group) =>
        group.id === groupId ? { ...group, memberCount: group.memberCount + 1 } : group,
      )
      localStorage.setItem("groups", JSON.stringify(updatedGroups))
    }
  }
  
  export const createGroup = (name: string, description: string): Group => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      memberCount: 1, // Creator automatically joins
    }
  
    const groups = getGroups()
    const updatedGroups = [...groups, newGroup]
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
  
    // Automatically join the creator to the group
    const joinedGroups = getJoinedGroups()
    const updatedJoinedGroups = [...joinedGroups, newGroup.id]
    localStorage.setItem("joinedGroups", JSON.stringify(updatedJoinedGroups))
  
    return newGroup
  }
  
  // Proposal management functions
  export const getProposals = (groupId: string): Proposal[] => {
    if (typeof window === "undefined") return []
    const proposals = JSON.parse(localStorage.getItem("proposals") || "[]")
    return proposals.filter((proposal: Proposal) => proposal.groupId === groupId)
  }
  
  export const createProposal = (groupId: string, title: string, description: string): Proposal => {
    const newProposal: Proposal = {
      id: Date.now().toString(),
      groupId,
      title,
      description,
      createdAt: new Date().toISOString(),
      votes: { yes: 0, no: 0 },
      status: "active",
    }
  
    const proposals = JSON.parse(localStorage.getItem("proposals") || "[]")
    const updatedProposals = [...proposals, newProposal]
    localStorage.setItem("proposals", JSON.stringify(updatedProposals))
  
    return newProposal
  }
  
  export const voteOnProposal = (proposalId: string, vote: "yes" | "no"): void => {
    const proposals = JSON.parse(localStorage.getItem("proposals") || "[]")
    const updatedProposals = proposals.map((proposal: Proposal) => {
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
    localStorage.setItem("proposals", JSON.stringify(updatedProposals))
  }
  