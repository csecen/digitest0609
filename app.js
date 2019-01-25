// Required setup for cloud firebase
var config = {
  apiKey: "AIzaSyAcbd-YB9qEnkyZ9hzBOeNARrv4kHk-ShY",
  authDomain: "digitest0609.firebaseapp.com",
  databaseURL: "https://digitest0609.firebaseio.com",
  projectId: "digitest0609",
  storageBucket: "digitest0609.appspot.com",
  messagingSenderId: "555386975552"
};
// Initialize the application
firebase.initializeApp(config);

// Create references to the objects in the html
const filmCount=document.querySelector("#count");
const addTextField=document.querySelector("#filmTitle");
const genreTextField=document.querySelector("#filmGenre");
const addButton=document.querySelector("#addButton");
const deleteTextField=document.querySelector("#deleteFilm");
const deleteButton=document.querySelector("#deleteButton");
const filmList=document.querySelector("#list");

// Create a reference to both the firestore database itself and the collection
// named films
var firestore = firebase.firestore();
const dbRef = firestore.collection("films");
const dbStats = firestore.collection("stats");


// A funciton where, when clicked, the add button added a new document
// and if need the collection itself
addButton.addEventListener("click", function() {
  const addedTitle=addTextField.value;
  const filmGenre=genreTextField.value;
  console.log("Genre: " + filmGenre);
  // Clears the text field
  var field = document.getElementById("filmTitle");
  field.value = "";

  // create data to be saved into the field in the document
  var data = {title:addedTitle, genre:filmGenre};

  // dbRef.doc(addedTitle).set(data).then(function(){
  dbRef.doc(addedTitle.replace(/ /g,"_")).set(data).then(function(){
    console.log("Film Added");
  }).catch(function(error){
    console.log("Error: ", error);
  });
});

// A funciton where, when clicked, the delete button deletes the document
// specified from the input
deleteButton.addEventListener("click", function() {
  const deletedTitle=deleteTextField.value;
  console.log("Title: " + deletedTitle);
  // Clears the text field
  var field = document.getElementById("deleteFilm");
  field.value = "";

  // Gets the document where the title matches the title specified
  var filmToDelete = dbRef.where("title", "==", deletedTitle);
  filmToDelete.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        doc.ref.delete();
    });
  }).catch(function(error) {
    console.log("Error: ", error);
  });
});

// Get the number of films in the list and displays the total in real time
dbStats.onSnapshot(function(snapshot) {
    dbStats.doc('count').get().then(function(docSnapshot) {
      if (docSnapshot.exists) {
        let count = docSnapshot.data().count;
        console.log(count);
        filmCount.innerText="Film Count: " + count;
      }
    });
});

// list all of the Films
function listFilms(doc) {
  let li = document.createElement("li");

  li.setAttribute('data-id', doc.id);
  li.textContent = doc.data().title;

  list.appendChild(li);
}

// Real time film list, displays all the films in the firestore collection
// and updates realtime if any changes are made
dbRef.orderBy("title").onSnapshot(snapshot => {
  // Keeps track of the document changes
  let changes = snapshot.docChanges();

  // Goes through all changes
  changes.forEach(change => {
    if (change.type == "added") {
        listFilms(change.doc);
    } else if (change.type == "removed") {
      // Removes from the list
      let li = filmList.querySelector("[data-id=" + change.doc.id + "]");
      filmList.removeChild(li);
    }
  });
});
