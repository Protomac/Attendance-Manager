import _ from 'lodash'
import TicketSchema from "../models/tickets";
import { errorObj, successObj } from "../../config/settings";

const console = require("tracer").colorConsole();
const moment = require("moment");

const TicketsCtrl = {
  addTickets: (data) => {
    return new Promise(resolve => {
      let newEntity = new TicketSchema();
      _.each(data, (val, key) => {
          newEntity[key] = val
      })

      newEntity.save(function(err) {
        if (err) {
          console.log(err);
          resolve({...errorObj, message:"Ticket unable to create."})
        }
        resolve({...successObj, data :  newEntity})
      });
    });
  },
  listTickets: (data) => {
    return new Promise(resolve => {

      let tickets = TicketSchema.find(data);

      tickets.exec(function(err, ticket) {
        if (err) {
          return resolve({...errorObj,message:"Ticket not found",err})
        };
        if(!ticket.length){
          return resolve({...errorObj,message:"Ticket not found"})
        }
        return resolve({ ...successObj, data : ticket });
      });
    });
  },
  dashboard : (data) => {
    return new Promise (( resolve) => {
      let recentTickets = TicketSchema.find(data);
      let today = moment().endOf('day');
      let startDate = moment().subtract(7, 'days')

      recentTickets.where({created_at : {$lte : today}})
      recentTickets.where({created_at : {$gte : startDate}})
      recentTickets.lean()

      recentTickets.exec(function(err, tickets) {
        if (err) {
          return resolve({...errorObj,message:"Tickets not found",err})
        };
        if(!tickets.length){
          return resolve({...errorObj,message:"Tickets not found"})
        }
        return resolve({ ...successObj, data : tickets });
      });    })
  },
  count : (data) => {
    return new Promise ((resolve) => {
      TicketSchema.count(data, (err, count)=>{
        if (err) {
          return resolve(err)
        }
        return resolve(count)
      })
    })
  },
};

export default TicketsCtrl;
