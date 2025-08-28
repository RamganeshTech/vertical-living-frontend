
// import type React from "react"
// import { useState, useRef } from "react"
// import { Button } from "../../../components/ui/Button"
// import { Input } from "../../../components/ui/Input"
// import { Textarea } from "../../../components/ui/TextArea" 
// import { Label } from "../../../components/ui/Label" 
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/Dialog"
// import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select"
// import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 
// // import { Card, CardContent, CardHeader, CardTitle } from 
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"


// interface ImageFile {
//   _id?: string
//   fileType: "image" | "pdf"
//   url: string
//   originalName?: string
//   uploadedAt?: Date
// }

// interface DailyTask {
//   _id?: string
//   datePlanned: string
//   room: string
//   workDescription: string
//   startTime: string
//   endTime: string
//   materialsNeeded: string[]
//   manpower: number
//   status: "planned" | "in-progress" | "completed"
//   uploadedImages: Array<{
//     _id?: string
//     date: Date
//     uploads: ImageFile[]
//   }>
// }

// interface ProjectAssignee {
//   projectName: string
//   siteAddress: string
//   designReferenceId: string
//   carpenterName: string
//   supervisorName: string
//   plannedStartDate: string
// }

// interface SupervisorCheck {
//   reviewerName: string
//   reviewerId: string
//   reviewDateTime: string
//   status: "approved" | "needs_changes" | "rejected" | ""
//   remarks: string
//   gatekeeping: "block" | "allow_with_watch"
// }

// interface FormData {
//   projectAssignee: ProjectAssignee
//   dailyTasks: DailyTask[]
//   designPlanImages: ImageFile[]
//   siteImages: ImageFile[]
//   supervisorCheck: SupervisorCheck
// }

// interface CreateDailyScheduleFormProps {
//   projectId: string
//   isOpen: boolean
//   onClose: () => void
//   editData?: any
//   onSave?: (data: FormData) => void
//   onUpdate?: (data: FormData) => void
// }




// // old data 



// // interface DailyScheduleWork {
// //   datePlanned: string;
// //   room: string;
// //   workDescription: string;
// //   startTime: string;      // e.g. "09:00"
// //   endTime: string;        // e.g. "17:30"
// //   materialsNeeded: string[];
// //   manpower: number;
// //   status: "planned" | "in-progress" | "completed";
// //   uploadedImages: IDailyTaskDate[],
// // }


// // interface ProjectAssignee {
// //   projectName: string;
// //   siteAddress: string;
// //   designReferenceId: string;
// //   carpenterName: string;   // could be ObjectId if linked
// //   supervisorName: string;  // could be ObjectId if linked
// //   plannedStartDate: Date;
// // }

// // interface ISupervisorCheck {
// //   reviewerName: string;
// //   reviewerId: string;
// //   reviewDateTime: Date;
// //   status: "approved" | "needs_changes" | "rejected" | "";
// //   remarks: string;
// //   gatekeeping: "block" | "allow_with_watch";
// // }

// // interface IComparisonImages {
// //   plannedImage: string | null;
// //   actualImage: string | null;
// // }

// // interface IDailyScheduleState {
// //   dailyTasks: DailyScheduleWork[];   // list of daily tasks
// //   projectAssignee: ProjectAssignee; // multiple assignees if needed
// //   supervisorCheck: ISupervisorCheck;
// //   designPlanImages: string[];
// //   siteImages: string[];
// //   comparison: IComparisonImages;
// // }


// //  end of old data 
// const CreateDailyScheduleForm: React.FC<CreateDailyScheduleFormProps> = ({
//   projectId,
//   isOpen,
//   onClose,
//   editData,
//   onSave,
//   onUpdate,
// }) => {
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const siteFileInputRef = useRef<HTMLInputElement>(null)
//   const taskImageInputRef = useRef<HTMLInputElement>(null)
//   const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null)

//   const [formData, setFormData] = useState<FormData>({
//     projectAssignee: {
//       projectName: editData?.projectAssignee?.projectName || "",
//       siteAddress: editData?.projectAssignee?.siteAddress || "",
//       designReferenceId: editData?.projectAssignee?.designReferenceId || "",
//       carpenterName: editData?.projectAssignee?.carpenterName || "",
//       supervisorName: editData?.projectAssignee?.supervisorName || "",
//       plannedStartDate: editData?.projectAssignee?.plannedStartDate || "",
//     },
//     dailyTasks: editData?.dailyTasks || [
//       {
//         datePlanned: "",
//         room: "",
//         workDescription: "",
//         startTime: "",
//         endTime: "",
//         materialsNeeded: [],
//         manpower: 0,
//         status: "planned",
//         uploadedImages: [],
//       },
//     ],
//     designPlanImages: editData?.designPlanImages || [],
//     siteImages: editData?.siteImages || [],
//     supervisorCheck: {
//       reviewerName: editData?.supervisorCheck?.reviewerName || "",
//       reviewerId: editData?.supervisorCheck?.reviewerId || "",
//       reviewDateTime: editData?.supervisorCheck?.reviewDateTime || "",
//       status: editData?.supervisorCheck?.status || "",
//       remarks: editData?.supervisorCheck?.remarks || "",
//       gatekeeping: editData?.supervisorCheck?.gatekeeping || "block",
//     },
//   })

//   const handleProjectAssigneeChange = (field: keyof ProjectAssignee, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       projectAssignee: {
//         ...prev.projectAssignee,
//         [field]: value,
//       },
//     }))
//   }

//   const handleTaskChange = (index: number, field: keyof DailyTask, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       dailyTasks: prev.dailyTasks.map((task, i) => (i === index ? { ...task, [field]: value } : task)),
//     }))
//   }

//   const addTask = () => {
//     setFormData((prev) => ({
//       ...prev,
//       dailyTasks: [
//         ...prev.dailyTasks,
//         {
//           datePlanned: "",
//           room: "",
//           workDescription: "",
//           startTime: "",
//           endTime: "",
//           materialsNeeded: [],
//           manpower: 0,
//           status: "planned",
//           uploadedImages: [],
//         },
//       ],
//     }))
//   }

//   const removeTask = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       dailyTasks: prev.dailyTasks.filter((_, i) => i !== index),
//     }))
//   }

//   const handleMaterialsChange = (index: number, materials: string) => {
//     const materialsArray = materials
//       .split(",")
//       .map((m) => m.trim())
//       .filter((m) => m)
//     handleTaskChange(index, "materialsNeeded", materialsArray)
//   }

//   const handleFileUpload = (files: FileList | null, type: "design" | "site" | "task") => {
//     if (!files) return

//     Array.from(files).forEach((file) => {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         const newImage: ImageFile = {
//           _id: Date.now().toString(),
//           fileType: "image",
//           url: e.target?.result as string,
//           originalName: file.name,
//           uploadedAt: new Date(),
//         }

//         if (type === "design") {
//           setFormData((prev) => ({
//             ...prev,
//             designPlanImages: [...prev.designPlanImages, newImage],
//           }))
//         } else if (type === "site") {
//           setFormData((prev) => ({
//             ...prev,
//             siteImages: [...prev.siteImages, newImage],
//           }))
//         } else if (type === "task" && selectedTaskIndex !== null) {
//           setFormData((prev) => ({
//             ...prev,
//             dailyTasks: prev.dailyTasks.map((task, i) =>
//               i === selectedTaskIndex
//                 ? {
//                     ...task,
//                     uploadedImages: [
//                       ...task.uploadedImages,
//                       {
//                         _id: Date.now().toString(),
//                         date: new Date(),
//                         uploads: [newImage],
//                       },
//                     ],
//                   }
//                 : task,
//             ),
//           }))
//         }
//       }
//       reader.readAsDataURL(file)
//     })
//   }

//   const handleDeleteImage = (imageId: string, type: "design" | "site" | "task", taskIndex?: number) => {
//     if (type === "design") {
//       setFormData((prev) => ({
//         ...prev,
//         designPlanImages: prev.designPlanImages.filter((img) => img._id !== imageId),
//       }))
//     } else if (type === "site") {
//       setFormData((prev) => ({
//         ...prev,
//         siteImages: prev.siteImages.filter((img) => img._id !== imageId),
//       }))
//     } else if (type === "task" && taskIndex !== undefined) {
//       setFormData((prev) => ({
//         ...prev,
//         dailyTasks: prev.dailyTasks.map((task, i) =>
//           i === taskIndex
//             ? {
//                 ...task,
//                 uploadedImages: task.uploadedImages.filter(
//                   (upload) => !upload.uploads.some((img) => img._id === imageId),
//                 ),
//               }
//             : task,
//         ),
//       }))
//     }
//   }

//   const handleSupervisorCheckChange = (field: keyof SupervisorCheck, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       supervisorCheck: {
//         ...prev.supervisorCheck,
//         [field]: value,
//       },
//     }))
//   }

