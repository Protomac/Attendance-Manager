import _ from 'lodash';
import { secret, errorObj, successObj } from "../../config/settings";
import custSchema from "../models/customer";
const console = require("tracer").colorConsole();
const bcrypt = require('bcrypt');

const custCtrl = {
  add: data => {
    return new Promise(resolve => {
      let newEntity = new custSchema();
      _.each(data, (val, key) => {
        if(key == "password"){
          let password = bcrypt.hashSync(data.password, 8);
          newEntity[key] = password
        } else {
          newEntity[key] = val
        }
      })
      newEntity.save(function (err, data) {
        if (err) {
          console.log(err);
          return resolve({...errorObj, message:"Customer unable to save.",err})
        }
        return resolve({...successObj, data})
      });
    });
  },
  getById: (customerId) => {
    return new Promise((resolve) => {
      custSchema.findOne({ customerId })
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
      custSchema.find({ custId: id }).exec(function (err, entity) {
        if (err || entity.length == 0) {
          console.log(err)
          resolve({ ...errorObj, error: true, message: "cannot load the profile", err })
        }
        resolve({ ...successObj, error: false, message: "Profile found", data: entity })
      })
    })
  },
};




export default custCtrl;
