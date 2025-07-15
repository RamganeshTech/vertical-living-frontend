import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// lib/api/brandApi.ts


const getBrandsByCategory = async ({category}: {category: string;}) => {
  const { data } = await axios.get(`/api/ai/brands/${category}`);
  return data.data; // This is the array of brand names!
};


export const useBrandsByCategory = (category: string) => {
const excludedCategories = [
  "electricalFittings",
  "ceramicSanitaryware",
  "upholsteryCurtains",
  "falseCeilingMaterials",
];


 const isExcluded = excludedCategories.includes(category);
  return useQuery({
    queryKey: ["brands", category],
    queryFn: () => getBrandsByCategory({category}),
    enabled: !!category && !isExcluded, // only run if category & api are ready
  });
};