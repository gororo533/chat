var config = {
  apiKey: "AIzaSyD2GlScZ7mUiQg76WkNl2xUtZhF20AYb4A",
  authDomain: "blog0502-6a047.firebaseapp.com",
  projectId: "blog0502-6a047",
  storageBucket: "blog0502-6a047.appspot.com",
  messagingSenderId: "133967695248",
  appId: "1:133967695248:web:1db865c658f76b7619f715",
  measurementId: "G-J0T9NJV43Z"
};
firebase.initializeApp(config);
//firebase.firestore().settings( { timestampsInSnapshots: true });
var db = firebase.firestore();
//var database = firebase.database();


let upbtn = document.getElementById("upcreate");
let getbtn = document.getElementById("getoldoc");


function updateaccount() {
  console.log(firebase.auth().currentUser);
  let upname = document.getElementById("upname").value;
  let upemail = document.getElementById("upemail").value;
  //let uppassward = document.getElementById("uppassward").value;
  let user = firebase.auth().currentUser;
  user.updateProfile({
    displayName: upname,
    email: upemail
  }).then(() => {
    // Update successful
    // ...
    console.log("update suc");
    alert("update successful");
    document.location.href = "index.html";
  }).catch((error) => {
    // An error occurred
    // ...
    alert(error.message);

  });
  db.collection(`${user.email}`).doc("name").set({
    name: upname
  });
}


function set() {
  console.log("hi");
  let user = firebase.auth().currentUser;
  console.log(user);
  if (user.displayName === null) user.displayName = "";
  document.getElementById("upname").value = `${user.displayName}`;
  document.getElementById("upemail").value = `${user.email}`;
  document.getElementById("uppassward").value = `${user.password}`;
}



upbtn.addEventListener('click', updateaccount);
getbtn.addEventListener('click', set);
document.getElementById("upemail").addEventListener('keypress', function (event) {
  if (event.key === "Enter") {
    //enter的鍵值為13
    event.preventDefault();
    upbtn.click(); //觸動按鈕的點擊
  }
})

/*
X nstmm13@gmail.com 20220503
x gororo533@gmail.com 2101024
a a@gmail.com 123123

*/