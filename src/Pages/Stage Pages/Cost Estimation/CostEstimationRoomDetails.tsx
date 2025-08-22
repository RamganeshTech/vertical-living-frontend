// components/CostEstimation/MaterialRoomDetails.tsx
import {  useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import EmptyState from "../../../components/ui/EmptyState";
import { useGetSingleRoomEstimation, useUpdateMaterialEstimationItem } from "../../../apiList/Stage Api/costEstimationApi";
import RoomDetailsLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";
import CostEstimateUpload from "./CostEstimateUpload";
import { CostEstimationCell } from "./CostEstimationCell";


export interface FormData {
  areaSqFt: number;
  predefinedRate: number;
  overriddenRate: number | null;
  profitMargin: number;
}

export default function CostEstimationRoomDetails() {
  const { projectId, roomId, organizationId } = useParams();
  const navigate = useNavigate();

  if (!projectId || !roomId) return null;

  const { data: room, isLoading, refetch } = useGetSingleRoomEstimation(projectId, roomId);
  const { mutateAsync: updateMaterialItem } = useUpdateMaterialEstimationItem();

  // const [materials, setMaterials] = useState<MaterialItem[]>(room?.materials);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  // const [previewData, setPreviewData] = useState<{ [key: string]: MaterialItem }>({});

  const [formData, setFormData] = useState<FormData>({
    areaSqFt: 0,
    predefinedRate: 0,
    overriddenRate: null as number | null,
    profitMargin: 0, // new field
  });



  const formatCurrency = useCallback((value: number | null) => {
    if (value === null || value === undefined) return 'N/A';
    return value?.toLocaleString('en-IN');
  }, []);



  if (isLoading) return <RoomDetailsLoading />;
  if (!room) return <EmptyState message="Room not found" color="primary" customIconClass="box" icon="custom" />;


  


  // const formatCurrency = (value: number | null) => {
  //   if (value === null || value === undefined) return 'N/A';
  //   return value?.toLocaleString('en-IN');
  // }

  // const handleEdit = (key: string, field: any) => {
  //   setEditingKey(key);
  //   setFormData({
  //     areaSqFt: field.areaSqFt || 0,
  //     predefinedRate: field.predefinedRate || 0,
  //     overriddenRate: field.overriddenRate ?? null,
  //     profitMargin: field.profitMargin || 0,
  //   });
  // };



  // const handleEdit = (key: string, field: any) => {
  //   // setEditingKey(key);
  //   setFormData((p) => ({
  //     ...p, [key]: field
  //   }));
  // };

  // const handleReset = () => {
  //   setFormData({
  //     areaSqFt: 0,
  //     predefinedRate: 0,
  //     overriddenRate: null,
  //     profitMargin: 0,
  //   });
  // }

  const handleSave = async (materialKey: string, updatedData: FormData) => {
    try {
      // Make API call with full row data
      await updateMaterialItem({
        projectId,
        materialKey,
        updates: {
          areaSqFt: updatedData.areaSqFt,
          predefinedRate: updatedData.predefinedRate,
          overriddenRate: updatedData.overriddenRate,
          profitMargin: updatedData.profitMargin
        },
        roomId
      });

      // Update local materials state
      // setMaterials(prevMaterials => 
      //   prevMaterials.map(material => 
      //     material.key === materialKey 
      //       ? { ...material, ...updatedData }
      //       : material
      //   )
      // );

      // Clear editing state
      setEditingKey(null);

      // Reset form data
      // setFormData({
      //   areaSqFt: 0,
      //   predefinedRate: 0,
      //   overriddenRate: null,
      //   profitMargin: 0,
      // });

      toast({
        description: "Field updated successfully",
        title: "Success"
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update field",
        variant: "destructive"
      });
      throw error;
    }
  };


  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  //   let { name, value } = e.target

  //   setFormData(p => ({ ...p, [name]: value }))
  // }


  // Initialize form data when starting to edit a row
  // const startRowEditing = (materialKey: string, material: MaterialItem) => {
  //   setEditingKey(materialKey);
  //   setFormData({
  //     areaSqFt: material.areaSqFt,
  //     predefinedRate: material.predefinedRate,
  //     overriddenRate: material.overriddenRate,
  //     profitMargin: material.profitMargin,
  //   });
  // };

  // Update form data for live preview
  // const handleFormDataChange = (fieldKey: EditableField, value: any) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [fieldKey]: value
  //   }));
  // }

  // console.log("data form cost ", room)




  return (
    <div className="max-w-full h-full overflow-y-scroll custom-scrollbar mx-auto mt-0 bg-white  rounded py-2 px-0">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h2>
          <p className="text-gray-500 mb-6">Room Material Items</p>
        </div>
        <Button variant="primary" className="h-10" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/costestimation`)}>
          Go Back
        </Button>
      </div>



      <section className="border border-gray-200 rounded-lg overflow-hidden">

        <section>
          <div className="mb-4 p-2 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">Total Material Cost:</span>
              <span className={`text-lg font-bold  text-blue-900`}>₹{room?.totalCost?.toLocaleString() || "0"}</span>
            </div>
          </div>
        </section>

        {/* Table header */}
        <div className="w-full overflow-x-auto h-[95%]  custom-scrollbar">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-6 bg-blue-50 text-sm font-semibold text-gray-600 px-6 py-1 sm:py-3 ">
              <div className="text-left px-3 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Item</div>
              <div className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Area Sq.Ft</div>
              <div className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Base Rate</div>
              <div className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Added Rate</div>
              <div className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin (%)</div>
              <div className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</div>
              {/* <div className="text-center px-6 py-1 sm:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div> */}
            </div>

            {/* Table body */}
            <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
              {room?.materials?.map((item: any) => {
                // const isRowEditing = editingKey === item.key;

                return <div key={item.key} className={`grid grid-cols-6 items-center px-6 py-4 text-sm ${editingKey === item.key ? "" : "hover:bg-[#f7fbff]"}`}>
                  <div className="font-medium text-gray-800">{item.key}</div>

                  {/* {editingKey === item.key ? ( */}
                  <>
                    {/* <div className="text-center">
                        <Input
                          className="text-center"
                          type="number"
                          value={formData.areaSqFt}
                          onChange={(e) =>
                            setFormData({ ...formData, areaSqFt: +e.target.value })
                          }
                        />
                      </div>
                      <div className="text-center">
                        <Input
                          className="text-center"
                          type="number"
                          value={formData.predefinedRate}
                          onChange={(e) =>
                            setFormData({ ...formData, predefinedRate: +e.target.value })
                          }
                        />
                      </div>
                      <div className="text-center">
                        <Input
                          className="text-center"
                          type="number"
                          value={formData?.overriddenRate ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              overriddenRate: +e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="text-center">
                        <Input
                          className="text-center"
                          type="number"
                          value={formData.profitMargin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              profitMargin: +e.target.value,
                            })
                          }
                        />
                      </div> */}


                    {/* <CostEstimationCell
                      materialKey={item.key}
                      formData={formData}
                      item={item?.areaSqFt}
                      handleChange={handleChange}
                      handleEdit={handleEdit}
                      inputKey="areaSqFt"

                      onSave={handleSave} />
                    <CostEstimationCell
                      materialKey={item.key}
                      formData={formData}
                      inputKey="predefinedRate"
                      handleEdit={handleEdit}

                      item={item?.predefinedRate?.toLocaleString("en-IN") ?? "N/A"}
                      handleChange={handleChange}

                      onSave={handleSave} />
                    <CostEstimationCell
                      materialKey={item.key}
                      formData={formData}
                      inputKey="overriddenRate"
                      item={item?.overriddenRate?.toLocaleString("en-IN") ?? "N/A"}
                      handleChange={handleChange}
                      handleEdit={handleEdit}
                      onSave={handleSave}
                    />
                    <CostEstimationCell
                      materialKey={item.key}
                      formData={formData}
                      inputKey="profitMargin"
                      handleChange={handleChange}
                      item={item?.profitMargin?.toLocaleString("en-IN") ?? "N/A"}
                      handleEdit={handleEdit}

                      onSave={handleSave} /> */}


                    <CostEstimationCell
                      setFormData={setFormData}

                      setEditingKey={setEditingKey}
                      materialKey={item.key}
                      fieldKey="areaSqFt"
                      value={item.areaSqFt}
                      originalData={item}
                      onSave={handleSave}
                    />

                    <CostEstimationCell
                      setFormData={setFormData}

                      setEditingKey={setEditingKey}
                      materialKey={item.key}
                      fieldKey="predefinedRate"
                      value={item.predefinedRate}
                      originalData={item}
                      onSave={handleSave}
                      formatDisplay={formatCurrency}
                    />

                    <CostEstimationCell

                      setEditingKey={setEditingKey}
                      materialKey={item.key}
                      setFormData={setFormData}

                      fieldKey="overriddenRate"
                      value={item.overriddenRate}
                      originalData={item}
                      onSave={handleSave}
                      formatDisplay={formatCurrency}
                    />

                    <CostEstimationCell
                      setEditingKey={setEditingKey}
                      materialKey={item.key}
                      setFormData={setFormData}

                      fieldKey="profitMargin"
                      value={item.profitMargin}
                      originalData={item}
                      onSave={handleSave}
                      formatDisplay={formatCurrency}
                    />


                    {editingKey === item.key ?
                      <>
                      <div className="text-center text-gray-900 font-semibold">
                      {(() => {
                        const predefined = formData.predefinedRate || 0;
                        const overridden = formData?.overriddenRate || 0;
                        const marginPercent = formData?.profitMargin || 0;
                        const profitAmount = marginPercent > 0 ? (predefined * marginPercent / 100) : 0;
                        const finalRate = predefined + overridden + profitAmount;
                        return formData.areaSqFt > 0
                          ? "₹" + (formData.areaSqFt * finalRate).toLocaleString("en-IN")
                          : "N/A";
                      })()}
                      </div>
                      </>
                      :
                      <div className="text-center text-black font-semibold">₹{item?.totalCost?.toLocaleString("en-IN") ?? "N/A"}</div>
                    }


                  </>


                  {/* <div className="flex items-center justify-center gap-2">
                        <Button variant="primary" isLoading={updatePending} onClick={() => handleSave(item.key)}> <i className="fas fa-check"></i> </Button>
                        <Button variant="secondary" onClick={() => setEditingKey(null)}><i className="fas fa-xmark"></i></Button>
                      </div> */}

                  {/* ) : (
                    <>
                      <div className="font-medium text-center  text-gray-700">{item?.areaSqFt ?? "N/A"}</div>
                      <div className="font-medium text-center text-gray-700">₹{item?.predefinedRate?.toLocaleString("en-IN") ?? "N/A"}</div>
                      <div className="font-medium text-center text-gray-700">₹{item?.overriddenRate?.toLocaleString("en-IN") ?? "N/A"}</div>
                      <div className="font-medium text-center text-gray-700">{item?.profitMargin?.toLocaleString("en-IN") ?? "N/A"} %</div>
                      <div className="text-center text-black font-semibold">₹{item?.totalCost?.toLocaleString("en-IN") ?? "N/A"}</div>
                      <div className="flex justify-center items-center">
                        <Button variant="primary" onClick={() => handleEdit(item.key, item)}>✎</Button>
                      </div>
                    </>
                  )} */}
                </div>
              })}
            </div>
          </div>
        </div >
      </section >


      <section className="mt-4">
        <CostEstimateUpload projectId={projectId!} roomId={roomId!} initialFiles={room.uploads} refetch={refetch} />
      </section>
    </div >
  );
}