//   const handleSave = () => {
//     if (editData) {
//       onUpdate?.(formData)
//     } else {
//       onSave?.(formData)
//     }
//     onClose()
//   }

//   const exportToJSON = () => {
//     const dataStr = JSON.stringify(formData, null, 2)
//     const dataBlob = new Blob([dataStr], { type: "application/json" })
//     const url = URL.createObjectURL(dataBlob)
//     const link = document.createElement("a")
//     link.href = url
//     link.download = `work-schedule-${Date.now()}.json`
//     link.click()
//     URL.revokeObjectURL(url)
//   }

//   const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     const reader = new FileReader()
//     reader.onload = (e) => {
//       try {
//         const importedData = JSON.parse(e.target?.result as string)
//         setFormData(importedData)
//       } catch (error) {
//         console.error("Error importing JSON:", error)
//       }
//     }
//     reader.readAsText(file)
//   }

//   const exportToPDF = () => {
//     // PDF export functionality would be implemented here
//     console.log("Exporting to PDF...")
//   }

//   return (
//     <main className="w-screen">
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-screen max-h-[90vh] overflow-y-auto">
//         <DialogHeader className="bg-blue-600 text-white p-4 -m-6 mb-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <DialogTitle className="text-xl font-bold">
//                 Vertical Living — Carpenter Work Schedule & Visual Approval
//               </DialogTitle>
//               <p className="text-sm opacity-90">
//                 RAMS TECH CIRCLE OPC Pvt. Ltd. • No. 22, 13th Main Road, Anna Nagar West, Chennai - 600040 • WhatsApp:
//                 +91 93639 93814
//               </p>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="secondary" size="sm" onClick={handleSave}>
//                 Save
//               </Button>
//               <Button variant="secondary" size="sm" onClick={() => document.getElementById("json-import")?.click()}>
//                 Load
//               </Button>
//               <Button variant="secondary" size="sm" onClick={exportToJSON}>
//                 Export JSON
//               </Button>
//               <input id="json-import" type="file" accept=".json" className="hidden" onChange={importFromJSON} />
//               <Button variant="secondary" size="sm" onClick={() => document.getElementById("json-import")?.click()}>
//                 Import JSON
//               </Button>
//               <Button variant="secondary" size="sm" onClick={exportToPDF}>
//                 Print / PDF
//               </Button>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Project & Assignee Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <i className="h-5 w-5 fas fa-box" />
//                 Project & Assignee
//                 <Button variant="link" size="sm" className="ml-auto text-blue-600">
//                   Single sheet for multiple days
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <Label htmlFor="projectName">Project Name</Label>
//                   <Input
//                     id="projectName"
//                     placeholder="e.g., Shankar Residence — Wardrobe & TV Unit"
//                     value={formData.projectAssignee.projectName}
//                     onChange={(e) => handleProjectAssigneeChange("projectName", e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="siteAddress">Site Address</Label>
//                   <Input
//                     id="siteAddress"
//                     placeholder="Full address"
//                     value={formData.projectAssignee.siteAddress}
//                     onChange={(e) => handleProjectAssigneeChange("siteAddress", e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="designReferenceId">Design Reference ID</Label>
//                   <Input
//                     id="designReferenceId"
//                     placeholder="e.g., VL-KTN-2025-001"
//                     value={formData.projectAssignee.designReferenceId}
//                     onChange={(e) => handleProjectAssigneeChange("designReferenceId", e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="carpenterName">Carpenter Name</Label>
//                   <Input
//                     id="carpenterName"
//                     placeholder="Assigned carpenter"
//                     value={formData.projectAssignee.carpenterName}
//                     onChange={(e) => handleProjectAssigneeChange("carpenterName", e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="supervisorName">Supervisor Name</Label>
//                   <Input
//                     id="supervisorName"
//                     placeholder="Site supervisor"
//                     value={formData.projectAssignee.supervisorName}
//                     onChange={(e) => handleProjectAssigneeChange("supervisorName", e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="plannedStartDate">Planned Start Date</Label>
//                   <Input
//                     id="plannedStartDate"
//                     type="date"
//                     value={formData.projectAssignee.plannedStartDate}
//                     onChange={(e) => handleProjectAssigneeChange("plannedStartDate", e.target.value)}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Daily Work Schedule Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <i className="fas fa-calender h-5 w-5" />
//                   Daily Work Schedule
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm" onClick={addTask}>
//                     <i className="fas fa-plus h-4 w-4 mr-1" />
//                     Add Task
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     Clear
//                   </Button>
//                 </div>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="border p-2 text-left">DATE</th>
//                       <th className="border p-2 text-left">ROOM / UNIT</th>
//                       <th className="border p-2 text-left">WORK DESCRIPTION</th>
//                       <th className="border p-2 text-left">START</th>
//                       <th className="border p-2 text-left">END</th>
//                       <th className="border p-2 text-left">MATERIALS NEEDED</th>
//                       <th className="border p-2 text-left">MANPOWER</th>
//                       <th className="border p-2 text-left">STATUS</th>
//                       <th className="border p-2 text-left">ACTIONS</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {formData.dailyTasks.map((task, index) => (
//                       <tr key={index}>
//                         <td className="border p-2">
//                           <Input
//                             type="date"
//                             value={task.datePlanned}
//                             onChange={(e) => handleTaskChange(index, "datePlanned", e.target.value)}
//                           />
//                         </td>
//                         <td className="border p-2">
//                           <Input
//                             placeholder="Kitchen"
//                             value={task.room}
//                             onChange={(e) => handleTaskChange(index, "room", e.target.value)}
//                           />
//                         </td>
//                         <td className="border p-2">
//                           <Textarea
//                             placeholder="Base unit carcass fixing & levelling"
//                             value={task.workDescription}
//                             onChange={(e) => handleTaskChange(index, "workDescription", e.target.value)}
//                             rows={2}
//                           />
//                         </td>
//                         <td className="border p-2">
//                           <Input
//                             type="time"
//                             value={task.startTime}
//                             onChange={(e) => handleTaskChange(index, "startTime", e.target.value)}
//                           />
//                         </td>
//                         <td className="border p-2">
//                           <Input
//                             type="time"
//                             value={task.endTime}
//                             onChange={(e) => handleTaskChange(index, "endTime", e.target.value)}
//                           />
//                         </td>
//                         <td className="border p-2">
//                           <Input
//                             placeholder="Plywood, laminate, screws"
//                             value={task.materialsNeeded.join(", ")}
//                             onChange={(e) => handleMaterialsChange(index, e.target.value)}
//                           />
//                         </td>
//                         <td className="border p-2">
//                           <Input
//                             type="number"
//                             placeholder="No of workers"
//                             value={task.manpower}
//                             onChange={(e) => handleTaskChange(index, "manpower", Number.parseInt(e.target.value) || 0)}
//                           />
//                         </td>
//                         <td className="border p-2">
//                           <Select
//                             value={task.status}
//                             onValueChange={(value) => handleTaskChange(index, "status", value)}
//                           >
//                             <SelectTrigger selectedValue={formData.dailyTasks[0]?.status || ""}>
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="planned">Planned</SelectItem>
//                               <SelectItem value="in-progress">In Progress</SelectItem>
//                               <SelectItem value="completed">Completed</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </td>
//                         <td className="border p-2">
//                           <div className="flex gap-1">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 setSelectedTaskIndex(index)
//                                 taskImageInputRef.current?.click()
//                               }}
//                             >
//                               <i className=" fas fa-upload h-3 w-3" />
//                             </Button>
//                             <Button variant="danger" size="sm" onClick={() => removeTask(index)}>
//                               <i className="fas fa-trash h-3 w-3" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Design Plan Images Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Laminate/Design/Plan Images — for Explanation</span>
//                 <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
//                   Upload reference plans, markups, sketches
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <div className="space-y-2">
//                   <p className="text-lg font-medium">Drag & drop plan/reference images here or</p>
//                   <Button variant="outline">Browse</Button>
//                   <p className="text-sm text-gray-500">Accepted: JPG/PNG/WebP • Images auto-saved locally</p>
//                 </div>
//               </div>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => handleFileUpload(e.target.files, "design")}
//               />
//               {formData.designPlanImages.length > 0 && (
//                 <div className="mt-4">
//                   <ImageGalleryExample
//                     imageFiles={formData.designPlanImages}
//                     handleDeleteFile={(id) => handleDeleteImage(id, "design")}
//                     height={120}
//                     minWidth={120}
//                     maxWidth={150}
//                   />
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Site Images Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Site / Actual Images — for Visual Confirmation</span>
//                 <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
//                   Upload daily progress photos
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
//                 onClick={() => siteFileInputRef.current?.click()}
//               >
//                 <div className="space-y-2">
//                   <p className="text-lg font-medium">Drag & drop site/progress images here or</p>
//                   <Button variant="outline">Browse</Button>
//                   <p className="text-sm text-gray-500">Tip: Upload clear, well-lit photos with unit labels in frame</p>
//                 </div>
//               </div>
//               <input
//                 ref={siteFileInputRef}
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => handleFileUpload(e.target.files, "site")}
//               />
//               {formData.siteImages.length > 0 && (
//                 <div className="mt-4">
//                   <ImageGalleryExample
//                     imageFiles={formData.siteImages}
//                     handleDeleteFile={(id) => handleDeleteImage(id, "site")}
//                     height={120}
//                     minWidth={120}
//                     maxWidth={150}
//                   />
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Supervisor Visual Check Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Supervisor Visual Check & Approval</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                   <span className="text-sm">Pending Review</span>
//                 </div>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <Label htmlFor="reviewerName">Reviewer Name</Label>
//                   <Input
//                     id="reviewerName"
//                     placeholder="Staff doing the check"
//                     value={formData.supervisorCheck.reviewerName}
//                     onChange={(e) => handleSupervisorCheckChange("reviewerName", e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="reviewDateTime">Review Date & Time</Label>
//                   <Input
//                     id="reviewDateTime"
//                     type="datetime-local"
//                     value={formData.supervisorCheck.reviewDateTime}
//                     onChange={(e) => handleSupervisorCheckChange("reviewDateTime", e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-4 mb-4">
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     id="pending"
//                     name="status"
//                     value=""
//                     checked={formData.supervisorCheck.status === ""}
//                     onChange={(e) => handleSupervisorCheckChange("status", e.target.value)}
//                   />
//                   <Label htmlFor="pending">Pending</Label>
//                 </div>
//                 <Button
//                   variant={formData.supervisorCheck.status === "approved" ? "primary" : "outline"}
//                   className="bg-green-500 hover:bg-green-600 text-white"
//                   onClick={() => handleSupervisorCheckChange("status", "approved")}
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   variant={formData.supervisorCheck.status === "needs_changes" ? "primary" : "outline"}
//                   className="bg-orange-500 hover:bg-orange-600 text-white"
//                   onClick={() => handleSupervisorCheckChange("status", "needs_changes")}
//                 >
//                   Changes Required
//                 </Button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="remarks">Remarks / Observations</Label>
//                   <Textarea
//                     id="remarks"
//                     placeholder="Note deviations, rework needed, or greenlight to proceed"
//                     value={formData.supervisorCheck.remarks}
//                     onChange={(e) => handleSupervisorCheckChange("remarks", e.target.value)}
//                     rows={3}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="gatekeeping">Gatekeeping (Workflow Interlock)</Label>
//                   <Select
//                     value={formData.supervisorCheck.gatekeeping}
//                     onValueChange={(value) => handleSupervisorCheckChange("gatekeeping", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="block">BLOCK work to start with Supervisor Watch</SelectItem>
//                       <SelectItem value="allow_with_watch">ALLOW work to start with Supervisor Watch</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Matches CRM philosophy used in Material Arrival stage — prevent next step until approval.
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Hidden file inputs */}
//         <input
//           ref={taskImageInputRef}
//           type="file"
//           multiple
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => handleFileUpload(e.target.files, "task")}
//         />
//       </DialogContent>
//     </Dialog>
//     </main>
//   )
// }

