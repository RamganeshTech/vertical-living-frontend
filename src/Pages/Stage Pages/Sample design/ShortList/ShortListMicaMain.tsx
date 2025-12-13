// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "../../../../utils/toast";
// import { downloadImage } from "../../../../utils/downloadFile";
// import MaterialOverviewLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { Button } from "../../../../components/ui/Button";
// import ShortListPdfList from "./ShortListPdfList";
// import axios from "axios";
// import SmartTagInput from "../../../../shared/SmartTagInput";
// import { ShortListImageMicaGallery, type DetectedArea } from "../../../../shared/ImageGallery/ShortListMicaGallery";
// import { useGetMicaAllSiteImages, useGetMicaReferenceDesign, useUploadMicaShortlistedDesigns } from "../../../../apiList/Stage Api/shortListMicaApi";

// interface ImageFile {
//   _id: string;
//   url: string;
//   originalName?: string;
//   type?: string;
//   uploadedAt?: Date;
// }

// interface RoomShortlist {
//   siteImage: ImageFile;
//   referenceImages: ImageFile[];
// }



// export const fetchSuggestions = (query: string) =>
//   axios
//     .get(
//       `${import.meta.env.VITE_API_URL}/api/detection/getsuggestedtags?q=${encodeURIComponent(
//         query
//       )}`
//     )
//     .then((res) => {
//       if (Array.isArray(res?.data?.tags)) {
//         return res.data.tags;
//       }
//       return [];
//     })




// export default function ShortlistMicaMain() {
//   const { projectId, organizationId } = useParams() as {
//     projectId: string;
//     organizationId: string;
//   };
//   const [activePopupType, setActivePopupType] = useState<"reference" | "site" | null>(null);
//   const navigate = useNavigate()

//   const { data: siteImages = [], isLoading: isLoadingSite } = useGetMicaAllSiteImages(projectId);
//   // const { data, isLoading: isLoadingRefs } = useGetReferenceDesigns({ organizationId });

//   const [selectedSiteImage, setSelectedSiteImage] = useState<ImageFile | null>(null); // for selecting ref images
//   const [tempReferenceImages, setTempReferenceImages] = useState<ImageFile[]>([]);
//   const [currentMicaImage, setCurrentMicaImage] = useState<ImageFile | null>(null);
//   // The reference images should only contain pure mica material textures/patterns without any objects.
//   const [selectedAreas, setSelectedAreas] = useState<DetectedArea[]>([]);
//   const handleAreasSelected = (areas: DetectedArea[]) => {
//     setSelectedAreas(areas);
//   };
//   const [isSitePopupOpen, setIsSitePopupOpen] = useState(false);
//   const [isReferencePopupOpen, setIsReferencePopupOpen] = useState(false);

//   const [tags, setTags] = useState<string[]>([]); // by default show general images
//   // const [allSuggestions, setAllSuggestions] = useState<string[]>([]);



//   const {
//     data,
//     isLoading: isLoadingRefs,
//   } = useGetMicaReferenceDesign(organizationId, tags);


//   useEffect(() => {
//     setSelectedSiteImage(null);
//     setTempReferenceImages([]);
//     setActivePopupType(null)
//     setCurrentMicaImage(null); // Reset current mica when data changes
//     // setDetectedAreas([]); // Reset detected areas 
//     setIsReferencePopupOpen(false)
//     setIsSitePopupOpen(false)
//   }, [data])


//   const [selections, setSelections] = useState<RoomShortlist[]>([]);

//   const { mutateAsync: uploadDesigns, isPending: isGenerating } = useUploadMicaShortlistedDesigns();


//   useEffect(() => {
//     const eitherOpen = isSitePopupOpen || isReferencePopupOpen;
//     document.body.style.overflow = eitherOpen ? 'hidden' : 'unset';

//     return () => {
//       document.body.style.overflow = 'unset'; // Safety fallback
//     };
//   }, [isSitePopupOpen, isReferencePopupOpen]);


