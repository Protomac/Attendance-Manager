import mongoose, { Schema } from "mongoose";

class TicketsSchema extends Schema {
  constructor() {
    const user = super(
      {
        ticketId: { type: String },
        status: { type: String },
        custId: { type: String },
        EmpId: { type: String },
        title: String,
        description:String,
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
export default mongoose.model("Tickets", new TicketsSchema()); // eslint-disable-line
