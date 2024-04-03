import mongoose from "mongoose";

export class MongoContext {
  public mongoose: Promise<typeof mongoose>;

  constructor(private url: string) {
    this.mongoose = mongoose.connect(url);
  }
}