//   // NEW: Handle mica image click to set as current for real-time application
//   const handleMicaImageClick = (micaImage: ImageFile) => {
//     setCurrentMicaImage(micaImage);
//     toast({ title: "Mica Selected", description: "Mica material applied to site image" });
//   };

//   // NEW: Handle detection completion
//   const handleDetectionComplete = (areas: DetectedArea[]) => {
//     // setDetectedAreas(areas);
//     console.log('Detection completed:', areas);
//   };

//   const handleConfirmSiteImage = (e: any, image: ImageFile) => {
//     e.stopPropagation();
//     // setSelectedSiteImage(image);

//     setSelectedSiteImage((currentSelected) => {
//       // if same image is already selected, deselect it (toggle off)
//       if (currentSelected?._id === image._id) {
//         toast({ title: "Success", description: "Unselected, You can now select another one." });
//         return null;
//       }

//       toast({ title: "Success", description: "Site Image selected" });
//       return image;
//     });
//   };

//   const handleToggleReferenceImage = (refImage: ImageFile, shouldSelect: boolean) => {
//     // if (!selectedSiteImage) {
//     //   toast({ title: "Error", description: "Please select a Site Image first", variant: "destructive" });
//     //   return;
//     // }

//     // setTempReferenceImages((prev) => {
//     //   const exists = prev.some((r) => r._id === refImage._id);

//     //   if (shouldSelect && !exists) {
//     //     return [...prev, refImage];
//     //   } else if (!shouldSelect) {
//     //     return prev.filter((r) => r._id !== refImage._id);
//     //   }

//     //   return prev;
//     // });


//     if (!selectedSiteImage) {
//       toast({ title: "Error", description: "Please select a Site Image first", variant: "destructive" });
//       return;
//     }

//     setTempReferenceImages((prev) => {
//       const exists = prev.some((r) => r._id === refImage._id);

//       if (shouldSelect && !exists) {
//         // Set this as the current mica image when selected
//         setCurrentMicaImage(refImage);
//         return [...prev, refImage];
//       } else if (!shouldSelect) {
//         // If deselecting the current mica, clear it
//         if (currentMicaImage?._id === refImage._id) {
//           setCurrentMicaImage(null);
//         }
//         return prev.filter((r) => r._id !== refImage._id);
//       }

//       return prev;
//     });
//   };

//   // ✅ Remove reference image
//   const handleRemoveReference = (siteId: string, refId: string) => {
//     setSelections((prev) =>
//       prev
//         .map((s) =>
//           s.siteImage._id === siteId
//             ? { ...s, referenceImages: s.referenceImages.filter((r) => r._id !== refId) }
//             : s
//         )
//         .filter((s) => s.referenceImages.length > 0)
//     );
//   };

//   // ✅ Remove entire siteImage + refs
//   const handleRemoveSite = (siteId: string) => {
//     setSelections((prev) => prev.filter((s) => s.siteImage._id !== siteId));
//   };

//   // ✅ Generate Designs
//   const handleGenerate = async () => {
//     if (selections.length === 0) {
//       toast({ title: "Error", description: "No selections to generate", variant: "destructive" });
//       return;
//     }

//     try {
//       const res = await uploadDesigns({ projectId, selections });
//       downloadImage({ src: res.url, alt: res.fileName })
//       toast({ title: "Sucess", description: "Designs Generated Successfully!" });
//       setSelections([])
//     } catch (error: any) {
//       toast({ title: "Error", description: error?.message, variant: "destructive" });
//     }
//   };





