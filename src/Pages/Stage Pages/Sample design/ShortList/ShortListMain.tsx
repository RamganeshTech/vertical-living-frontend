import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../../utils/toast";
import ShortListImageGallery from "../../../../shared/ImageGallery/ShortListImageGallery";
// import { useUploadShortlistedDesigns } from "../../../../apiList/Stage Api/shortlistReferenceDesignApi";
// import { useGetReferenceDesigns, useGetAllSiteImages } from "../../../../apiList/Stage Api/shortlistReferenceDesignApi";
import { downloadImage } from "../../../../utils/downloadFile";
import { useGetAllSiteImages, useGetReferenceDesign, useUploadShortlistedDesigns } from "../../../../apiList/Stage Api/shortListApi";
// import { useGetReferenceDesigns } from "../../../../apiList/Stage Api/shortlistReferenceDesignApi";
import MaterialOverviewLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { Button } from "../../../../components/ui/Button";
import ShortListPdfList from "./ShortListPdfList";
// import TagInput from "../../../../shared/TagInput";
import axios from "axios";
import SmartTagInput from "../../../../shared/SmartTagInput";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";

interface ImageFile {
  _id: string;
  url: string;
  originalName?: string;
  type?: string;
  uploadedAt?: Date;
}

interface RoomShortlist {
  siteImage: ImageFile;
  referenceImages: ImageFile[];
}



export const fetchSuggestions = ({ query, organizationId }: { query: string, organizationId: string }) => {

  // Add a safety check: if query or organizationId are missing, don't crash
  const qValue = query || "";
  const orgValue = organizationId || "";


  return axios
    .get(
      // `${import.meta.env.VITE_API_URL}/api/shortlisteddesign/getsuggestedtags?q=${encodeURIComponent(
      //   query
      // )}`

      // Look at the end of the URL string:
      // `${import.meta.env.VITE_API_URL}/api/shortlisteddesign/getsuggestedtags?q=${encodeURIComponent(query)}
      // &organizationId=${encodeURIComponent(organizationId)}`

      `${import.meta.env.VITE_API_URL}/api/shortlisteddesign/getsuggestedtags`, {
      params: {
        q: qValue,
        organizationId: orgValue
      }
    }

    )
    .then((res) => {
      if (Array.isArray(res?.data?.tags)) {
        return res.data.tags;
      }
      return [];
    })
    .catch(err => {
      console.error("Suggestion Error:", err);
      return [];
    });
}





