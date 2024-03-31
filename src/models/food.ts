import { Schema, model } from "mongoose";

export const FoodSchema = new Schema({
  name: String,
  category: String,
});

export const Food = model("Food", FoodSchema);
