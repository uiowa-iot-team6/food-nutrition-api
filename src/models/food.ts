import { Schema, model } from "mongoose";
import { IUSDAFood } from "../utils/usda-api";

// just for shits & gigs so I can check out Mongoose
export const FoodRecord = new Schema({
  fdcId: String,
  description: String,
  servingSize: String,
  servingSizeUnit: String,
  servingsConsumed: Number,
  nutrients: {
    nutrientName: String,
    value: Number,
    unitName: String,
    nutrientNumber: String,
  },
});

export const Food = model("FoodRecord", FoodRecord);

export class InvalidFoodServingsError extends Error {
  constructor(requiredServingSize: string, receivedFood: IUSDAFood) {
    if (
      receivedFood.servingSizeUnit?.toLocaleLowerCase() !==
      requiredServingSize.toLocaleLowerCase()
    ) {
      super(
        `Invalid serving size provided for '${receivedFood.description}'. Required serving size must be in '${requiredServingSize}' but received ${receivedFood.servingSizeUnit}.`,
      );
    }

    super(
      `Missing required servings information for food ${receivedFood.description}. This likely means the food had no associated servings data provided`,
    );
  }
}

/**
 *
 * @param food USDA food query (serving size units must be "g"!)
 * @param mass
 * @throws
 */
export function recordUSDAFoodConsumption(food: IUSDAFood, mass: number) {
  if (food.servingSizeUnit?.toLowerCase() !== "g" || !food.servingSize)
    throw new InvalidFoodServingsError("g", food);

  const servingsCount = mass / food.servingSize;
}
