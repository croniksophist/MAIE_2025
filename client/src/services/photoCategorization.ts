// src/services/photoCategorization.ts
import { analyzeImage } from "./photoAI";

interface CategorizedImages {
  [category: string]: string[];
}

const categorizeByLabels = (labels: string[]): string => {
  if (labels.includes("Person")) return "People";
  if (labels.includes("Landscape")) return "Landscapes";
  if (labels.includes("Building")) return "Architecture";
  return "Miscellaneous";
};

export const categorizePhotos = async (photoUrls: string[]): Promise<CategorizedImages> => {
  const categories: CategorizedImages = {};

  for (const url of photoUrls) {
    const aiData = await analyzeImage(url);
    if (!aiData) continue;

    const detectedLabels = aiData.labelAnnotations.map((label: any) => label.description);
    const category = categorizeByLabels(detectedLabels);

    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(url);
  }

  return categories;
};
