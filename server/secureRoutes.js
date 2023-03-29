const express = require("express");
const passport = require("passport");
const router = express.Router();
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculate-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

router.all("*", function (req, res, next) {
    passport.authenticate("jwt", { session: false }, function (err, user, info) {
    
    // Invalid token

    if (info) {
      console.log(
        "Error occured because the token was either invalid or not present."
      );
     
      return res.send(info.message);
 
    }
  
    // successful validation
    if (user) {
     
      console.log("req.login? ", req.login);
      req.isAuthenticated = true;
      req.user = user;
      return next();
    }
  })(req, res, next);
});

router.get("/profile", (req, res, next) => {

  res.json({
    user:req.user,
    message:"You have made it to through the secure route.Please route to calculation methods after this page...",
   
  });
});



//calculator microservice code goes from here onwards :

const add= (n1,n2) => {
    return n1+n2;
}
router.get("/profile/add", (req, res, next) => {
    
    
   try{
    const n1= parseFloat(req.query.n1);
    const n2=parseFloat(req.query.n2);
    if(isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 incorrectly defined");
    }
    if(isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 incorrectly defined");
    }
    
    if (n1 === NaN || n2 === NaN) {
        console.log()
        throw new Error("Parsing Error");
    }
    logger.info('Parameters '+n1+' and '+n2+' received for addition');
    const result = add(n1,n2);
    res.status(200).json({statuscocde:200, "Addition is": result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
});

//sub
const sub= (n1,n2) => {
    return n1-n2;
  }
  router.get("/profile/sub", (req,res)=>{
    try{
    const n1= parseFloat(req.query.n1);
    const n2=parseFloat(req.query.n2);
    if(isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 incorrectly defined");
    }
    if(isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 incorrectly defined");
    }
    
    if (n1 === NaN || n2 === NaN) {
        console.log()
        throw new Error("Parsing Error");
    }
    logger.info('Parameters '+n1+' and '+n2+' received for subtraction');
    const result = sub(n1,n2);
    res.status(200).json({statuscocde:200, "Subtraction is": result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
  });
  
  
  
  //multi :
  const multi= (n1,n2) => {
  return n1*n2;
  }
  router.get("/profile/multi", (req,res)=>{
  try{
  const n1= parseFloat(req.query.n1);
  const n2=parseFloat(req.query.n2);
  if(isNaN(n1)) {
      logger.error("n1 is incorrectly defined");
      throw new Error("n1 incorrectly defined");
  }
  if(isNaN(n2)) {
      logger.error("n2 is incorrectly defined");
      throw new Error("n2 incorrectly defined");
  }
  
  if (n1 === NaN || n2 === NaN) {
      console.log()
      throw new Error("Parsing Error");
  }
  logger.info('Parameters '+n1+' and '+n2+' received for multiplication');
  const result = multi(n1,n2);
  res.status(200).json({statuscocde:200, "Multiplication is": result }); 
  } catch(error) { 
      console.error(error)
      res.status(500).json({statuscocde:500, msg: error.toString() })
    }
  });
  
  
  //div:
  const div= (n1,n2) => {
    return n1/n2;
  }
  router.get("/profile/div", (req,res)=>{
    try{
    const n1= parseFloat(req.query.n1);
    const n2=parseFloat(req.query.n2);
    if(isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 incorrectly defined");
    }
    if(isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 incorrectly defined");
    }
    
    if (n1 === NaN || n2 === NaN) {
        console.log()
        throw new Error("Parsing Error");
    }
    logger.info('Parameters '+n1+' and '+n2+' received for division');
    const result = div(n1,n2);
    res.status(200).json({statuscocde:200, "Division is": result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
  });

module.exports = router;




