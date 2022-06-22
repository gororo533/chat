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



let cabtn = document.getElementById("cacreate");
let rebtn = document.getElementById("retu");

function createaccount() {
  let caemail = document.getElementById("caemail").value;
  let capassward = document.getElementById("capassward").value;
  let caname = document.getElementById("caname").value;
  firebase.auth().createUserWithEmailAndPassword(caemail, capassward)
    .then(function (result) {
      alert("done!");

      return result.user.updateProfile({
        displayName: caname
      })
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('error=', errorMessage);
      alert(errorMessage);
    });
  //login(caemail,capassward);
  let user = firebase.auth().currentUser;
  //logout;
  //console.log("2", user);

}

function updatelist() {
  let caemail = document.getElementById("caemail").value;
  let caname = document.getElementById("caname").value;
  let tmparr;

  db.collection("manageID").doc("listID").get().then((doc) => {
    //更新list
    tmparr = doc.data().gororo533;
    tmparr.push(caemail);
    db.collection('manageID').doc('listID').set({
      gororo533: tmparr
    })
      .then(() => console.log('Document successfully updated!'))
    //登記各家email
    //console.log(tmparr , caemail);
    /*let ma = new Map([
      ["first", "none"]
    ]);
    db.collection("manageID").doc(`${caemail}`).set({
      ownlist: ma
    })*/
    
    


    for (let i = 0; i < tmparr.length - 1; i++) {
      let name = tmparr[i];
      let uuid = (Math.random()+1).toString();
      console.log(caemail);

      db.collection(`${caemail}`).doc(`${name}`).set({
        url: uuid
      });
      db.collection(`${name}`).doc(`${caemail}`).set({
        url: uuid
      });
      db.collection(`${uuid}`).doc("name").set({
        name1: caemail,
        name2: name
      })
    }
    db.collection(`${caemail}`).doc("name").set({
      name: caname
    });
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

  

}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    let caemail = document.getElementById("caemail").value;
    if (caemail !== "") updatelist();
    document.getElementById("caemail").value = "";
    document.getElementById("capassward").value = "";
    document.getElementById("caname").value = "";
    console.log("3", user);
  }
});

function returntoindex() {
  document.location.href = "index.html";
}

cabtn.addEventListener('click', createaccount);
rebtn.addEventListener('click', returntoindex);
document.getElementById("capassward").addEventListener('keypress', function (event) {
  if (event.key === "Enter") {
    //enter的鍵值為13
    event.preventDefault();
    cabtn.click(); //觸動按鈕的點擊
  }
})


function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("log out sus");
  }).catch((error) => {
    // An error happened.
    console.log(error);
  });
}
window.addEventListener("load", logout);

/*
X nstmm13@gmail.com 20220503
x gororo533@gmail.com 2101024
a a@gmail.com 123123

*/