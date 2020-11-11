const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = admin.initializeApp();
const firestore = app.firestore();
const auth = app.auth();
const {PubSub} = require('@google-cloud/pubsub');
firestore.settings({timestampsInSnaphots : true});

const pubsub = new PubSub();
const registry = 'mylab';

exports.onState = functions.pubsub.topic('status').onPublish( async (message) => {
    const deviceId = message.attributes.deviceId;
    try{
        const deviceRef = firestore.doc(`registries/${registry}/devices/${deviceId}`);
        await deviceRef.set({
            'state' : message.json,
            'online': true,
            'timestamp': admin.firestore.Timestamp.now()
        });
    }catch(error){
        console.error(`${deviceId} not yet registered`);
    }
});

// exports.testState = functions.https.onRequest(async (req, res) => {
   
//     const msg = await pubsub.topic('status').publishJSON({
//         value: '23.5'
//     }, { deviceId: 'dev-1' });

//     res.json({
//         published: msg
//     })
// });
