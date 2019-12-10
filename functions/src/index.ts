import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.calendarEventPush = functions.pubsub.schedule('* * * * *').onRun((context) => {
   console.log('running');
   let ref = admin.database().ref('/users/' + 'R1CFRqnvsmdJtxIJZIvgF1Md0lr1' + '/devices');
    return ref.once("value", function(devices) {
    	devices.forEach(function(device) {
	         let payload = {
	              notification: {
	                  title: 'You have been invited to a trip.',
	                  body: 'Tap here to check it out!'
	              }
	         };
	         console.log('device' + device.val());
	         admin.messaging().sendToDevice(device.val(), payload)
	     });})
     }
);

