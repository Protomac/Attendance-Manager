import mongoose, { Schema } from "mongoose";

class AddEmployee extends Schema {
  constructor() {
    const user = super(
      {
        empId: { type: Number, unique: true },
        check: { type: String, enum: ['emp', 'admin'], default: 'emp' },
        name: { type: String },
        emailId: { type: String, unique: true },
        password: { type: String },
        contactNo: { type: Number, unique: true },
        address: { type: String },
        gender: { type: String },
        salary: { type: Number },
        joiningDate: { type: Date },
      },
      { timestamps: { createdAt: "created_at" } }
    );

    return user;
  }
}
export default mongoose.model("employee", new AddEmployee()); // eslint-disable-line

