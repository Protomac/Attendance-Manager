import mongoose, { Schema } from "mongoose";

class AttendanceSchema extends Schema {
  constructor() {
    const user = super(
      {
        employeeId: { type: Number },
        inTime: { type: Date },
        outTime: { type: Date },
        date: { type: Date },
        machineId: Number
      },
      { timestamps: { createdAt: "created_at" } }
    );

    return user;
  }
}
export default mongoose.model("attendance", new AttendanceSchema()); // eslint-disable-line
