import _ from 'lodash'
import EmpSchema from '../models/employee'
import { errorObj, successObj } from '../../config/settings'

const empCtrl = {
  add: (data) => {
    return new Promise((resolve) => {
      let newEntity = new EmpSchema()
      _.each(data, (val, key) => {
        newEntity[key] = val
      })
      newEntity.save(function (err) {
        if (err) {
          return resolve({...errorObj, message: 'Unable to save employee', err})
        }

        return resolve({...successObj, message: 'Employee added successfully'})

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
}

export default empCtrl
