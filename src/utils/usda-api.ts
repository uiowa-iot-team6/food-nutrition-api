import { z } from "zod";
import { ENV } from "../env";

const USDA_ENDPOINT = "https://api.nal.usda.gov";

const USDANutrientSchema = z.object({
  nutrientId: z.number(),
  nutrientName: z.string(),
  unitName: z.string(),
  nutrientNumber: z.string(),
  value: z.number(),
});

const USDAFoodSchema = z.object({
  fdcId: z.number(),
  description: z.string(),
  servingSizeUnit: z.string().optional(),
  servingSize: z.number().optional(),
  foodNutrients: z.array(USDANutrientSchema),
});

const USDAResponseSchema = z.object({
  foods: z.array(USDAFoodSchema),
});

/**
 * Refer to https://fdc.nal.usda.gov/api-guide.html#bkmk-2
 * for detailed documentation of the open-fda API endpoints.
 *
 * @param query Search query string sent to open-fda.
 */
async function searchFoods(query: string) {
  const params = new URLSearchParams({
    api_key: ENV.FOOD_DATA_API_KEY,
    query,
  });
  const endpoint = new URL("/fdc/v1/foods/search", USDA_ENDPOINT);
  const response = await fetch(`${endpoint}?${params.toString()}`);

  if (!response.ok) throw new Error("Failed to get food data.");

  return USDAResponseSchema.parse(await response.json()).foods;
}

export default {
  foods: searchFoods,
};