// export default CreateDailyScheduleForm


import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { Textarea } from "../../../components/ui/TextArea"
import { Label } from "../../../components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select"
// import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain"
import { useCreateCorrection, useCreateWork, useDeleteCorrectedImage, useGeneratePdfWorkSchedule, useGetProjectAssigneDetail, useUpdateSelectedImageComment, useUpdateWork, useUploadCorrectedImage } from "../../../apiList/Stage Api/workScheduleApi"
import { toast } from "../../../utils/toast"
import { downloadImage } from "../../../utils/downloadFile"
import { useCurrentSupervisor } from "../../../Hooks/useCurrentSupervisor"
// import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain"
// import { NO_IMAGE } from "../../../constants/constants"


interface ImageFile {

    fileType: "image" | "pdf"
    url: string
    originalName?: string

}

interface DailyTask {
    _id?: string
    datePlanned: string
    room: string
    workDescription: string
    startTime: string
    endTime: string
    materialsNeeded: string[]
    manpower: number
    status: "planned" | "in-progress" | "completed"
    uploadedImages: Array<{
        _id?: string
        date: Date
        uploads: ImageFile[]
    }>
}

interface ProjectAssignee {
    projectName: string
    siteAddress: string
    designReferenceId: string
    carpenterName: string
    supervisorName: string
    plannedStartDate: string
}

interface SupervisorCheck {
    reviewerName: string
    reviewerId: string
    reviewDateTime: string
    status: "approved" | "needs_changes" | "rejected" | ""
    remarks: string
    gatekeeping: "block" | "allow_with_watch"
}

interface IImage {
    fileType: string,
    url: string,
    _id?: string,
    orginalName: string
}


export interface ISelectedImgForCorrection {
    comment: string,
    createdBy: string,
    createModel: string,
    createdAt?: Date
    plannedImage: IImage
}

export interface IWorkComparison {
    _id?: string
    selectImage: ISelectedImgForCorrection[],
    correctedImages: IImage[]
}


interface FormData {
    projectAssignee: ProjectAssignee
    dailyTasks: DailyTask[]
    designPlanImages: any[]
    siteImages: any[]
    supervisorCheck: SupervisorCheck
}



interface CreateDailyScheduleFormProps {
    projectId: string
    isOpen: boolean
    onClose: () => void
    editData?: any
    onSave?: (data: FormData) => void
    onUpdate?: (data: FormData) => void
    scheduleId?: string | null
    refetch: () => any
}

