import express from 'express'
import request from 'request'
import _ from 'lodash'
import ordinal from 'ordinal'
import pluralize from 'pluralize'
import capitalize from 'capitalize'
import Async from 'async'
import AttendanceSchema from '../models/attendances'
import EmpCtrl from '../controllers/employee'
import { errorObj, successObj } from '../../config/settings'
import { setDateTime, DATE_FORMAT } from './_utils'
import MachineConfig from './../../config/machineConfig.json'

const newEmployee = {
  length: 'Please change me',
}

const console = require('tracer')
  .colorConsole()

const moment = require('moment')
const schedule = require('node-schedule')

const emp = {
  msgg: 'hello',
  add: (user, machineId) => {
    return new Promise((resolve) => {

      const dateNtime = setDateTime(user.date, user.time)

      const todayStart = moment(user.date, DATE_FORMAT).startOf('day')
      const todayEnd = moment(user.date, DATE_FORMAT).endOf('day')

      AttendanceSchema.findOne({employeeId: user.employeeId})
        .where({date: {$gte: todayStart}})
        .where({date: {$lt: todayEnd}})
        .exec(async function (err, result) {

          if (result) {
            if (user.type === 'OUT') {
              console.log('OUT')
              result.outTime = dateNtime
              result.save(function (err) {
                if (err) {
                  return resolve({...errorObj, message: 'Unable to Save attendance', err})
                }

                return resolve({...successObj, message: 'Saved attendance successfully'})

              })
            }

          }

          const newUser = new AttendanceSchema()

          newUser.employeeId = user.employeeId
          newUser.inTime = dateNtime
          newUser.date = new Date()
          newUser.machineId = machineId

          newUser.save((err) => {
            if (err) {
              return resolve({...errorObj, message: 'Unable to Save attendance', err})
            }

            return resolve({...successObj, message: 'Saved attendance successfully'})

          })

        })
    })
  },
  getRequest: ({url, machineId = 1}) => {
    return new Promise((resolve) => {
      request(url, async (error, response, body) => {
        if (error) {
          resolve({...errorObj})
        }
        const recordBody = await emp.bodyToJson(body)
        Async.eachLimit(recordBody, 10, (value, done) => {
          console.log('yess', value)
          emp.add(value, machineId)
            .then(() => {
              done()
            })
        })
        resolve({recordBody, ...successObj})
      })
    })
  },
  getAttendance: ({machineId, start, end}) => {
    return new Promise((resolve) => {
      console.log('IN getAttendance')

      const startDate = moment(start)
        .startOf('day')
        .toDate()

      const endDate = moment(end)
        .endOf('day')
        .toDate()

      const query = AttendanceSchema.find()
      query.where({machineId})
      query.where({date: {$gte: startDate}})
      query.where({date: {$lt: endDate}})

      query.exec((err, docs) => {
        if (err) {
          return resolve({...errorObj, err})
        }

        resolve({...successObj, docs})
      })
    })
  },

  getReport: async (machine, start, end) => {
    const {machineId} = machine
    const {docs} = await emp.getAttendance({machineId})
    let {openingTime} = machine

    const temp = openingTime.split(':')

    openingTime = moment()
      .startOf('day')
      .add(temp[0], 'hour')
      .add(temp[1], 'minute')
      .add(temp[2], 'second')
    console.log(openingTime)

    const late = []
    const onTime = []
    let msg = ''

    Async.each(docs, (value, done) => {
        const isLate = moment(value.inTime)
          .isAfter(openingTime)
        console.log(isLate, value.inTime)
        if (isLate) {
          console.log(value.employeeId)
          const minutes = moment(value.inTime)
            .diff(
              moment(openingTime),
              'minute',
            )
          value.minutes = minutes

          late.push(value)
        } else {
          onTime.push(value)
        }

        done()
      },
      () => {
        msg = `${docs.length} are present out of ${
          newEmployee.length
          } of ${ordinal(machineId)} machine.\n`
        msg += `${onTime.length} out of ${docs.length} are on time.\n`
        Async.each(
          late,
          async (item, done) => {
            const {data: {name}} = await EmpCtrl.getById(item.employeeId)
            msg += `${capitalize(name)} is ${item.minutes} ${pluralize('minute')} late.\n`
            done()
          }, () => {
            console.log(msg)
          },
        )
      },
    )
  },
  bodyToJson: (data) => {
    data = data.replace('"', '')
    data = data.replace('"', '')
    data = data.split('\\r\\n')
    data = data.map((item) => {
      const newItem = item.split(',')
      return {
        employeeId: newItem[0],
        date: newItem[1],
        time: newItem[2],
        type: newItem[3],
      }
    })
    return _.filter(data, x => !!x.employeeId)
  },
}

const runMyCode = () => {
  schedule.scheduleJob('*/20 * * * * *', function () {
    runMachineConfigs()
  })
}

const runMachineConfigs = () => {
  Async.each(MachineConfig, (machine) => {
    console.log(machine.url, machine.machineId)
    emp.getRequest({
      url: machine.url,
      machineId: machine.machineId,
    })
  })
}

runMachineConfigs()

// runMyCode()


export default emp
