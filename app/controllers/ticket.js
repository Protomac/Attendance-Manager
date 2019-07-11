import TicketSchema from "../models/tickets";
import { secret, errorObj, successObj } from "../../config/settings";

const console = require("tracer").colorConsole();
const moment = require("moment");

const TicketsCtrl = {
  addTickets: (data) => {
    return new Promise(resolve => {
      let newEntity = new TicketSchema();

        newEntity.title= data.title
        newEntity.description= data.description
        newEntity.reason= data.reason
        newEntity.custId= data.custId
        newEntity.empId= data.empId
        newEntity.status = data.status

      newEntity.save(function(err) {
        if (err) {
          console.log(err);
          resolve({...errorObj, message:"Ticket unable to create."})
        }
        resolve({...successObj, newEntity})
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
        return resolve({ ...successObj, ticket });
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

      recentTickets.exec(function(err, ticket) {
        if (err) {
          return resolve({...errorObj,message:"Tickets not found",err})
        };
        if(!ticket.length){
          return resolve({...errorObj,message:"Tickets not found"})
        }
        return resolve({ ...successObj, ticket });
      });    })
  }
};

export default TicketsCtrl;
