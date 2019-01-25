const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


// const firebase = require('../app.js');
//
// var firestore = firebase.firestore();
// const dbStats = firestore.collection("stats");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Fires when there is a new document created in the films collection
// Adds one to the total count of films into the stats collections or creates
// the stats collection if it has not already been created
exports.countOnCreate = functions.firestore
    .document('films/{filmId}')
    .onCreate((snap, context) => {

      const dbStats = admin.firestore().collection("stats");

      const countRef = dbStats.doc('count')
      return countRef.get().then(function(docSnapshot) {
        const newCount = docSnapshot.exists ? Number(docSnapshot.data().count) + 1 : 1
        countRef.set({
          count:newCount
        });
        return newCount
      });
    });

// Fires when a document is deleted. Subtracts one from the total in the
// stats collection
exports.countOnDelete = functions.firestore
    .document('films/{filmId}')
    .onDelete((snap, context) => {

      const dbStats = admin.firestore().collection("stats");

      const countRef = dbStats.doc('count')
      return countRef.get().then(function(docSnapshot) {
        const newCount = Number(docSnapshot.data().count) - 1
        countRef.set({
          count:newCount
        });
        return newCount
      });
    });