const CreateDailyScheduleForm: React.FC<CreateDailyScheduleFormProps> = ({
    projectId,
    isOpen,
    onClose,
    editData,
    onSave,
    onUpdate,
    scheduleId = null,
    refetch,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const siteFileInputRef = useRef<HTMLInputElement>(null)
    // const [selectedTaskIndex, _setSelectedTaskIndex] = useState<number | null>(null)


    const currentUser = useCurrentSupervisor()
    const { data: projectAssigneData } = useGetProjectAssigneDetail(projectId)


    const [plannedImage, setPlannedImage] = useState({
        name: "",
        url: ""
    })
    const [actualImage, setActualImage] = useState({
        name: "",
        url: ""
    })
    const [plannedImageFile, setPlannedImageFile] = useState<File | null>(null);
    const [actualImageFile, setActualImageFile] = useState<File | null>(null);



    const [sliderPosition, setSliderPosition] = useState(50)
    const [isDragging, setIsDragging] = useState(false)

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    const formatDateTimeLocal = (date: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0");

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    // console.log("editData", editData)
    // const [formData, setFormData] = useState<FormData>({
    //     projectAssignee: {
    //         projectName: editData?.projectAssignee?.projectName || (projectAssigneData?.projectName ? projectAssigneData?.projectName : ""),
    //         siteAddress: editData?.projectAssignee?.siteAddress || (projectAssigneData?.siteAddress ? projectAssigneData?.siteAddress : ""),
    //         designReferenceId: editData?.projectAssignee?.designReferenceId || projectAssigneData?.designReferenceId ? projectAssigneData?.designReferenceId : "",
    //         carpenterName: editData?.projectAssignee?.carpenterName || "",
    //         supervisorName: editData?.projectAssignee?.supervisorName || (currentUser?.name ? currentUser?.name : ""),
    //         plannedStartDate: editData?.projectAssignee?.plannedStartDate || today,
    //     },
    //     dailyTasks: editData?.dailyTasks || [
    //         {
    //             datePlanned: "",
    //             room: "",
    //             workDescription: "",
    //             startTime: "",
    //             endTime: "",
    //             materialsNeeded: [],
    //             manpower: 0,
    //             status: "planned",
    //             uploadedImages: [],
    //         },
    //     ],
    //     designPlanImages: editData?.designPlanImages || [],
    //     siteImages: editData?.siteImages || [],
    //     supervisorCheck: {
    //         reviewerName: editData?.supervisorCheck?.reviewerName || (currentUser?.name ? currentUser?.name : ""),
    //         reviewerId: editData?.supervisorCheck?.reviewerId || (currentUser?.id ? currentUser?.id : ""),
    //         reviewDateTime: editData?.supervisorCheck?.reviewDateTime || formatDateTimeLocal(new Date()),
    //         status: editData?.supervisorCheck?.status || "needs_changes",
    //         remarks: editData?.supervisorCheck?.remarks || "",
    //         gatekeeping: editData?.supervisorCheck?.gatekeeping || "block",
    //     },
    // })


    const [formData, setFormData] = useState<FormData>({
        projectAssignee: {
            projectName: "",
            siteAddress: "",
            designReferenceId: "",
            carpenterName: "",
            supervisorName: currentUser?.name || "",
            plannedStartDate: today,
        },
        dailyTasks: [
            {
                datePlanned: "",
                room: "",
                workDescription: "",
                startTime: "",
                endTime: "",
                materialsNeeded: [],
                manpower: 0,
                status: "planned",
                uploadedImages: [],
            },
        ],
        designPlanImages: [],
        siteImages: [],

        supervisorCheck: {
            reviewerName: currentUser?.name || "",
            reviewerId: currentUser?.id || "",
            reviewDateTime: formatDateTimeLocal(new Date()),
            status: "needs_changes",
            remarks: "",
            gatekeeping: "block",
        },
    })

    const [correctionMode, setCorrectionMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState<any[]>([]);


    const [workComparion, setWorkComparions] = useState<IWorkComparison[] | any[]>([])




    // Populate formData when projectAssigneData or editData arrives
    useEffect(() => {
        if (!projectAssigneData && !editData) return;

        setFormData({
            projectAssignee: {
                projectName: editData?.projectAssignee?.projectName || projectAssigneData?.projectName || "",
                siteAddress: editData?.projectAssignee?.siteAddress || projectAssigneData?.siteAddress || "",
                designReferenceId: editData?.projectAssignee?.designReferenceId || projectAssigneData?.designReferenceId || "",
                carpenterName: editData?.projectAssignee?.carpenterName || "",
                supervisorName: editData?.projectAssignee?.supervisorName || currentUser?.name || "",
                plannedStartDate: editData?.projectAssignee?.plannedStartDate || today,
            },
            // dailyTasks: editData?.dailyTasks || [
            //     {
            //         datePlanned: "",
            //         room: "",
            //         workDescription: "",
            //         startTime: "",
            //         endTime: "",
            //         materialsNeeded: [],
            //         manpower: 0,
            //         status: "planned",
            //         uploadedImages: [],
            //     },
            // ],
            dailyTasks: editData?.dailyTasks?.map((task: any) => ({
                ...task,
                // Ensure uploadedImages is properly preserved
                uploadedImages: task.uploadedImages || []
            })) || [
                    {
                        datePlanned: "",
                        room: "",
                        workDescription: "",
                        startTime: "",
                        endTime: "",
                        materialsNeeded: [],
                        manpower: 0,
                        status: "planned",
                        uploadedImages: [],
                    },
                ],
            designPlanImages: editData?.designPlanImages || [],
            siteImages: editData?.siteImages || [],
            supervisorCheck: {
                reviewerName: editData?.supervisorCheck?.reviewerName || currentUser?.name || "",
                reviewerId: editData?.supervisorCheck?.reviewerId || currentUser?.id || "",
                reviewDateTime: editData?.supervisorCheck?.reviewDateTime || formatDateTimeLocal(new Date()),
                status: editData?.supervisorCheck?.status || "needs_changes",
                remarks: editData?.supervisorCheck?.remarks || "",
                gatekeeping: editData?.supervisorCheck?.gatekeeping || "block",
            },
        })



        if (editData?.dailyTasks) {
            const initialRawInputs: { [key: number]: string } = {};
            editData.dailyTasks.forEach((task: any, index: number) => {
                if (task.materialsNeeded && task.materialsNeeded.length > 0) {
                    initialRawInputs[index] = task.materialsNeeded.join(", ");
                }
            });
            setRawMaterialInputs(initialRawInputs);
        }


        // set workComparisons in its own state
        if (editData?.workComparison) {
            setWorkComparions(editData.workComparison);
        } else {
            setWorkComparions([]); // reset if none
        }


    }, [projectAssigneData, editData])


    const [designPlanFiles, setDesignPlanFiles] = useState<File[]>([]);
    const [siteImageFiles, setSiteImageFiles] = useState<File[]>([]);

    const createWorkMutation = useCreateWork()
    const updateWorkMutation = useUpdateWork()
    const { mutateAsync: generatePdf, isPending: pdfPending } = useGeneratePdfWorkSchedule()


    const handleProjectAssigneeChange = (field: keyof ProjectAssignee, value: string) => {
        setFormData((prev) => ({
            ...prev,
            projectAssignee: {
                ...prev.projectAssignee,
                [field]: value,
            },
        }))
    }


    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };


    const handleTaskChange = (index: number, field: keyof DailyTask, value: any) => {
        setFormData((prev) => ({
            ...prev,
            dailyTasks: prev.dailyTasks.map((task, i) => (i === index ? { ...task, [field]: value } : task)),
        }))
    }


    // Add this state to store raw input
    const [rawMaterialInputs, setRawMaterialInputs] = useState<{ [key: number]: string }>({});

    const handleMaterialsChange = (index: number, materials: string) => {
        // Store the raw input for display
        setRawMaterialInputs(prev => ({
            ...prev,
            [index]: materials
        }));

        // Process and store the array
        setFormData(prevData => ({
            ...prevData,
            dailyTasks: prevData.dailyTasks.map((task, i) =>
                i === index
                    ? {
                        ...task,
                        materialsNeeded: materials
                            .split(",")
                            .map((m) => m.trim())
                            .filter((m) => m)
                    }
                    : task
            )
        }));
    };


    const addTask = () => {
        setFormData((prev) => ({
            ...prev,
            dailyTasks: [
                ...prev.dailyTasks,
                {
                    datePlanned: "",
                    room: "",
                    workDescription: "",
                    startTime: "",
                    endTime: "",
                    materialsNeeded: [],
                    manpower: 0,
                    status: "planned",
                    uploadedImages: [],
                },
            ],
        }))
    }

    const allClearTask = () => {
        setFormData((prev) => ({
            ...prev,
            dailyTasks: [{
                datePlanned: "",
                room: "",
                workDescription: "",
                startTime: "",
                endTime: "",
                materialsNeeded: [],
                manpower: 0,
                status: "planned",
                uploadedImages: [],
            }],
        }))
    }

    const removeTask = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            dailyTasks: prev.dailyTasks.filter((_, i) => i !== index),
        }))
    }

    // const handleMaterialsChange = (index: number, materials: string) => {

    //     console.log("materials", materials)
    //     const materialsArray = materials
    //         .split(",")
    //         .map((m) => m.trim())
    //         .filter((m) => m)
    //         console.log("matieral array",materialsArray )
    //     handleTaskChange(index, "materialsNeeded", materialsArray)
    // }



    const handleSupervisorCheckChange = (field: keyof SupervisorCheck, value: string) => {
        setFormData((prev) => ({
            ...prev,
            supervisorCheck: {
                ...prev.supervisorCheck,
                [field]: value,
            },
        }))
    }


    const handleSave = async () => {
        try {
            if (editData) {

                const formDataToSend = new FormData();

                formDataToSend.append('projectAssignee', JSON.stringify(formData.projectAssignee));
                formDataToSend.append('dailyTasks', JSON.stringify(formData.dailyTasks));
                formDataToSend.append('supervisorCheck', JSON.stringify(formData.supervisorCheck));

                if (actualImageFile) formDataToSend.append('actualImage', actualImageFile);
                if (plannedImageFile) formDataToSend.append('plannedImage', plannedImageFile);


                designPlanFiles.forEach(file => formDataToSend.append('designPlanImages', file));
                siteImageFiles.forEach(file => formDataToSend.append('siteImages', file));




                await updateWorkMutation.mutateAsync({
                    projectId,
                    scheduleId: editData._id,
                    formData: formDataToSend,
                })
                onUpdate?.(formData)
                toast({ title: "Success", description: "updated successfully" })

            } else {


                const formDataToSend = new FormData();

                formDataToSend.append('projectAssignee', JSON.stringify(formData.projectAssignee));
                formDataToSend.append('dailyTasks', JSON.stringify(formData.dailyTasks));
                formDataToSend.append('supervisorCheck', JSON.stringify(formData.supervisorCheck));

                if (actualImageFile) formDataToSend.append('actualImage', actualImageFile);
                if (plannedImageFile) formDataToSend.append('plannedImage', plannedImageFile);


                designPlanFiles.forEach(file => formDataToSend.append('designPlanImages', file));
                siteImageFiles.forEach(file => formDataToSend.append('siteImages', file));


                console.log("first enteirng i")
                await createWorkMutation.mutateAsync({
                    projectId,
                    formData: formDataToSend,
                })
                refetch()
                onSave?.(formData)
                toast({ title: "Success", description: "Created successfully" })

            }
            onClose()
        } catch (error: any) {
            console.error("Error saving work schedule:", error)
            toast({ title: "Error", description: error?.response?.data?.message || "something went wrong", variant: "destructive" })

        }
    }


    const handleGeneratePdf = async () => {
        try {

            const formDataToSend = new FormData();

            formDataToSend.append('projectAssignee', JSON.stringify(formData.projectAssignee));
            formDataToSend.append('dailyTasks', JSON.stringify(formData.dailyTasks));
            formDataToSend.append('supervisorCheck', JSON.stringify(formData.supervisorCheck));

            if (actualImageFile) formDataToSend.append('actualImage', actualImageFile);
            if (plannedImageFile) formDataToSend.append('plannedImage', plannedImageFile);


            designPlanFiles.forEach(file => formDataToSend.append('designPlanImages', file));
            siteImageFiles.forEach(file => formDataToSend.append('siteImages', file));

            let data;

            if (editData) {
                data = await generatePdf({
                    projectId,
                    scheduleId: scheduleId,
                    formData: formDataToSend,
                })
            }
            else {
                data = await generatePdf({
                    projectId,
                    formData: formDataToSend,
                })

            }


            downloadImage({ src: data.downloadUrl, alt: data.fileName })
            toast({ description: 'Pdf Generated successfully', title: "Success" });
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to generate Pdf",
                variant: "destructive"
            });
        }
    }

    //     const handleFileUpload = (files: FileList | null, type: "design" | "site" | "task") => {
    //     if (!files) return

    //     // Array.from(files).forEach((_file:any) => {
    //     //   const reader = new FileReader()
    //     //   reader.onload = (e) => {
    //         // const newImage: ImageFile = {
    //         // //   _id: Date.now().toString(),
    //         //   fileType: "image",
    //         //   url: e.target?.result as string,
    //         //   originalName: file.name,
    //         // //   uploadedAt: new Date(),
    //         // }
    //   const fileArray = Array.from(files); // convert FileList to array

    //         if (type === "design") {
    //           setFormData((prev) => ({
    //             ...prev,
    //             designPlanImages: [...prev.designPlanImages, fileArray],
    //           }))
    //         } else if (type === "site") {
    //           setFormData((prev) => ({
    //             ...prev,
    //             siteImages: [...prev.siteImages, fileArray],
    //           }))
    //         } else if (type === "task" && selectedTaskIndex !== null) {
    //         //   setFormData((prev) => ({
    //         //     ...prev,
    //         //     dailyTasks: prev.dailyTasks.map((task, i) =>
    //         //       i === selectedTaskIndex
    //         //         ? {
    //         //             ...task,
    //         //             uploadedImages: [
    //         //               ...task.uploadedImages,
    //         //               {
    //         //                 _id: Date.now().toString(),
    //         //                 date: new Date(),
    //         //                 uploads: [newImage],
    //         //               },
    //         //             ],
    //         //           }
    //         //         : task,
    //         //     ),
    //         //   }))
    //         }
    //     //   }
    //     //   reader.readAsDataURL(file)
    //     // })
    //   }



    const handleFileUpload = (files: FileList | null, type: "design" | "site") => {
        if (!files) return;
        const fileArray = Array.from(files);

        if (type === "design") {
            const newImages = fileArray.map(file => ({
                file, // store the file for backend
                url: URL.createObjectURL(file), // preview URL
            }));
            setFormData(prev => ({
                ...prev,
                designPlanImages: [...prev.designPlanImages, ...newImages],
            }));
            setDesignPlanFiles(prev => [...prev, ...fileArray]);
        } else if (type === "site") {
            const newImages = fileArray.map(file => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setFormData(prev => ({
                ...prev,
                siteImages: [...prev.siteImages, ...newImages],
            }));
            setSiteImageFiles(prev => [...prev, ...fileArray]);
        }
    };


    const handleDeleteImage = (index: number, type: "design" | "site") => {
        if (type === "design") {
            setFormData(prev => ({
                ...prev,
                designPlanImages: prev.designPlanImages.filter((_, i) => i !== index),
            }));
            setDesignPlanFiles(prev => prev.filter((_, i) => i !== index));
        } else if (type === "site") {
            setFormData(prev => ({
                ...prev,
                siteImages: prev.siteImages.filter((_, i) => i !== index),
            }));
            setSiteImageFiles(prev => prev.filter((_, i) => i !== index));
        }
    };



    const exportToJSON = () => {
        const dataStr = JSON.stringify(formData, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `work-schedule-${Date.now()}.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string)
                setFormData(importedData)
            } catch (error) {
                console.error("Error importing JSON:", error)
            }
        }
        reader.readAsText(file)
    }



    //CORRECTION UPDLOADS
    const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempComment, setTempComment] = useState<Record<string, string>>({});

    const { mutateAsync: createCorrection, isPending } = useCreateCorrection();
    const { mutateAsync: uploadCorrectedImage, isPending: uploadcorrectPending } = useUploadCorrectedImage();
    const { mutateAsync: deleteCorrectedImage, isPending: deleteCorrectPending } = useDeleteCorrectedImage();
    const { mutateAsync: updateCommentSelectImage } = useUpdateSelectedImageComment();


    const toggleImageSelection = (image: any) => {
        if (!correctionMode) return; // only allow in correction mode
        setSelectedImages((prev) =>
            prev.includes(image)
                ? prev.filter((img) => img !== image)
                : [...prev, image]
        );
    };

    const handleUploadCorrection = async () => {
        try {
            if (selectedImages.length === 0) return;

            const imageData = selectedImages.map((img) => ({
                ...img, // follows your schema
                // comment: "", // initially blank, can be updated later
                // createdBy: "", // fill in from auth context if needed
                // createModel: "UserModel", // example
            }))

            const response = await createCorrection(
                { projectId, scheduleId: scheduleId!, formData: imageData },
            );

            setWorkComparions((prev: any) => ([...prev, response]));
            toast({ description: 'Pdf Generated successfully', title: "Success" });
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to generate Pdf",
                variant: "destructive"
            });
        }
    };



    const handleUploadCorrected = async (
        files: FileList | null,
        compId: string
    ) => {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await uploadCorrectedImage({
                projectId,
                scheduleId: scheduleId!,
                comparisonId: compId, // <- _id from the workComparison
                formData,
            });

            // 🔥 update local state with new corrected images
            setWorkComparions(response);
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to upload corrected images",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCorrected = async (compId: string, imageId: string) => {
        try {
            const response = await deleteCorrectedImage({
                projectId,
                scheduleId: scheduleId!,
                comparisonId: compId,
                imageId,
            });

            // 🔥 update local state after deletion
            setWorkComparions(response);

            toast({
                title: "Success",
                description: "Corrected image deleted successfully",
            });
        } catch (err: any) {
            console.error("Failed to delete corrected image:", err);
            toast({
                title: "Error",
                description: err?.message || "Failed to delete corrected image",
                variant: "destructive",
            });
        }
    };


    const handleChangeComment = (imageId: string, value: string) => {
        setTempComment((prev) => ({
            ...prev,
            [imageId]: value,
        }));
    };

    const handleUpdateComment = async (
        compId: string,
        imageId: string,
        comment: string
    ) => {
        try {
            const response = await updateCommentSelectImage({
                projectId,
                scheduleId: scheduleId!,
                comparisonId: compId,
                selectedImageId: imageId,
                data: { comment }
            });

            // 🔥 update local state after update
            setWorkComparions(response);
            setEditingId("")
            toast({
                title: "Success",
                description: "Comment updated successfully",
            });
        } catch (err: any) {
            console.error("Failed to update comment:", err);
            toast({
                title: "Error",
                description: err?.message || "Failed to update comment",
                variant: "destructive",
            });
        }
    };


    // DRAGGING 
    const handlePlannedImageUpload = (e: any) => {
        const file = e.target.files[0]
        if (file) {
            setPlannedImage({
                name: file.name,
                url: URL.createObjectURL(file),
            })
            setPlannedImageFile(file)
        }
    }

    const handleActualImageUpload = (e: any) => {
        const file = e.target.files[0]
        if (file) {
            setActualImage({
                name: file.name,
                url: URL.createObjectURL(file),
            })
            setActualImageFile(file)
        }
    }

    const handleSliderMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        e.preventDefault()
    }

    const handleSliderMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        setSliderPosition(percentage)
    }

    const handleSliderMouseUp = () => {
        setIsDragging(false)
    }

    const resetSlider = () => {
        setSliderPosition(50)
    }

    const removePlannedImage = () => {
        setPlannedImage({
            name: "",
            url: "",
        })
        setPlannedImageFile(null)
    }

    const removeActualImage = () => {
        setActualImage({
            name: "",
            url: "",
        })
        setActualImageFile(null)

    }



    const findSingleDailyStatus = (idx: number) => {
        const task = formData.dailyTasks.find((_task, index) => {
            return idx === index
        })
        return task?.status || "planned"
    }

    if (!isOpen) return null

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg max-w-7xl max-h-[90vh] overflow-y-auto w-full mx-4">
                <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Vertical Living — Carpenter Work Schedule & Visual Approval</h2>
                            <p className="text-sm opacity-90">
                                RAMS TECH CIRCLE OPC Pvt. Ltd. • No. 22, 13th Main Road, Anna Nagar West, Chennai - 600040 • WhatsApp:
                                +91 93639 93814
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={handleSave}>
                                Save
                            </Button>
                            {/* <Button variant="secondary" size="sm" onClick={() => document.getElementById("json-import")?.click()}>
                Load
              </Button> */}
                            <Button variant="secondary" size="sm" onClick={exportToJSON}>
                                Export JSON
                            </Button>
                            <input id="json-import" type="file" accept=".json" className="hidden" onChange={importFromJSON} />
                            <Button variant="secondary" size="sm" onClick={() => document.getElementById("json-import")?.click()}>
                                Import JSON
                            </Button>
                            <Button variant="secondary" isLoading={pdfPending} onClick={handleGeneratePdf} size="sm">
                                Print / PDF
                            </Button>
                            <Button variant="secondary" size="sm" onClick={onClose}>
                                <i className="fas fa-times"></i>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Project & Assignee Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <i className="fas fa-file-text"></i>
                                Project & Assignee
                                <Button variant="link" size="sm" className="ml-auto text-blue-600">
                                    Single sheet for multiple days
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="projectName">Project Name</Label>
                                    <Input
                                        id="projectName"
                                        placeholder="e.g., Shankar Residence — Wardrobe & TV Unit"
                                        value={formData.projectAssignee.projectName}
                                        onChange={(e) => handleProjectAssigneeChange("projectName", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="siteAddress">Site Address</Label>
                                    <Input
                                        id="siteAddress"
                                        placeholder="Full address"
                                        value={formData.projectAssignee.siteAddress}
                                        onChange={(e) => handleProjectAssigneeChange("siteAddress", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="designReferenceId">Design Reference ID</Label>
                                    <Input
                                        id="designReferenceId"
                                        placeholder="e.g., VL-KTN-2025-001"
                                        value={formData.projectAssignee.designReferenceId}
                                        onChange={(e) => handleProjectAssigneeChange("designReferenceId", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="carpenterName">Carpenter Name</Label>
                                    <Input
                                        id="carpenterName"
                                        placeholder="Assigned carpenter"
                                        value={formData.projectAssignee.carpenterName}
                                        onChange={(e) => handleProjectAssigneeChange("carpenterName", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="supervisorName">Supervisor Name</Label>
                                    <Input
                                        id="supervisorName"
                                        placeholder="Site supervisor"
                                        value={formData.projectAssignee.supervisorName}
                                        onChange={(e) => handleProjectAssigneeChange("supervisorName", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="plannedStartDate">Planned Start Date</Label>
                                    <Input
                                        id="plannedStartDate"
                                        type="date"
                                        value={formData.projectAssignee.plannedStartDate}
                                        onChange={(e) => handleProjectAssigneeChange("plannedStartDate", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily Work Schedule Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-calendar-days"></i>
                                    Daily Work Schedule
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={addTask}>
                                        <i className="fas fa-plus mr-1"></i>
                                        Add Task
                                    </Button>
                                    <Button variant="outline" onClick={allClearTask} size="sm">
                                        Clear
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-fit border overflow-y-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-2 text-center">DATE</th>
                                            <th className="border p-2 text-center">ROOM / UNIT</th>
                                            <th className="border p-2 text-center">WORK DESCRIPTION</th>
                                            <th className="border p-2 text-center">START</th>
                                            <th className="border p-2 text-center">END</th>
                                            <th className="border p-2 text-center">MATERIALS NEEDED</th>
                                            <th className="border p-2 text-center">MANPOWER</th>
                                            <th className="border p-2 text-center">STATUS</th>
                                            <th className="border p-2 text-center">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {formData.dailyTasks.map((task, index) => (
                                            <tr key={index}>
                                                <td className="border p-2">
                                                    <Input
                                                        type="date"
                                                        value={formatDateForInput(task.datePlanned)}
                                                        // value={task.datePlanned}
                                                        onChange={(e) => handleTaskChange(index, "datePlanned", e.target.value)}
                                                    />
                                                </td>
                                                <td className="border p-2">
                                                    <Input
                                                        placeholder="Kitchen"
                                                        value={task.room}
                                                        onChange={(e) => handleTaskChange(index, "room", e.target.value)}
                                                    />
                                                </td>
                                                <td className="border p-2">
                                                    <Textarea
                                                        placeholder="Base unit carcass fixing & levelling"
                                                        value={task.workDescription}
                                                        onChange={(e) => handleTaskChange(index, "workDescription", e.target.value)}
                                                        rows={2}
                                                    />
                                                </td>
                                                <td className="border p-2">
                                                    <Input
                                                        type="time"
                                                        value={task.startTime}
                                                        onChange={(e) => handleTaskChange(index, "startTime", e.target.value)}
                                                    />
                                                </td>
                                                <td className="border p-2">
                                                    <Input
                                                        type="time"
                                                        value={task.endTime}
                                                        onChange={(e) => handleTaskChange(index, "endTime", e.target.value)}
                                                    />
                                                </td>
                                                <td className="border p-2">
                                                    <Input
                                                        placeholder="Plywood, laminate, screws"
                                                        value={rawMaterialInputs[index] ?? ""}
                                                        onChange={(e) => handleMaterialsChange(index, e.target.value)}
                                                    />
                                                </td>
                                                <td className="border p-2">
                                                    <Input
                                                        type="number"
                                                        placeholder="No of workers"
                                                        value={task.manpower}
                                                        onChange={(e) => handleTaskChange(index, "manpower", Number.parseInt(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td className="border p-2">
                                                    <Select
                                                        value={task.status}
                                                        onValueChange={(value) => handleTaskChange(index, "status", value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue selectedValue={findSingleDailyStatus(index)} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="planned">Planned</SelectItem>
                                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                                            <SelectItem value="completed">Completed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="border p-2">
                                                    <div className="flex gap-1">
                                                        <Button variant="danger" size="sm" onClick={() => removeTask(index)}>
                                                            <i className="fas fa-trash"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Design Plan Images Section */}
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Laminate/Design/Plan Images — for Explanation</span>
                                <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
                                    Upload reference plans, markups, sketches
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="space-y-2">
                                    <p className="text-lg font-medium">Drag & drop plan/reference images here or</p>
                                    <Button variant="outline">Browse</Button>
                                    <p className="text-sm text-gray-500">Accepted: JPG/PNG/WebP • Images auto-saved locally</p>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e.target.files, "design")}
                            />
                            {formData.designPlanImages.length > 0 && (
                                <div className="mt-4">
                                    {/* <ImageGalleryExample
                                        imageFiles={formData.designPlanImages}
                                        handleDeleteFile={(id) => handleDeleteImage(id, "design")}
                                        height={120}
                                        minWidth={120}
                                        maxWidth={150}
                                    /> */}

                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {formData.designPlanImages.map((image, idx) => (
                                            <div key={idx} className="relative group w-32 h-32">
                                                {/* Image preview */}
                                                <img
                                                    src={image.url || ""}
                                                    alt={image.originalName || `Image ${idx + 1}`}
                                                    className="w-full h-full object-cover rounded-lg border shadow-sm"
                                                />

                                                {/* Delete button */}
                                                {!image._id && <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(idx, "design")}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-opacity"
                                                >
                                                    &times;
                                                </button>}
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Site Images Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Site / Actual Images — for Visual Confirmation</span>
                                <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
                                    Upload daily progress photos
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                                onClick={() => siteFileInputRef.current?.click()}
                            >
                                <div className="space-y-2">
                                    <p className="text-lg font-medium">Drag & drop site/progress images here or</p>
                                    <Button variant="outline">Browse</Button>
                                    <p className="text-sm text-gray-500">Tip: Upload clear, well-lit photos with unit labels in frame</p>
                                </div>
                            </div>
                            <input
                                ref={siteFileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e.target.files, "site")}
                            />

                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <input
                                        type="checkbox"
                                        id="correctionMode"
                                        checked={correctionMode}
                                        onChange={(e) => {
                                            setCorrectionMode(e.target.checked);
                                            if (!e.target.checked) setSelectedImages([]);
                                        }}
                                    />
                                    <label htmlFor="correctionMode" className="text-sm font-medium">
                                        Select images for correction
                                    </label>
                                    {correctionMode && (
                                        <Button
                                            size="sm"
                                            className="bg-green-600 text-white"
                                            disabled={selectedImages.length === 0 || isPending}
                                            onClick={handleUploadCorrection}
                                        >
                                            {isPending ? "Uploading..." : "Upload Selected"}
                                        </Button>
                                    )}
                                </div>

                            </div>
                            {formData.siteImages.length > 0 && (
                                <div className="mt-4">
                                    {/* <ImageGalleryExample
                                        imageFiles={formData.siteImages}
                                        handleDeleteFile={(id) => handleDeleteImage(id, "site")}
                                        height={120}
                                        minWidth={120}
                                        maxWidth={150}
                                    /> */}



                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {formData.siteImages.map((image, idx) => {
                                            const isSelected = selectedImages.includes(image);
                                            return (
                                                <div key={idx} className="relative group w-32 h-32">
                                                    {/* Image preview */}
                                                    <img
                                                        onClick={() => toggleImageSelection(image)}
                                                        src={image.url || ""}
                                                        alt={image.originalName || `Image ${idx + 1}`}
                                                        className="w-full h-full object-cover rounded-lg border shadow-sm"
                                                    />

                                                    {/* Tick Mark */}
                                                    {isSelected && (
                                                        <i className="fa fa-check absolute top-1 right-1 text-green-600 bg-white rounded-full p-1 shadow-md"></i>
                                                    )}

                                                    {/* Delete button */}
                                                    {!correctionMode && <button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(idx, "site")}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-opacity"
                                                    >
                                                        &times;
                                                    </button>}
                                                </div>
                                            )
                                        }
                                        )}
                                    </div>

                                </div>
                            )}
                        </CardContent>
                    </Card>

{/* OLd version */}
                    {/* <Card>

                        <CardContent>
                            {workComparion?.length > 0 ?
                                <>
                                    {workComparion?.map((comp: IWorkComparison, compIdx: number) => (
                                        comp.selectImage.length > 0 && (
                                            <>
                                                <div key={comp._id || compIdx} className="mt-6">
                                                    <h3 className="text-md font-semibold mb-2">
                                                        Selected Images for Correction
                                                    </h3>
                                                    <div className="flex flex-wrap gap-4">
                                                        {comp.selectImage.map((img: ISelectedImgForCorrection, idx: number) => (
                                                            <div key={(img as any)._id || idx}
                                                                className="relative w-32 h-32 border rounded-lg shadow-sm">
                                                                <img
                                                                    src={img?.plannedImage?.url}
                                                                    alt={`Correction ${idx + 1}`}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />


                                                                
                                                                <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs p-1 flex items-center">
                                                                    {editingId === (img as any)._id ? (
                                                                        <Input
                                                                            autoFocus
                                                                            value={tempComment[(img as any)._id] || ""}
                                                                            onChange={(e) => handleChangeComment((img as any)._id, e.target.value)}
                                                                            onBlur={() =>
                                                                                handleUpdateComment(
                                                                                    comp._id!,
                                                                                    (img as any)._id,
                                                                                    tempComment[(img as any)._id] || ""
                                                                                )
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === "Enter") {
                                                                                    e.preventDefault();
                                                                                    handleUpdateComment(
                                                                                        comp._id!,
                                                                                        (img as any)._id,
                                                                                        tempComment[(img as any)._id] || ""
                                                                                    );
                                                                                }
                                                                            }}
                                                                            className="text-xs py-1 px-2 h-6"
                                                                        />

                                                                    ) : (
                                                                        <span
                                                                            onClick={() => {
                                                                                setEditingId((img as any)._id);
                                                                                setTempComment(p => ({ ...p, [(img as any)._id]: img.comment }));
                                                                            }}
                                                                            className="cursor-pointer truncate hover:underline"
                                                                        >
                                                                            {img.comment || "💬 Add comment"}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                               
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            className=" border-2 w-full"
                                                            onChange={(e) => handleUploadCorrected(e.target.files, comp._id!)}
                                                        />
                                                        {uploadcorrectPending && <span className="animate-spin fas fa-spinner"></span>}

                                                    </div>
                                                    {comp?.correctedImages?.length > 0 ?
                                                        <>
                                                            <div key={comp._id || compIdx} className="mt-6">

                                                                <h3 className="text-md font-semibold mb-2">
                                                                    Refactored Images
                                                                </h3>
                                                                <div className="flex flex-wrap gap-4">
                                                                    {comp.correctedImages.map((img: IImage, idx: number) => (
                                                                        <div key={img._id}
                                                                            className="relative group w-32 h-32 border rounded-lg shadow-sm">
                                                                            <img
                                                                                src={img.url}
                                                                                alt={`Correction ${idx + 1}`}
                                                                                className="w-full h-full object-cover rounded-lg"
                                                                            />

                                                                            <Button
                                                                                variant="danger"
                                                                                size="sm"
                                                                                isLoading={deleteCorrectPending}
                                                                                className="absolute bg-red-600 text-white top-1 right-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full "
                                                                                onClick={() => handleDeleteCorrected(comp._id!, img._id!)}
                                                                            >
                                                                                <i className="w-4 h-4 fas fa-trash" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </> : <>
                                                            <div>
                                                                no Corrected images uploaded so far
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                            </>
                                        )
                                    ))}
                                </>
                                : <>
                                    <div className="h-20 w-full flex items-center justify-center">
                                        No Corrections has been assigned
                                    </div>
                                </>
                            }
                        </CardContent>
                    </Card> */}


                    <Card>
                        <CardHeader>
                            <CardTitle className="">Correction Section</CardTitle>
                        </CardHeader>
                        <CardContent>



                            {workComparion && workComparion.length > 0 ? (
                                <>
                                    {workComparion.map((comp: IWorkComparison, compIdx: number) => (
                                        <div key={comp._id || compIdx} className=" border-b pb-6 last:border-b-0">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Left: Selected Images */}
                                                <div className="md:w-1/2 w-full">
                                                    <h3 className="text-md font-semibold mb-2">
                                                        Stage {compIdx + 1}: Selected Images for Correction
                                                    </h3>
                                                    {comp.selectImage && comp.selectImage.length > 0 ? (
                                                        <div className="flex flex-wrap gap-4">
                                                            {comp.selectImage.map((img: ISelectedImgForCorrection, idx: number) => (
                                                                <div
                                                                    key={(img as any)._id || idx}
                                                                    className="w-32 sm:w-36 flex-shrink-0"
                                                                >
                                                                    <div className="w-full h-32 sm:h-36 border rounded-lg overflow-hidden shadow-sm mb-2">
                                                                        <img
                                                                            src={img?.plannedImage?.url || ""}
                                                                            alt={`Selected ${idx + 1}`}
                                                                            className="w-full h-full object-cover rounded-lg"
                                                                        />
                                                                    </div>

                                                                    {/* Comments outside the image */}
                                                                    <div
                                                                        className="text-sm border border-gray-200 rounded px-2 py-1 bg-gray-50 max-h-40 overflow-y-auto custom-scrollbar"
                                                                        onMouseEnter={() => setHoveredCommentId((img as any)._id)}
                                                                        onMouseLeave={() => setHoveredCommentId(null)}
                                                                    >
                                                                        {editingId === (img as any)._id ? (
                                                                            <Input
                                                                                autoFocus
                                                                                value={tempComment[(img as any)._id] || ""}
                                                                                onChange={(e) =>
                                                                                    handleChangeComment((img as any)._id, e.target.value)
                                                                                }
                                                                                onBlur={() =>
                                                                                    handleUpdateComment(
                                                                                        comp._id!,
                                                                                        (img as any)._id,
                                                                                        tempComment[(img as any)._id] || ""
                                                                                    )
                                                                                }
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === "Enter") {
                                                                                        e.preventDefault();
                                                                                        handleUpdateComment(
                                                                                            comp._id!,
                                                                                            (img as any)._id,
                                                                                            tempComment[(img as any)._id] || ""
                                                                                        );
                                                                                    }
                                                                                }}
                                                                                className="text-sm w-full border p-1 rounded resize-none"
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                onClick={() => {
                                                                                    setEditingId((img as any)._id);
                                                                                    setTempComment((prev) => ({
                                                                                        ...prev,
                                                                                        [(img as any)._id]: img.comment,
                                                                                    }));
                                                                                }}
                                                                                className="cursor-pointer break-words hover:bg-gray-100 p-1 rounded"
                                                                            >
                                                                                <div className="flex items-start gap-2">
                                                                                    <i className="fas fa-comment text-gray-500 mt-1" />
                                                                                    <p className="whitespace-pre-wrap break-words text-gray-800 text-sm">
                                                                                        {img.comment || (
                                                                                            <span className="italic text-gray-500">Add a comment</span>
                                                                                        )}
                                                                                    </p>
                                                                                    {hoveredCommentId === (img as any)._id && (
                                                                                        <i className="fas fa-pen ml-auto text-gray-400 text-xs mt-1" />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-500">
                                                            No selected images available for this comparison.
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right: Refactored Images + Upload first */}
                                                <div className="md:w-1/2 w-full flex flex-col justify-between">
                                                    <div>
                                                        {/* Upload input comes first */}
                                                        <div className="mb-4">
                                                            <label className="text-sm font-medium block mb-2">
                                                                Upload Refactored Images (Stage {compIdx + 1})
                                                            </label>

                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                className="border-2 border-dashed rounded-md p-2 w-full text-sm text-gray-600"
                                                                onChange={(e) =>
                                                                    handleUploadCorrected(e.target.files, comp._id!)
                                                                }
                                                            />
                                                            {uploadcorrectPending && (
                                                                <span className="ml-2 text-gray-600 animate-spin">
                                                                    <i className="fas fa-spinner animate-spin" />
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Refactored images */}
                                                        <div>
                                                            <h3 className="text-md font-semibold mb-2">
                                                                Stage {compIdx + 1}: Refactored Outputs
                                                            </h3>

                                                            {comp.correctedImages && comp.correctedImages.length > 0 ? (
                                                                <div className="flex flex-wrap gap-4">
                                                                    {comp.correctedImages.map((img: IImage, idx: number) => (
                                                                        <div
                                                                            key={img._id}
                                                                            className="relative group w-32 h-32 sm:w-36 sm:h-36 border rounded-lg shadow-sm overflow-hidden"
                                                                        >
                                                                            <img
                                                                                src={img.url}
                                                                                alt={`Refactored ${idx + 1}`}
                                                                                className="w-full h-full object-cover rounded-lg"
                                                                            />
                                                                            <Button
                                                                                variant="danger"
                                                                                size="sm"
                                                                                isLoading={deleteCorrectPending}
                                                                                className="absolute bg-red-600 text-white top-1 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 rounded-full"
                                                                                onClick={() =>
                                                                                    handleDeleteCorrected(comp._id!, img._id!)
                                                                                }
                                                                            >
                                                                                <i className="w-4 h-4 fas fa-trash" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-500">
                                                                    No refactored images uploaded yet.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="w-full px-6 py-8 flex justify-center">
  <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 max-w-full w-full text-sm text-gray-800 shadow-sm mx-auto flex justify-center">
    <div className="">
 <div className="flex items-start gap-2 mb-3">
      <i className="fas fa-info-circle mt-1 text-gray-500" />
      <p className="font-semibold">No corrections have been assigned.</p>
    </div>

    <p className="mb-2">To upload images for correction:</p>
    <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
      <li>Select checkbox in the <strong>Site/Actual Images</strong></li>
      <li>Click on the images that you need to upload for correction</li>
      <li>Click the <strong>"Upload Selected"</strong> button to upload</li>
    </ul>
    </div>
   
  </div>
</div>
                            )}
                        </CardContent>
                    </Card>



                    <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Planned vs Actual — Slider Comparison</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => document.getElementById("planned-image")?.click()}
                                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                                >
                                    Pick Planned
                                </button>
                                <button
                                    onClick={() => document.getElementById("actual-image")?.click()}
                                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                                >
                                    Pick Actual
                                </button>
                                <button onClick={resetSlider} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Image Comparison Container */}
                        <div className="relative w-[100%] h-96 bg-gray-100 rounded-lg overflow-hidden border">
                            {plannedImage.url || actualImage.url ? (
                                <div
                                    className="relative w-full h-full cursor-col-resize"
                                    onMouseMove={handleSliderMouseMove}
                                    onMouseUp={handleSliderMouseUp}
                                    onMouseLeave={handleSliderMouseUp}
                                >
                                    {/* Planned Image (Left Side) */}
                                    {plannedImage.url && (
                                        <div
                                            className="absolute top-0 left-0 h-full overflow-visible"
                                            style={{ width: `${sliderPosition}%` }}
                                        >
                                            {/* <img
                                                src={plannedImage.url || "/placeholder.svg"}
                                                alt="Planned"
                                                className="h-full object-cover"
                                                style={{
                                                    width: "100%", // Fixed width to prevent scaling
                                                    maxWidth: "none", // Allow image to extend beyond container
                                                }}
                                            /> */}


                                            <img
                                                src={plannedImage.url}
                                                alt="plannedimage"
                                                className="absolute top-0 left-0 w-[100%] h-[100%] object-cover"
                                                // style={{
                                                //     clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` // reveal left portion only
                                                // }}
                                                style={{ clipPath: "inset(0px 0% 0px 0px)" }}
                                            />

                                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                                                Planned
                                            </div>
                                            <button
                                                onClick={removePlannedImage}
                                                className="absolute top-2 left-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    )}

                                    {/* Actual Image (Right Side) */}
                                    {actualImage.url && (
                                        <div
                                            className="absolute top-0 right-0 h-full overflow-hidden"
                                            style={{ width: `${100 - sliderPosition}%` }}
                                        >
                                            <img
                                                src={actualImage.url || "/placeholder.svg"}
                                                alt="Actual"
                                                className="h-full object-cover"
                                                style={{
                                                    width: "100%", // Fixed width to prevent scaling
                                                    maxWidth: "none", // Allow image to extend beyond container
                                                }}
                                            />


                                            {/* <img
                                                src={actualImage.url}
                                                alt="actualimage"
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                                style={{
                                                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` // reveal left portion only
                                                }}
                                            /> */}

                                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                                                Actual
                                            </div>
                                            <button
                                                onClick={removeActualImage}
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    )}

                                    {/* Slider Handle */}
                                    <div
                                        className="absolute top-0 h-full w-1 bg-white shadow-lg cursor-col-resize z-10"
                                        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                                    >
                                        <div
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 cursor-col-resize flex items-center justify-center"
                                            onMouseDown={handleSliderMouseDown}
                                        >
                                            <i className="fas fa-arrows-alt-h text-gray-600 text-xs"></i>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <i className="fas fa-images text-4xl mb-4"></i>
                                        <p className="text-lg">Upload planned and actual images to compare</p>
                                        <p className="text-sm">Use the buttons above to select images</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mt-2 text-center">Drag the circle to reveal differences</p>

                        {/* Hidden file inputs */}
                        <input
                            id="planned-image"
                            type="file"
                            accept="image/*"
                            onChange={handlePlannedImageUpload}
                            className="hidden"
                        />
                        <input
                            id="actual-image"
                            type="file"
                            accept="image/*"
                            onChange={handleActualImageUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Supervisor Visual Check Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Supervisor Visual Check & Approval</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span className="text-sm">Pending Review</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Label htmlFor="reviewerName">Reviewer Name</Label>
                                    <Input
                                        id="reviewerName"
                                        placeholder="Staff doing the check"
                                        value={formData.supervisorCheck.reviewerName}
                                        onChange={(e) => handleSupervisorCheckChange("reviewerName", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="reviewDateTime">Review Date & Time</Label>
                                    <Input
                                        id="reviewDateTime"
                                        type="datetime-local"
                                        value={formData.supervisorCheck.reviewDateTime}
                                        onChange={(e) => handleSupervisorCheckChange("reviewDateTime", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="pending"
                                        name="status"
                                        value=""
                                        checked={formData.supervisorCheck.status === ""}
                                        onChange={(e) => handleSupervisorCheckChange("status", e.target.value)}
                                    />
                                    <Label htmlFor="pending">Pending</Label>
                                </div>
                                <Button
                                    variant={formData.supervisorCheck.status === "approved" ? "primary" : "outline"}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => handleSupervisorCheckChange("status", "approved")}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant={formData.supervisorCheck.status === "needs_changes" ? "primary" : "outline"}
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={() => handleSupervisorCheckChange("status", "needs_changes")}
                                >
                                    Changes Required
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="remarks">Remarks / Observations</Label>
                                    <Textarea
                                        id="remarks"
                                        placeholder="Note deviations, rework needed, or greenlight to proceed"
                                        value={formData.supervisorCheck.remarks}
                                        onChange={(e) => handleSupervisorCheckChange("remarks", e.target.value)}
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="gatekeeping">Gatekeeping (Workflow Interlock)</Label>
                                    <Select
                                        value={formData.supervisorCheck.gatekeeping}
                                        onValueChange={(value) => handleSupervisorCheckChange("gatekeeping", value)}
                                    >
                                        <SelectTrigger selectedValue={formData.supervisorCheck.gatekeeping}>
                                            <SelectValue selectedValue={formData.supervisorCheck.gatekeeping === "block" ? "BLOCK work to start with Supervisor Watch"
                                                : "ALLOW work to start with Supervisor Watch"



                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="block">BLOCK work to start with Supervisor Watch</SelectItem>
                                            <SelectItem value="allow_with_watch">ALLOW work to start with Supervisor Watch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Matches CRM philosophy used in Material Arrival stage — prevent next step until approval.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CreateDailyScheduleForm
