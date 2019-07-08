import mongoose, { Schema } from "mongoose";

class CustomerSchema extends Schema {
  constructor() {
    const user = super(
      {
        CustomerId: { type: Number },
        CustEmail: { type: String, unique: true },
        CustContactNum: { type: Number, unique: true },
        Address: String
      },
      { timestamps: { createdAt: "created_at" } }
    );

    return user;
  }
}
export default mongoose.model("Customer", new CustomerSchema()); // eslint-disable-line
