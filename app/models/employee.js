import mongoose, { Schema } from "mongoose";

class AddEmployee extends Schema {
  constructor() {
    const user = super(
      {
        employeeId: { type: Number },
        name: String,
        contactnumber: { type: Number, unique: true }
      },
      { timestamps: { createdAt: "created_at" } }
    );

    return user;
  }
}
export default mongoose.model("NewEmp", new AddEmployee()); // eslint-disable-line
