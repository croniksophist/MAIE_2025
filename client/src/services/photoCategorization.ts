import { analyzeImage } from "./photoAI";

interface CategorizedImages {
  [category: string]: string[];
}

export const categorizePhotos = async (photoUrls: string[]): Promise<CategorizedImages> => {
  const categories: CategorizedImages = {};

  for (const url of photoUrls) {
    const aiData = await analyzeImage(url);
    if (!aiData) continue;

    const detectedLabels = aiData.labelAnnotations.map((label: any) => label.description);

    // Determine category based on detected labels
    const category = detectedLabels.includes("Person")
      ? "People"
      : detectedLabels.includes("Landscape")
      ? "Landscapes"
      : detectedLabels.includes("Building")
      ? "Architecture"
      : "Miscellaneous";

    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(url);
  }

  return categories;
};
