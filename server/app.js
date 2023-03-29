const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const passport=require("passport");
const localStrategy=require("passport-local").Strategy;
const users=require("./users.json");
const bcrypt =require("bcrypt");
const fs = require("fs");
const {v4:uuidv4} =require("uuid");
const JWTstrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const Token = require("./Token.json");
const secureRoutes= require("./secureRoutes");

//frontend
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize()); //jwt strategy for verifying tokens created in signup
app.use("/user",secureRoutes);

function getJwt() {
  console.log("in function getJwt()");
  return Token.Authorization?.substring(7); // remove the "Bearer " from the token.
}

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "TOP_SECRET",
      jwtFromRequest: getJwt,
    },
    async (token, done) => {
      console.log("in jwt strat. token: ", token);
      // Successfully  validated user:
      return done(null, token.user);
    }
  )
);

passport.use(
    "login",
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
      
        try {

          const user = users.find((user) => user.email === email);
  
          if (!user) {
            return done("Email not found!! Please go back and enter correct email", false);
          }
  
          const passwordMatches = await bcrypt.compare(password, user.password);
  
          if (!passwordMatches) {
            return done("Incorrect password!! Please go back and enter correct password", false);
          }
  
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );


  passport.use(
    "signup",
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
            try {
            if (password.length <= 4 || !email) {
                done(null, false, {
                message: "Please enter a password of length more than 4 digits..",
                });
            } else {
                const hashedPass = await bcrypt.hash(password, 10);
                let newUser = { email, password: hashedPass, id: uuidv4() };
                users.push(newUser);
                await fs.writeFile("users.json", JSON.stringify(users), (err) => {
                if (err) return done(err); // or throw err;
                console.log("updated the database");
                });
    
                done(null, newUser);
            }
            } catch (err) {
            return done(err);
            }
      }
    )
  );

  

app.get("/",(req,res)=>{
   //always route to signup first
    res.redirect("/signup");
});

app.get("/logout", async (req, res) => {

    res.redirect("/login");
  });

app.get("/login",async(req,res)=>{
    res.render("login");
});

app.get("/signup",async(req,res)=>{
    res.render("signup");
});


app.post(
    "/login",
     async (req, res, next) => {

    passport.authenticate("login", async (error, user, info) => {
      console.log("error: ", error, "user: ", user, "info: ", info);

      if (error) {
        return next(error);
      }

    const body = { _id: user.id, email: user.email };
    const token = jwt.sign({ user: body }, "TOP_SECRET");

    await fs.writeFile(
      "Token.json",
      JSON.stringify({ Authorization: `Bearer ${token}` }),
      (error) => {
        if (error) throw error;
      }
    );

    return  res.redirect("/user/profile");
   
    })(req, res, next);
  });


app.post("/signup", async function (req, res, next) {
  passport.authenticate("signup", async function (error, user, info) {
    if (error) {
      return next(error);
      
    }

    const body = { _id: user.id, email: user.email };
    const token = jwt.sign({ user: body }, "TOP_SECRET");

    await fs.writeFile(
      "Token.json",
      JSON.stringify({ Authorization: `Bearer ${token}` }),
      (err) => {
        if (err) throw err;
      }
    );

    return  res.redirect("/login");
   
  })(req, res, next);
});

app.listen(3000, () => {
    console.log("server listening on localhost:3000");
  });