export default function ShortlistMain() {
  const { projectId, organizationId } = useParams() as {
    projectId: string;
    organizationId: string;
  };
  const [activePopupType, setActivePopupType] = useState<"reference" | "site" | null>(null);
  const navigate = useNavigate()

  const { data: siteImages = [], isLoading: isLoadingSite } = useGetAllSiteImages(projectId);
  // const { data, isLoading: isLoadingRefs } = useGetReferenceDesigns({ organizationId });

  const [selectedSiteImage, setSelectedSiteImage] = useState<ImageFile | null>(null); // for selecting ref images
  const [tempReferenceImages, setTempReferenceImages] = useState<ImageFile[]>([]);

  const [isSitePopupOpen, setIsSitePopupOpen] = useState(false);
  const [isReferencePopupOpen, setIsReferencePopupOpen] = useState(false);

  const [tags, setTags] = useState<string[]>([]); // by default show general images



  const {
    data,
    isLoading: isLoadingRefs,
  } = useGetReferenceDesign(organizationId, tags);


  useEffect(() => {
    setSelectedSiteImage(null);
    setTempReferenceImages([]);
    setActivePopupType(null)
    setIsReferencePopupOpen(false)
    setIsSitePopupOpen(false)
  }, [data])


  const [selections, setSelections] = useState<RoomShortlist[]>([]);

  const { mutateAsync: uploadDesigns, isPending: isGenerating } = useUploadShortlistedDesigns();


  useEffect(() => {
    const eitherOpen = isSitePopupOpen || isReferencePopupOpen;
    document.body.style.overflow = eitherOpen ? 'hidden' : 'unset';

    return () => {
      document.body.style.overflow = 'unset'; // Safety fallback
    };
  }, [isSitePopupOpen, isReferencePopupOpen]);

  const handleConfirmSiteImage = (e: any, image: ImageFile) => {
    e.stopPropagation();
    // setSelectedSiteImage(image);

    setSelectedSiteImage((currentSelected) => {
      // if same image is already selected, deselect it (toggle off)
      if (currentSelected?._id === image._id) {
        toast({ title: "Success", description: "Unselected, You can now select another one." });
        return null;
      }

      toast({ title: "Success", description: "Site Image selected" });
      return image;
    });
  };

  const handleToggleReferenceImage = (refImage: ImageFile, shouldSelect: boolean) => {
    if (!selectedSiteImage) {
      toast({ title: "Error", description: "Please select a Site Image first", variant: "destructive" });
      return;
    }

    setTempReferenceImages((prev) => {
      const exists = prev.some((r) => r._id === refImage._id);

      if (shouldSelect && !exists) {
        return [...prev, refImage];
      } else if (!shouldSelect) {
        return prev.filter((r) => r._id !== refImage._id);
      }

      return prev;
    });
  };

  // ✅ Remove reference image
  const handleRemoveReference = (siteId: string, refId: string) => {
    setSelections((prev) =>
      prev
        .map((s) =>
          s.siteImage._id === siteId
            ? { ...s, referenceImages: s.referenceImages.filter((r) => r._id !== refId) }
            : s
        )
        .filter((s) => s.referenceImages.length > 0)
    );
  };

  // ✅ Remove entire siteImage + refs
  const handleRemoveSite = (siteId: string) => {
    setSelections((prev) => prev.filter((s) => s.siteImage._id !== siteId));
  };

  // ✅ Generate Designs
  const handleGenerate = async () => {
    if (selections.length === 0) {
      toast({ title: "Error", description: "No selections to generate", variant: "destructive" });
      return;
    }

    try {
      const res = await uploadDesigns({ projectId, selections });
      downloadImage({ src: res.url, alt: res.fileName })
      toast({ title: "Sucess", description: "Designs Generated Successfully!" });
      setSelections([])
    } catch (error: any) {
      toast({ title: "Error", description: error?.message, variant: "destructive" });
    }
  };



  const { role, permission } = useAuthCheck();
  // const canDelete = role === "owner" || permission?.sampledesign?.delete;
  // const canList = role === "owner" || permission?.sampledesign?.list;
  const canCreate = role === "owner" || permission?.sampledesign?.create;
  const canEdit = role === "owner" || permission?.sampledesign?.create;





  // console.log("data", data)
  return (
    <div className="max-w-full overflow-y-auto max-h-full px-4 mx-auto py-2">
      <header className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div
            onClick={() => navigate(-1)}
            // className="flex bg-gray-200 h-fit rounded-full items-center gap-2 backdrop-blur-sm px-4 py-2 cursor-pointer"
            className="flex bg-brand-surface border border-ash-medium hover:bg-brand-ash h-fit rounded-lg items-center gap-2 px-3 py-2 cursor-pointer shadow-sm"
          >
            <i className="fas fa-arrow-left text-sm"></i>
            <span className="text-sm hidden sm:inline-block font-medium">Back</span>
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">Shortlisting Reference Designs</h1>
            {/* <p className="text-gray-600 hidden sm:inline-block text-sm md:text-md"> */}
            <p className="text-text-muted hidden sm:inline-block text-sm">
              Select and organize your favorite design references for easy access
            </p>
          </div>
        </div>


        {(selectedSiteImage || tempReferenceImages.length > 0) && <button
          // className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
          className="bg-action-primary hover:opacity-90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer shadow-sm transition-all whitespace-nowrap"
          onClick={() => {
            if (!selectedSiteImage || tempReferenceImages.length === 0) {
              toast({ title: "Error", description: "Select site image & at least 1 reference", variant: "destructive" });
              return;
            }

            setSelections((prev) => {
              // Remove duplicate entry for this site (if exists)
              const filtered = prev.filter(
                (sel) => sel.siteImage._id !== selectedSiteImage._id
              );

              return [
                ...filtered,
                {
                  siteImage: selectedSiteImage,
                  referenceImages: tempReferenceImages,
                },
              ];
            });
            // Reset temp state
            setSelectedSiteImage(null);
            setTempReferenceImages([]);
          }}
        >
          Confirm Selection
        </button>}
      </header>
      <hr className="my-3 bg-ash-medium" />

      {/* <div className="mb-4 flex gap-4 w-full  items-end"> */}
      <div className="mb-6 flex gap-4 w-full items-end bg-brand-surface p-4 rounded-xl border border-ash-medium shadow-sm">

        <div className="flex flex-1 flex-col">
          {/* <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Categories</label> */}
          <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">Filter by Categories</label>
          {/* <TagInput tags={tags} setState={setTags} /> */}

          <SmartTagInput
            tags={tags}
            setState={setTags}
            suggestionFetcher={(q) => fetchSuggestions({ query: q, organizationId })}
          />

          {/* <SmartTagInput tags={tags} setState={setTags} disableSuggestion /> */}
        </div>

        <div>
          <Button
            variant="outline"
            onClick={() => setTags([])}
            // className="text-sm ml-2 flex"
            className="text-sm ml-2 flex border-ash-medium text-text-main hover:bg-brand-ash bg-brand-surface shadow-sm"
          >
            Reset Filter
          </Button>
        </div>
      </div>



      {/* <div className="grid md:grid-cols-2 gap-8 border-gray-300 border-2 rounded-2xl p-2"> */}
      <div className="grid md:grid-cols-2 gap-6 border border-ash-medium rounded-2xl bg-brand-surface shadow-sm p-2">
        {/* ➕ Reference Designs */}
        {/* <div className="border-r-1 border-gray-300 pr-8"> */}
        <div className="md:border-r border-ash-medium p-5 sm:p-6 bg-brand-surface">
          {/* <h2 className="font-semibold text-lg mb-2">Reference Designs</h2> */}

          <h2 className="font-bold text-lg mb-4 text-text-main flex items-center gap-2">
            <i className="fa-regular fa-image text-text-muted"></i>
            Reference Designs
          </h2>

          {/* <div className="my-3 w-full h-[1px] bg-gray-200" /> */}
          <div className="mb-3 w-full h-[1px] bg-ash-light" />

          {isLoadingRefs ? (
            <div><MaterialOverviewLoading /></div>
          ) : (
            <div className="relative  h-[80vh]" id="reference-popup-container">
              {data?.length > 0 ?
                <ShortListImageGallery
                  imageFiles={data || []}
                  portalId={"reference-popup-container"}
                  height={190}
                  refetch={() => Promise.resolve()}
                  minWidth={140}
                  maxWidth={190}
                  handleDeleteFile={undefined}
                  showSelectButton={true} // 👈 enable toggle button
                  setActivePopupType={setActivePopupType}
                  activePopupType={activePopupType}
                  controlledType="reference"

                  onToggleSelect={(image, shouldSelect) => handleToggleReferenceImage(image, shouldSelect)}

                  isSelected={(image) =>
                    tempReferenceImages.some((r) => r._id === image._id)
                  }
                  onPopupOpenChange={setIsReferencePopupOpen}
                  className="overflow-y-auto max-h-[550px] "
                />

                :
                // <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white   text-center p-6">
                //   <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                //   <h3 className="text-lg font-semibold text-blue-800 mb-1">No Reference Images Available</h3>
                //   <p className="text-sm text-gray-500">
                //     Upload the Images in the <span className="cursor-pointer font-semibold text-blue-600" onClick={() => navigate(`/organizations/${organizationId}/projects/shortlistdesign`)}>Reference Design</span> section<br />
                //     Select multiple Reference images<br />
                //     after selecting <strong>"Confirm Selection"</strong> to add images 🚀
                //   </p>
                // </div>

                <div className="flex flex-col items-center justify-center h-full w-full bg-brand-ash border border-dashed border-ash-medium rounded-xl text-center p-6">
                  <div className="w-16 h-16 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <i className="fas fa-box-open text-2xl text-ash-dark" />
                  </div>
                  <h3 className="text-base font-bold text-text-main mb-1">No Reference Images</h3>
                  <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
                    Upload images in the <span className="cursor-pointer font-bold text-text-main hover:underline" onClick={() => navigate(`/organizations/${organizationId}/projects/shortlistdesign`)}>Reference Design</span> section.<br />
                    Select multiple references, then click <strong>"Confirm Selection"</strong> 🚀
                  </p>
                </div>
              }
            </div>
          )}
        </div>

        {/* 🏠 Site Images */}
        <div className="p-5 sm:p-6 bg-brand-surface">
          {/* <h2 className="font-semibold text-lg mb-2">Site Images</h2>
          <div className="my-3 w-full h-[1px] bg-gray-200" /> */}

          <h2 className="font-bold text-lg mb-4 text-text-main flex items-center gap-2">
            <i className="fa-solid fa-camera text-text-muted"></i>
            Site Images
          </h2>
          <div className="mb-4 w-full h-[1px] bg-ash-light" />
          {isLoadingSite ? (
            <div><MaterialOverviewLoading /></div>
          ) : (
            <div className="relative  h-[80vh]" id="site-popup-container">
              {siteImages?.length > 0 ? <ShortListImageGallery
                portalId={"site-popup-container"}
                imageFiles={siteImages}
                height={190}
                refetch={() => Promise.resolve()}
                minWidth={140}
                maxWidth={190}
                // handleDeleteFile={undefined}
                setActivePopupType={setActivePopupType}
                activePopupType={activePopupType}
                controlledType="site"
                showSiteSelectButton={true}
                onSiteImageConfirm={handleConfirmSiteImage}
                selecteSiteImage={selectedSiteImage!}
                onImageClick={(img) => {
                  setSelectedSiteImage(img)
                  setActivePopupType("site");
                }}
                onPopupOpenChange={setIsSitePopupOpen}

                className="overflow-y-auto max-h-[550px] "

              />
                :
                // <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white   text-center p-6">
                //   <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                //   <h3 className="text-lg font-semibold text-blue-800 mb-1">No Site Images Available</h3>
                //   <p className="text-sm text-gray-500">
                //     Upload the Images in the Site Measurement Stage<br />
                //     Select multiple Reference images for single Site Image <br />
                //     after selection <strong>"Confirm Selection"</strong> to add images 🚀
                //   </p>
                // </div>

                <div className="flex flex-col items-center justify-center h-full w-full bg-brand-ash border border-dashed border-ash-medium rounded-xl text-center p-6">
                  <div className="w-16 h-16 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <i className="fas fa-box-open text-2xl text-ash-dark" />
                  </div>
                  <h3 className="text-base font-bold text-text-main mb-1">No Reference Images</h3>
                  <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
                    Upload images in the <span className="cursor-pointer font-bold text-text-main hover:underline" onClick={() => navigate(`/organizations/${organizationId}/projects/shortlistdesign`)}>Reference Design</span> section.<br />
                    Select multiple references, then click <strong>"Confirm Selection"</strong> 🚀
                  </p>
                </div>
              }
            </div>
          )}
        </div>
      </div>

      {/* 🧾 Selected Summary Grid */}
      {selections.length > 0 ?
        (
          <div className="mt-10 space-y-8">
            {/* <div className="flex justify-between">

              <h3 className="font-bold text-xl mb-4">Selected Designs</h3> */}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-ash-medium">
              <h3 className="font-bold text-xl text-text-main flex items-center gap-2">
                <i className="fa-solid fa-layer-group text-text-muted"></i>
                Selected Designs Summary
              </h3>

              <div className="flex gap-2">
                {(canCreate || canEdit) && <Button
                  isLoading={isGenerating}
                  onClick={handleGenerate}
                  // className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
                  variant="dark"
                  className="bg-action-primary hover:opacity-90 text-white px-6 py-2 rounded-lg shadow-sm text-sm font-semibold disabled:opacity-50 transition-all"
                >
                  {isGenerating ? "Generating..." : "Generate Pdf"}
                </Button>}

                <Button
                  onClick={() => {
                    setSelections([])
                  }}
                  // variant="danger"
                  // className="bg-red-600  text-white px-6 py-2 rounded shadow disabled:opacity-50"

                  variant="ghost"
                  className="bg-brand-surface border border-ash-light text-action-danger px-5 py-2 rounded-lg shadow-sm text-sm font-semibold transition-all"
                >
                  Clear List
                </Button>
              </div>
            </div>

            {selections.map(({ siteImage, referenceImages }, index) => (
              <div
                key={siteImage._id}
                className="p-4 py-6 border border-ash-medium rounded-lg bg-brand-surface shadow-md"
              >
                {/* Site Image with Index */}
                <div className="flex justify-between items-start mb-4 lg:border-r border-ash-light">
                {/* <div className="flex lg:w-1/3 shrink-0 lg:border-r border-ash-light lg:pr-6"> */}
                  <div className="">
                    <h2 className="text-base font-semibold text-gray-700 min-w-[110px]">Site Image {index + 1}</h2>
                    <br />
                    <img
                      src={siteImage?.url}
                      alt={siteImage.originalName || `Site ${index + 1}`}
                      className="h-28 w-auto object-contain border rounded-md"
                    />
                  </div>

                  {/* <div className="flex justify-between items-center mb-3">
                      <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Site Image {index + 1}
                      </h2>
                    </div>
                    <div className="bg-brand-ash border border-ash-medium p-2 rounded-lg shadow-sm mb-4">
                      <img
                        src={siteImage?.url}
                        alt={siteImage.originalName || `Site ${index + 1}`}
                        className="h-32 sm:h-40 w-full object-contain rounded-md bg-brand-surface"
                      />
                    </div> */}

                  <Button
                    // variant="danger"
                    variant="ghost"
                    onClick={() => handleRemoveSite(siteImage._id)}
                    // className="text-white bg-red-600 text-sm whitespace-nowrap"
                    // className="text-action-danger bg-red-50/50 hover:bg-action-danger hover:text-white border border-red-100 text-sm font-semibold transition-all w-full justify-center"
                    className="flex-1 sm:flex-none text-action-danger bg-brand-surface border  border-ash-dark hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all px-4"

                  >

                    <i className="fas fa-trash !mr-2 " ></i>
                    Remove Site + References
                  </Button>
                </div>

                {/* Reference Images Row */}
                <div className="flex flex-wrap gap-2 flex-col">
                  {/* <h2 className="text-base font-semibold text-gray-700 min-w-[110px]">Referece Images</h2> */}
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                      Reference Images 
                    </h2>
                  <div className="flex flex-wrap gap-4 ">
                    {referenceImages.map((ref) => (
                      <div key={ref._id} className="relative  w-[120px] h-[120px] ">
                        <img
                          src={ref.url}
                          alt={ref.originalName}
                          className="w-full h-full object-cover rounded  shadow-sm"
                        />
                        <button
                          onClick={() => handleRemoveReference(siteImage._id, ref._id)}
                          // className="absolute top-1 right-1 bg-red-600 text-white p-1 px-2 text-xs rounded-full"
                          className="absolute -top-1 -right-1 bg-brand-surface border border-ash-medium text-text-muted hover:text-action-danger hover:border-action-danger w-7 h-7 flex items-center justify-center text-xs rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <i className="fas fa-xmark"></i>
                        </button>
                        <p className="text-xs mt-1 text-center max-w-[120px] truncate">{ref.originalName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
        :
        <>
          {/* <h3 className="text-xl font-semibold text-black-800 my-3">Youre Selections will appear below</h3>

          <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl shadow-xl border border-gray-100  text-center p-6">
            <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Selections Created</h3>
            <p className="text-sm text-gray-500">
              Your Selection will appear here.<br />
              Select multiple Reference images for single Site Image <br />
              after selection <strong>"Confirm Selection"</strong> to add images 🚀
            </p>
          </div> */}

          <div className="mt-8 border-t border-ash-medium pt-8">
          <h3 className="text-lg font-bold text-text-main mb-4">Your Selections</h3>
          <div className="flex flex-col items-center justify-center min-h-[250px] w-full bg-brand-surface rounded-xl shadow-sm border border-ash-medium text-center p-6">
            <div className="w-16 h-16 bg-brand-ash border border-ash-light rounded-full flex items-center justify-center mb-4 shadow-sm">
              <i className="fa-solid fa-layer-group text-2xl text-ash-dark" />
            </div>
            <h3 className="text-base font-bold text-text-main mb-1">No Selections Created</h3>
            <p className="text-sm text-text-muted leading-relaxed max-w-lg mx-auto">
              Your generated pairs will appear here.<br />
              Select a Site Image and multiple References, then click <strong>"Confirm Selection"</strong>.
            </p>
          </div>
        </div>
        </>
      }



      {/* <section className="mt-6"> */}
      <section className="mt-10 border-t border-ash-medium pt-8">
        <ShortListPdfList projectId={projectId} />
      </section>
    </div>
  );
}


