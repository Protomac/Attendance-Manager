import _ from 'lodash';
import { secret, errorObj, successObj } from "../../config/settings";
import CustSchema from "../models/customer";
const console = require("tracer").colorConsole();
const bcrypt = require('bcrypt');

const custCtrl = {
  add: data => {
    return new Promise(resolve => {
      let newEntity = new CustSchema();
      _.each(data, (val, key) => {
        if(key == "password"){
          let password = bcrypt.hashSync(data.password, 8);
          newEntity[key] = password
        } else {
          newEntity[key] = val
        }
      })
      newEntity.save(function (err) {
        if (err) {
          console.log(err);
        }
      });
    });
  },
  getById: (customerId) => {
    return new Promise((resolve) => {
      CustSchema.findOne({ customerId })
        .exec((err, data) => {

          if (!data) {
            return resolve({ ...errorObj, message: 'Customer not found', err })
          }

          return resolve({ ...successObj, data })

        })
    })
  },
  profileInfo: (id) => {
    return new Promise(resolve => {
      CustSchema.find({ _id: id }).exec(function (err, entity) {
        if (err || entity.length == 0) {
          console.log(err)
          resolve({ ...errorObj, error: true, message: "Cannot find customer", entity })
        }
        resolve({ ...successObj, error: false, message: "Customer found", entity })
      })
    })
  },
};


// custCtrl.add({
//   name: "CustSchema",
//   emailId: "CustSchema@gmail.com",
//   address: "G-3/36 Sector-7 Rohini Delhi-89",
//   contactNo: 1232067891
// });

export default custCtrl;
