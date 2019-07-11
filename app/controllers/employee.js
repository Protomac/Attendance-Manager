import _ from 'lodash'
import EmpSchema from '../models/employee'
import { errorObj, successObj } from '../../config/settings'
const bcrypt = require('bcrypt');

const empCtrl = {
  add: (data) => {
    return new Promise((resolve) => {
      let newEntity = new EmpSchema();
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
          return resolve({...errorObj, message: 'Unable to save employee', err})
        }

        return resolve({...successObj, message: 'Employee added successfully', data})

      })
    })
  },
  getById: (employeeId) => {
    return new Promise((resolve) => {
      EmpSchema.findOne({employeeId})
               .exec((err, data) => {

                 if (!data) {
                   return resolve({...errorObj, message: 'Employee not found', err})
                 }

                 return resolve({...successObj, data})

               })
    })
  },
  profileInfo: (id) => {
    return new Promise(resolve => {
      EmpSchema.find({ empId: id }).exec(function (err, data) {
        if (err || data.length == 0) {
          resolve({ ...errorObj, message: "cannot find employee", err })
        }
        resolve({ ...successObj, message: "employee found", data })
      })
    })
  },
}

export default empCtrl
