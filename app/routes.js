import { isLoggedIn } from "./controllers/_utils";
import newCust from "../app/controllers/newCust";
const bcrypt = require('bcrypt');

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

  app.route("/customer-register")
    .post((req, res) => {
      let password = bcrypt.hashSync(req.body.password, 8);
      console.log(req.body)
      newCust.addEmp({
        custId: req.body.custId,
        name: req.body.name,
        emailId: req.body.emailId,
        password: password,
        address: req.body.address,
        contactNo: req.body.contactNo
      });
      res.send(password)
    })
};