//   // console.log("data", data)
//   return (
//     <div className="max-w-full overflow-y-auto max-h-full px-4 mx-auto py-2">
//       <header className="flex gap-2 items-center justify-between">
//         <div className="flex gap-2 items-center">
//           <div
//             onClick={() => navigate(-1)}
//             className="flex bg-gray-200 h-fit rounded-full items-center gap-2 backdrop-blur-sm px-4 py-2 cursor-pointer"
//           >
//             <i className="fas fa-arrow-left text-sm"></i>
//             <span className="text-sm hidden sm:inline-block font-medium">Back</span>
//           </div>
//           <div>
//             <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">Shortlisting Mica Designs</h1>
//             <p className="text-gray-600 hidden sm:inline-block text-sm md:text-md">
//               Select and organize your favorite design references for easy access
//             </p>
//           </div>
//         </div>


//         {(selectedSiteImage || tempReferenceImages.length > 0) && <button
//           className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
//           onClick={() => {
//             if (!selectedSiteImage || tempReferenceImages.length === 0) {
//               toast({ title: "Error", description: "Select site image & at least 1 reference", variant: "destructive" });
//               return;
//             }

//             setSelections((prev) => {
//               // Remove duplicate entry for this site (if exists)
//               const filtered = prev.filter(
//                 (sel) => sel.siteImage._id !== selectedSiteImage._id
//               );

//               return [
//                 ...filtered,
//                 {
//                   siteImage: selectedSiteImage,
//                   referenceImages: tempReferenceImages,
//                 },
//               ];
//             });
//             // Reset temp state
//             setSelectedSiteImage(null);
//             setTempReferenceImages([]);
//           }}
//         >
//           Confirm Selection
//         </button>}
//       </header>
//       <hr className="my-3 bg-gray-500" />

//       <div className="mb-4 flex gap-4 w-full  items-end">
//         <div className="flex flex-1 flex-col">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Categories</label>
//           {/* <TagInput tags={tags} setState={setTags} /> */}

//           <SmartTagInput
//             tags={tags}
//             setState={setTags}
//             suggestionFetcher={fetchSuggestions}
//           />

//           {/* <SmartTagInput tags={tags} setState={setTags} disableSuggestion /> */}
//         </div>

//         <div>
//           <Button
//             variant="outline"
//             onClick={() => setTags([])}
//             className="text-sm ml-2 flex"
//           >
//             Reset Filter
//           </Button>
//         </div>
//       </div>



//       <div className="grid md:grid-cols-2 gap-8 border-gray-300 border-2 rounded-2xl p-2">
//         {/* ➕ Reference Designs */}
//         <div className="border-r-1 border-gray-300 pr-8">
//           <h2 className="font-semibold text-lg mb-2">Reference Designs</h2>
//           <div className="my-3 w-full h-[1px] bg-gray-200" />

//           {isLoadingRefs ? (
//             <div><MaterialOverviewLoading /></div>
//           ) : (
//             <div className="relative  h-[80vh]" id="reference-popup-container">
//               {data?.length > 0 ?
//                 // <ShortListImageMicaGallery
//                 //   images={data || []}
//                 //   portalId={"reference-popup-container"}
//                 //   heightClass={190}
//                 //   refetch={() => Promise.resolve()}
//                 //   minWidth={140}
//                 //   maxWidth={190}
//                 //   // handleDeleteFile={undefined}
//                 //   showSelectButton={true} // 👈 enable toggle button
//                 //   setActivePopupType={setActivePopupType}
//                 //   activePopupType={activePopupType}
//                 //   controlledType="reference"

//                 //   onToggleSelect={(image, shouldSelect) => handleToggleReferenceImage(image, shouldSelect)}

//                 //   isSelected={(image) =>
//                 //     tempReferenceImages.some((r) => r._id === image._id)
//                 //   }
//                 //   onPopupOpenChange={setIsReferencePopupOpen}
//                 //   className="overflow-y-auto max-h-[550px] "
//                 // />

