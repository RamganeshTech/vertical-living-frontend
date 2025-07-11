import { useState, useMemo } from "react"
import { Skeleton } from "../../components/ui/Skeleton"

interface RoleType {
  title: string
  icon: string
  list?: any[]
  isLoading: boolean
}

// RoleCard Component
const RoleCard: React.FC<RoleType> = ({ title, icon, list, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = useMemo(() => {
    if (!list?.length) return []
    return list?.filter((member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [list, searchTerm])

  return (
    <div className="bg-white border rounded-xl !min-h-[50%] !max-h-[93%] overflow-hidden border-blue-100 shadow-sm px-4 py-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-blue-800 font-semibold flex items-center gap-2 text-base">
          <i className={`fas ${icon} text-blue-600 text-lg`} />
          {title}
        </div>
        {list && (
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {list?.length} total
          </span>
        )}
      </div>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Members List */}
      <div className="max-h-[100%] overflow-y-auto custom-scrollbar pr-1 scroll-smooth scrollbar-thin scrollbar-thumb-blue-300 hover:scrollbar-thumb-blue-400 scrollbar-track-blue-100">
        {isLoading ? (
          <Skeleton className="h-4 w-1/2 mx-2 mb-2" />
        ) : filteredMembers?.length > 0 ? (
          <ul className="space-y-3 pt-1">
            {filteredMembers?.map((person: any) => (
              <li key={person._id} className="flex items-start gap-3 px-1">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mt-0.5">
                  <i className="fas fa-user" />
                </div>
                <div className="text-sm text-gray-700 leading-tight">
                  <p className="font-medium">{person.name}</p>
                  <p className="text-gray-500 text-xs">{person.email}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">No {title.toLowerCase()} found.</p>
        )}
      </div>
    </div>
  )
}


export default RoleCard