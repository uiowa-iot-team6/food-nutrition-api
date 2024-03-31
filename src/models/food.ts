import { Schema, model } from "mongoose";

// just for shits & gigs so I can check out Mongoose
export const FoodSchema = new Schema({
  name: String,
  category: String,
});

export const Food = model("Food", FoodSchema);
