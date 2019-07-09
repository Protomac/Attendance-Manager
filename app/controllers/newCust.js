import express from "express";
import { secret, errorObj, successObj } from "../../config/settings";
import customer from "../models/customerModel";
const console = require("tracer").colorConsole();

const custCtrl = {
  msgg: "hello",
  addEmp: data => {
    return new Promise(resolve => {
      let newUser = new customer({
        custId: data.custId,
        name: data.name,
        emailId: data.emailId,
        password: data.password,
        address: data.address,
        contactNo: data.contactNo
      });
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    });
  },
  listEmp: () => {
    newEmployee.find({}).exec(function(err, users) {
      if (err) throw err;
      console.log(users);
    });
  }
};


// custCtrl.addEmp({
//   custId: 1,
//   name: "Customer",
//   emailId: "customer@gmail.com",
//   address: "G-3/36 Sector-7 Rohini Delhi-89",
//   contactNo: 1232067891
// });


// empCtrl.listEmp();

export default custCtrl;
