import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { useDeleteRoomRequirement } from "../../../apiList/Stage Api/requirementFormApi";
import { toast } from "../../../utils/toast";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

type SectionConfigType = {
  roomName: string;
  _id: string
  // label: string;
  // icon: string;
};

type Props = {
  sections: SectionConfigType[];
  setIsCreateRoomOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const SectionCards = ({ sections, setIsCreateRoomOpen }: Props) => {
  const { projectId } = useParams()



  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.clientrequirement?.delete;
  // const canList = role === "owner" || permission?.clientrequirement?.list;
  const canCreate = role === "owner" || permission?.clientrequirement?.create;
  const canEdit = role === "owner" || permission?.clientrequirement?.edit;



  const navigate = useNavigate()


  const { mutateAsync: deleteRoom, isPending: deletepending } = useDeleteRoomRequirement()






  return (
    <section className="w-full">
      {/* Header */}
      {/* <div className="mb-8 flex justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Project Rooms</h2>
          <p className="hidden sm:inline-block text-slate-600">Manage requirements and items for each room</p>

        </div> */}

        <div className="mb-6 flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
             <i className="fa-solid fa-layer-group mr-2 text-gray-400 text-base" /> Project Rooms
          </h2>
          <p className="hidden sm:inline-block text-sm text-gray-500 mt-1">Manage requirements and items for each room</p>
        </div>

        {(canCreate || canEdit) && <div className="mt-4">
          <Button
            onClick={() => setIsCreateRoomOpen(true)}
            // className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            className="bg-gray-800 hover:bg-gray-900 text-white shadow-sm h-9 px-4 text-sm font-medium transition-colors"
          >
            {/* <i className="fa-solid fa-plus mr-2" /> New Room */}
            + Create New Room
          </Button>
        </div>}
      </div>

      {!Array.isArray(sections) || !sections?.length ?
        (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-slate-50 rounded-full p-6 mb-4">
              <i className="fas fa-home text-4xl text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Rooms Available</h3>
            <p className="text-slate-500 text-center max-w-md">
              There are currently no rooms configured for this project. Add some rooms to get started.
            </p>
          </div>
        )
        :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((room) => {

            const handleDeleteRoom = async () => {
              try {
                await deleteRoom({ projectId: projectId!, roomId: room._id });
                toast({ title: "Success", description: "Room deleted successfully" });
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error?.response?.data?.message || error?.message || "Failed to delete room",
                  variant: "destructive",
                });
              }
            };

            return (
              <>

                {/* <div
                  key={room._id}
                  className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`roompage/${room._id}`)}
                > */}

                <div
                  key={room._id}
                  className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                  onClick={() => navigate(`roompage/${room._id}`)}
                >
                  {/* Card Content */}
                  {/* <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
                        <i className="fas fa-door-open text-2xl text-blue-600 group-hover:text-blue-700" />
                      </div>
                    */}

                    <div className="p-5 flex-1 flex flex-col">
                    
                    {/* Top Row: Icon & Delete */}
                    <div className="flex items-start justify-between mb-4">
                      {/* Room Icon Container */}
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                        <i className="fa-solid fa-door-open text-gray-500 group-hover:text-gray-800" />
                      </div>

                     {canDelete && <div>
                        <Button variant="ghost" isLoading={deletepending} 
                        // className="hover:text-white" 
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteRoom()
                        }
                        }>
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>}
                    </div>

                    {/* Room Name */}
                    {/* <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors duration-300 mb-2 line-clamp-2">
                      {room.roomName}
                    </h3> */}

                    <h3 className="font-bold text-[15px] text-gray-800 mb-1.5 line-clamp-2 leading-tight">
                      {room.roomName}
                    </h3> 

                    {/* <div className="flex items-center text-sm text-slate-500 mb-4">
                      <i className="fas fa-list-ul mr-2" />
                      <span>Manage items & requirements</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Click to manage</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>*/}



                    {/* Room Subtext */}
                    <div className="flex items-center text-[11px] font-medium text-gray-500 mb-5">
                      <i className="fa-solid fa-list-check mr-1.5 text-gray-400" />
                      <span>Manage items & requirements</span>
                    </div>

                    {/* Bottom Status / Indicator */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 transition-colors">
                        Click to manage
                      </span>
                      <i className="fa-solid fa-arrow-right text-xs text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div> 

                  

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </>
            )
          })}
        </div>
      }

    </section>
  )
};

export default React.memo(SectionCards);