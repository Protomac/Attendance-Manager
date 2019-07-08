import mongoose, { Schema } from "mongoose";

class AllTicketsSchema extends Schema {
  constructor() {
    const user = super(
      {
        ticketId: { type: String, unique: true },
        status: { type: String },
        CustId: { type: String },
        EmpId: { type: String },
        title: String,
        category: String,
        opendOn: Date,
        updatedOn: Date,
        priority: String,
        reason: String,
        assignDate: Date,
        timeToComplete: Date
      },
      { timestamps: { createdAt: "created_at" } }
    );

    return user;
  }
}
export default mongoose.model("AllTickets", new AllTicketsSchema()); // eslint-disable-line
