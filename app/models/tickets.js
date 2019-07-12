import mongoose, { Schema } from "mongoose";

class TicketsSchema extends Schema {
  constructor() {
    const user = super(
      {
        ticketId: { type: String },
        status: { type: String, default: "N"},
        custId: { type: String },
        empId: { type: String },
        description:{ type: String, default: ""},
        comments:{ type: [], default: []},
        category: { type: String, default: "Others"},
        opendOn: Date,
        updatedOn: Date,
        priority: String,
        title: String,
        assignDate: Date,
        timeToComplete: Date
      },
      { timestamps: { createdAt: "created_at" } }
    );

    return user;
  }
}
export default mongoose.model("Tickets", new TicketsSchema()); // eslint-disable-line
