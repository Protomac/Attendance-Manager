import { isLoggedIn } from "./controllers/_utils";
import custCtrl from "./controllers/customer";
import custSchema from "../app/models/customerModel";
const bcrypt = require('bcrypt');
import TicketCtrl from "./controllers/ticket";


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
      let password = bcrypt.hashSync(req.body.password, 8);
      //check if id exist in database if yes => Show already exist
      if (
        await custSchema.findOne({ emailId: req.body.emailId })
        ||
        await custSchema.findOne({ contactNo: req.body.contactNo })
        ) {
        res.send("Entity already present")
        return;
      }
      
      custCtrl.add({
        name: req.body.name,
        emailId: req.body.emailId,
        password: password, 
        address: req.body.address,
        contactNo: req.body.contactNo
      });
      res.send('Entity created')
    })

  app
    .route("/customer/:id")
    .post(async (req, res) => {
      const addedTicket = await TicketCtrl.addTickets({ custId: req.params.id, ...req.body });
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
    .get(async (req, res)=>{
       const ticketDetails = await TicketCtrl.dashboard({custId: req.params.id})
       const closedTickets = await TicketCtrl.listTickets({custId: req.params.id, status : "C"})
       const activeTickets = await TicketCtrl.listTickets({custId: req.params.id, status : "A"})
       const totalTickets = await TicketCtrl.listTickets({ custId: req.params.id });
 
       const ticketLength = {
         closed: closedTickets.data.length,
         active : activeTickets.data.length,
         total : totalTickets.data.length
       }
       const data = {
         ...ticketDetails,
         ...ticketLength
       }
       res.send({data});
     })

  app
    .route("/tickets/:id/:status")
    .get(async (req, res)=>{
      const activeTickets = await TicketCtrl.listTickets({custId: req.params.id, status : req.params.status})
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
    .get(async (req, res)=>{
      const ticketDetails = await TicketCtrl.listTickets({_id : req.params._id})
      res.send(ticketDetails);
    })

  

};
