const accountSid = 'AC50f65b1ef22dd55a026ac0ee57653e6c';
const authToken = '0a74948355a4022b9d0a287953111005';

const twilio = require ('twilio');
var client = new twilio(accountSid, authToken);
module.exports.smsOTP = (options) => {
  console.log(options.phoneNumber)
  client.messages.create({
    body: `Node-Express: Your OTP  ${options.otp}`,
    to:'+919944475589',  // Text this number
    from: '+18652343311' // From a valid Twilio number
  })
   .then(() => {
      //console.log(messages.sid);
   })
   .catch(() => {
     //console.log(err);
   });
}


