import mongoose, { Schema } from "mongoose";

class TicketsSchema extends Schema {
  constructor() {
    const user = super(
      {
        ticketId: { type: String },
        status: { type: String, default: "N" },
        custId: { type: String },
        empId: { type: String, default: "" },
        description: { type: String, default: "" },
        comments: { type: [], default: [] },
        category: { type: String, default: "others" },
        opendOn: Date,
        updatedOn: { type: Date, default: "" },
        priority: { type: String, default: "low" },
        title: { type: String, default: "" },
        assignDate: Date,
        timeToComplete: { type: Date, default: "" },
      },
      { timestamps: { createdAt: "created_at" } }
    );

    return user;
  }
}
export default mongoose.model("Tickets", new TicketsSchema()); // eslint-disable-line
