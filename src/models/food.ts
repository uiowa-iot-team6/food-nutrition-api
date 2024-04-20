import mongoose, { Schema, model } from "mongoose";
import { IUSDAFood } from "../utils/usda-api";

export const FoodNutrientSchema = new Schema({
  nutrientName: String,
  value: Number,
  unitName: String,
  nutrientNumber: String,
  nutrientId: Number,
});

export const FoodRecordSchema = new Schema({
  fdcId: String,
  description: String,
  servingSize: String,
  servingSizeUnit: String,
  servingsConsumed: Number,
  foodNutrients: [FoodNutrientSchema],
  associatedUser: { type: Schema.Types.ObjectId, ref: "users" },
  date: { type: Date, default: Date.now },
});

export const FoodRecord = model("FoodRecord", FoodRecordSchema);

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
 * @param userId
 * @throws
 */
export function createFoodRecordFromUSDAFood(
  food: IUSDAFood,
  mass: number,
  userId: mongoose.Types.ObjectId,
) {
  if (food.servingSizeUnit?.toLowerCase() !== "g" || !food.servingSize)
    throw new InvalidFoodServingsError("g", food);

  const servingsCount = mass / food.servingSize;

  return new FoodRecord({
    ...food,
    servingsConsumed: servingsCount,
    associatedUser: userId,
  });
}