//                 <ShortListImageMicaGallery
//                   images={data || []}
//                   portalId={"reference-popup-container"}
//                   heightClass={190}
//                   minWidth={140}
//                   maxWidth={190}
//                   showSelectButton={true}
//                   setActivePopupType={setActivePopupType}
//                   activePopupType={activePopupType}
//                   controlledType="reference"
//                   onToggleSelect={(image, shouldSelect) => handleToggleReferenceImage(image, shouldSelect)}
//                   isSelected={(image) => tempReferenceImages.some((r) => r._id === image._id)}
//                   onPopupOpenChange={setIsReferencePopupOpen}
//                   className="overflow-y-auto max-h-[550px]"
//                   onImageClick={handleMicaImageClick} // NEW: Track current mica on click

//                   // No detection for reference images
//                   applyMicaToDetectedAreas={false}
//                 />
//                 :
//                 <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white   text-center p-6">
//                   <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
//                   <h3 className="text-lg font-semibold text-blue-800 mb-1">No Reference Images Available</h3>
//                   <p className="text-sm text-gray-500">
//                     Upload the Images in the <span className="cursor-pointer font-semibold text-blue-600" onClick={() => navigate(`/organizations/${organizationId}/projects/shortlistdesign`)}>Reference Design</span> section<br />
//                     Select multiple Reference images<br />
//                     after selecting <strong>"Confirm Selection"</strong> to add images 🚀
//                   </p>
//                 </div>
//               }
//             </div>
//           )}
//         </div>

//         {/* 🏠 Site Images */}
//         <div>
//           <h2 className="font-semibold text-lg mb-2">Site Images</h2>
//           <div className="my-3 w-full h-[1px] bg-gray-200" />
//           {isLoadingSite ? (
//             <div><MaterialOverviewLoading /></div>
//           ) : (
//             <div className="relative  h-[80vh]" id="site-popup-container">
//               {siteImages?.length > 0 ?
//                 // <ShortListImageMicaGallery
//                 //   portalId={"site-popup-container"}
//                 //   images={siteImages}
//                 //   heightClass={190}
//                 //   refetch={() => Promise.resolve()}
//                 //   minWidth={140}
//                 //   maxWidth={190}
//                 //   // handleDeleteFile={undefined}
//                 //   setActivePopupType={setActivePopupType}
//                 //   activePopupType={activePopupType}
//                 //   controlledType="site"
//                 //   showSiteSelectButton={true}
//                 //   onSiteImageConfirm={handleConfirmSiteImage}
//                 //   selectedSiteImage={selectedSiteImage!}
//                 //   onImageClick={(img) => {
//                 //     setSelectedSiteImage(img)
//                 //     setActivePopupType("site");
//                 //   }}
//                 //   onPopupOpenChange={setIsSitePopupOpen}

//                 //   className="overflow-y-auto max-h-[550px] "

//                 // />
//                 <ShortListImageMicaGallery
//                   portalId={"site-popup-container"}
//                   images={siteImages}
//                   heightClass={190}
//                   minWidth={140}
//                   maxWidth={190}
//                   setActivePopupType={setActivePopupType}
//                   activePopupType={activePopupType}
//                   controlledType="site"
//                   showSiteSelectButton={true}
//                   onSiteImageConfirm={handleConfirmSiteImage}
//                   selectedSiteImage={selectedSiteImage!}
//                   onImageClick={(img) => {
//                     setSelectedSiteImage(img)
//                     setActivePopupType("site");
//                   }}
//                   onPopupOpenChange={setIsSitePopupOpen}
//                   className="overflow-y-auto max-h-[550px]"

//                   // NEW PROPS FOR DETECTION
//                   applyMicaToDetectedAreas={true}
//                   // selectedMicaImage={selectedSiteImage}
//                   // onDetectionComplete={(areas) => {
//                   //   console.log('Detection completed:', areas);
//                   //   // You can store detected areas in state if needed

//                   // }}

//                   // DETECTION PROPS
//                   selectedMicaImage={currentMicaImage} // Pass current mica image
//                   onDetectionComplete={handleDetectionComplete} // Handle detection results


