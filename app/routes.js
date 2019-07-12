import { isLoggedIn } from "./controllers/_utils";
import custCtrl from "./controllers/customer";
import empCtrl from "./controllers/employee";
import TicketCtrl from "./controllers/ticket";
import Async from 'async'
import TicketSchema from "./models/tickets";
import moment from "moment";
const bcrypt = require('bcrypt');
const console = require("tracer").colorConsole();

export default (app, passport) => {
  app.get("/", (req, res) => {
    res.locals = {
      title: "Ayurveda",
      message: "Account"
    };
    res.render("index.ejs", { title: res.locals.title });
  });

  app.get("/profile", isLoggedIn, (req, res) =>
    res.render("profile.ejs", { user: req.user })
  );

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app
    .route("/login")
    .get((req, res) =>
      res.render("login.ejs", {
        message: req.flash("loginMessage"),
        title: "Login Page"
      })
    )
    .post(
      passport.authenticate("local-login", {
        successRedirect: "/profile", // redirect to the secure profile section
        failureRedirect: "/login", // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      })
    );

  app
    .route("/signup")
    .get((req, res) => {
      console.log(res);
      res.render("signup.ejs", {
        message: req.flash("signupMessage"),
        title: "Sign Up"
      });
    })
    .post(
      passport.authenticate("local-signup", {
        successRedirect: "/profile", // redirect to the secure profile section
        failureRedirect: "/signup", // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      })
    );

  app.route("/register/customer")
    .post(async (req, res) => {
      const customer = await custCtrl.add(req.body);
      res.send(customer)
    })

  app
    .route("/cust/:id/profile")
    .get(async (req, res) => {
      //get data from custCtrl profile
      const profile = await custCtrl.profileInfo(req.params.id)

      res.send(profile)
    })

  app
    .route("/customer/:id")
    .post(async (req, res) => {
      const addedTicket = await TicketCtrl.addTickets({ custId: req.params.id, updatedOn: new Date(), ...req.body });
      res.json(addedTicket);
    }
    );

  app
    .route("/tickets/:id")
    .get(async (req, res) => {
      const tickets = await TicketCtrl.listTickets({ custId: req.params.id });
      res.send(tickets)
    }
    );

  app
    .route("/customer/:id/dashboard")
    .get(async (req, res) => {
      const ticketDetails = await TicketCtrl.dashboard({ custId: req.params.id })
      const closedTickets = await TicketCtrl.listTickets({ custId: req.params.id, status: "C" })
      const activeTickets = await TicketCtrl.listTickets({ custId: req.params.id, status: "A" })
      const totalTickets = await TicketCtrl.listTickets({ custId: req.params.id });

      const ticketLength = {
        closed: closedTickets.data.length,
        active: activeTickets.data.length,
        total: totalTickets.data.length
      }
      ticketDetails.data = {
        ...ticketLength,
        tickets: [...ticketDetails.data]
      }

      res.send(ticketDetails);
    })

  app
    .route("/tickets/:id/:status")
    .get(async (req, res) => {
      const activeTickets = await TicketCtrl.listTickets({ custId: req.params.id, status: req.params.status })
      res.send(activeTickets);
    })

  // app
  //   .route("/customer/:id/:status")
  //   .get(async (req, res)=>{
  //     const closedTickets = await TicketCtrl.listTickets({custId: req.params.id, status : req.params.status})
  //     res.send(closedTickets);
  //   })

  app
    .route("/customer/:_id")
    .get(async (req, res) => {
      const ticketDetails = await TicketCtrl.listTickets({ _id: req.params._id })
      res.send(ticketDetails);
    })

  //====================================Employee routes====================================
  app
    .route("/register/employee")
    .get((req, res) => {
      res.render("create employee form")
    })
    .post(async (req, res) => {
      const addedEmp = await empCtrl.add(req.body);
      res.send(addedEmp);
    })

  app
    .route("/employee/:id/profile")
    .get(async (req, res) => {
      //get data from Ctrl profile
      let data = await empCtrl.profileInfo(req.params.id)
      res.send(data)
    })

  app
    .route("/employee/:id/dashboard")
    .get(async (req, res) => {
      const data = await TicketCtrl.dashboard({ empId: req.params.id })
      const assignedTickets = await TicketCtrl.count({ empId: req.params.id })
      const activeTickets = await TicketCtrl.count({ empId: req.params.id, status: "A" })
      const resolvedTickets = await TicketCtrl.count({ empId: req.params.id, status: "C" })
      const ticketsToday = await TicketCtrl.count({ empId: req.params.id, created_at: { $lte: moment().endOf('day'), $gte: moment().startOf('day') } });

      const ticketLength = {
        assigned: assignedTickets,
        active: activeTickets,
        resolved: resolvedTickets,
        today: ticketsToday,
      }
      res.send({ ...ticketLength, ...data });
    })

  app
    .route("/employee/:id/tickets")
    .get(async (req, res) => {
      const tickets = await TicketCtrl.listTickets({ empId: req.params.id });
      res.send(tickets)
    }
    );

  app
    .route("/employee/:id/:status")
    .get(async (req, res) => {
      const Tickets = await TicketCtrl.listTickets({ empId: req.params.id, status: req.params.status })
      res.send(Tickets);
    })

  app
    .route("/detailedticket/:_id/")
    .get(async (req, res) => {
      const ticketDetails = await TicketCtrl.listTickets({ _id: req.params._id })
      res.send(ticketDetails);
    })
    .put(async (req, res) => {
      let dataArr = []
      console.log(req.body)
      Async.each(req.body.id, (val, next) => {
        const changes = { ...req.body.changes, updatedOn: new Date() }
        console.log(val, changes)
        TicketCtrl.Update(val, changes).then((data)=>{
          console.log(data)
          dataArr.push(data)
          next()
        })
      }, () => {
        res.send(dataArr)
      })
    })
  //========================================================================================
};
