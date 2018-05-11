const config  = require ('../../config');
firebase =  require('firebase');     

authy = require('authy')(config.authy.api_key);
twilioClient = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
       
fireBaseConfig = { 
  databaseURL: "https://xxx-f437f.firebaseio.com",
  serviceAccount: "./config/xxx-xxx.json", 
// add service account credentials from firebase(config/xxx-xxx.json)
  databaseAuthVariableOverride : {
    uid: "82838324"
  }
    
}
firebase.initializeApp(fireBaseConfig)

module.exports = function isAuthorized (req, res, next){
    firebase.auth().verifyIdToken(req.headers['authorization']).then((decodedToken) => {
      uid = decodedToken.sub
      return next() 
    }).catch((error)=>{
      console.log(error);  
    });
}


module.exports = firebase;