//                   enableManualSelection={true}
//                   onAreasSelected={handleAreasSelected}
//                   selectedAreas={selectedAreas}
//                 />
//                 :
//                 <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white   text-center p-6">
//                   <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
//                   <h3 className="text-lg font-semibold text-blue-800 mb-1">No Site Images Available</h3>
//                   <p className="text-sm text-gray-500">
//                     Upload the Images in the Site Measurement Stage<br />
//                     Select multiple Reference images for single Site Image <br />
//                     after selection <strong>"Confirm Selection"</strong> to add images 🚀
//                   </p>
//                 </div>
//               }
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 🧾 Selected Summary Grid */}
//       {selections.length > 0 ?
//         (
//           <div className="mt-10 space-y-8">
//             <div className="flex justify-between">

//               <h3 className="font-bold text-xl mb-4">Selected Designs</h3>

//               <div className="flex gap-2">
//                 <Button
//                   isLoading={isGenerating}
//                   onClick={handleGenerate}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
//                 >
//                   {isGenerating ? "Generating..." : "Generate Pdf"}
//                 </Button>

//                 <Button
//                   onClick={() => {
//                     setSelections([])
//                   }}
//                   variant="danger"
//                   className="bg-red-600  text-white px-6 py-2 rounded shadow disabled:opacity-50"
//                 >
//                   Clear List
//                 </Button>
//               </div>
//             </div>

//             {selections.map(({ siteImage, referenceImages }, index) => (
//               <div
//                 key={siteImage._id}
//                 className="p-4 py-6 border border-gray-300 rounded-lg bg-white shadow-md"
//               >
//                 {/* Site Image with Index */}
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="">
//                     <h2 className="text-base font-semibold text-gray-700 min-w-[110px]">Site Image {index + 1}</h2>
//                     <br />
//                     <img
//                       src={siteImage?.url}
//                       alt={siteImage.originalName || `Site ${index + 1}`}
//                       className="h-28 w-auto object-contain border rounded-md"
//                     />
//                   </div>

//                   <Button
//                     variant="danger"

//                     onClick={() => handleRemoveSite(siteImage._id)}
//                     className="text-white bg-red-600 text-sm whitespace-nowrap"
//                   >

//                     <i className="fas fa-trash !mr-2 " ></i>
//                     Remove Site + References
//                   </Button>
//                 </div>

//                 {/* Reference Images Row */}
//                 <div className="flex flex-wrap gap-4 flex-col">
//                   <h2 className="text-base font-semibold text-gray-700 min-w-[110px]">Referece Images</h2>
//                   <div className="flex flex-wrap gap-4 ">
//                     {referenceImages.map((ref) => (
//                       <div key={ref._id} className="relative  w-[120px] h-[120px] ">
//                         <img
//                           src={ref.url}
//                           alt={ref.originalName}
//                           className="w-full h-full object-cover rounded  shadow-sm"
//                         />
//                         <button
//                           onClick={() => handleRemoveReference(siteImage._id, ref._id)}
//                           className="absolute top-1 right-1 bg-red-600 text-white p-1 px-2 text-xs rounded-full"
//                         >
//                           ✕
//                         </button>
//                         <p className="text-xs mt-1 text-center max-w-[120px] truncate">{ref.originalName}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )
//         :
//         <>
//           <h3 className="text-xl font-semibold text-black-800 my-3">Youre Selections will appear below</h3>

//           <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl shadow-xl border border-gray-100  text-center p-6">
//             <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
//             <h3 className="text-lg font-semibold text-blue-800 mb-1">No Selections Created</h3>
//             <p className="text-sm text-gray-500">
//               Your Selection will appear here.<br />
//               Select multiple Reference images for single Site Image <br />
//               after selection <strong>"Confirm Selection"</strong> to add images 🚀
//             </p>
//           </div>
//         </>
//       }



//       <section className="mt-6">
//         <ShortListPdfList projectId={projectId} />
//       </section>
//     </div>
//   );
// }


