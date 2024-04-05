import { ENV } from "../env";

const FDA_ENDPOINT = "https://api.nal.usda.gov";

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
  const endpoint = new URL("/fdc/v1/foods/search", FDA_ENDPOINT);
  console.log(endpoint);
  const response = await fetch(`${endpoint}?${params.toString()}`);

  if (!response.ok) throw new Error("Failed to get food data.");

  // TODO: Schema parse for type safety
  return await response.json();
}

export default {
  foods: searchFoods,
};
