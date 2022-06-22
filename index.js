/*-----------------------firebase contect------------------------------*/ 
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
var db = firebase.firestore();
/*-------------------------global var------------------------------------*/ 
let currentobject = "";
let currentuuid = "";
let unsubscribe = 0;
/*--------------------------監聽帳號--------------------------------------*/
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    /*----------------------sign in -------------------------*/
    //profile..................................................
    console.log(user);
    let privacy = document.getElementById("privacy");
    privacy.innerHTML = `
      
      <p>Hi~ ${user.displayName}</p>
      <button id="updatebtn">Update profile</button>
      <button id="logoutbtn">log out</button>
      
    `;
    setdarkmode();

    let logoutbtn = document.getElementById("logoutbtn");
    logoutbtn.addEventListener("click", logout);
    let updatebtn = document.getElementById("updatebtn");
    updatebtn.addEventListener("click", function () {
      document.location.href = "chat-auth-updateaccount.html";
    });
    //friends....................................................
    let friends = document.getElementById("friends");
    db.collection("manageID").doc("listID").get().then((doc) => {
      let list = doc.data().gororo533;
      for (i of list) {
        (function () {
          if (i !== user.email) { //沒有自己傳給自己的選項
            //set html of friends................................
            let newchild = document.createElement("p");
            newchild.setAttribute("id", i);
            newchild.setAttribute("class", "friendbox");
            db.collection(`${i}`).doc("name").get().then(doc => {
              newchild.innerHTML = `${doc.data().name}`;
            })
            friends.appendChild(newchild);
            console.log(i, doc.data().name);

            //set event of friend................................
            let x = document.getElementById(i);
            x.addEventListener("click", function () {
              currentobject = `${x.id}`;
              db.collection(`${x.id}`).doc(`${user.email}`).get().then((doc) => {
                console.log(`3 ${x.id} ${user.email}`, doc.data());

                //set input area ...............................
                let inputfield = document.getElementById("inputfield");
                inputfield.innerHTML = `
                <textarea id="inputvu"></textarea>
                <button id="inputsent">sent</button>
                `
                //set input area sent...............................
                sentmove();
                let chating = document.getElementById("chatingfield");
                chating.innerHTML = "";
                chating.style = "overflow-y: scroll";

                //record currentuuid
                let uuid = doc.data().url;
                currentuuid = `${uuid}`;
                
                //off the old onsnapshot
                
                if (unsubscribe!==0){
                  console.log("cancel")
                  unsubscribe();
                }
                // set chat area html...............................
                unsubscribe = db.collection(`${uuid}`).orderBy("time").onSnapshot(querySnapshot => {
                  querySnapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                      console.log("added");
                      if (change.doc.data().name === user.email) {
                        chating.innerHTML += `
                          <p  id="${doc.id}123" class="chatarea text-right right">${change.doc.data().infotmation}</p>
                      `}
                      else {
                        chating.innerHTML += `
                        <p  id="${doc.id}123" class="chatarea text-left left">${change.doc.data().infotmation}</p>
                      ` }                    
                      let chatingfield = document.getElementById("chatingfield");
                      chatingfield.scrollTop = chatingfield.scrollHeight;//使卷軸跑到最底
                    }
                  });
                });
              }).catch((error) => {
                console.log("cant get uuid", error);
              });
            })
          }
        })()
      }
    }).catch((error) => {
      console.log("cant get list", error);
    });
  } else {
    /*----------------------sign out -------------------------*/
    //profile..................................................
    let privacy = document.getElementById("privacy");
    privacy.innerHTML += `
   
    <p>User email</p>
    <input id="logemail"></input>
    <p>User passward</p>
    <input id="logpassward">
    <button id="loginbtn">log in</button>
    <a href="chat-auth-createaccount.html">register</a>
    <br>

    `;
    setdarkmode();

    let loginbtn = document.getElementById("loginbtn");
    loginbtn.addEventListener("click", prelogin);
    let logemail = document.getElementById("logemail");
    let logpassward = document.getElementById("logpassward");
    logemail.addEventListener('keypress', function (event) {
      if (event.key === "Enter") {
        //enter的鍵值為13
        event.preventDefault();
        console.log("pressm");
        loginbtn.click();//觸動按鈕的點擊
      }
    })
    logpassward.addEventListener('keypress', function (event) {
      if (event.key === "Enter") {
        //enter的鍵值為13
        event.preventDefault();
        console.log("pressp");
        loginbtn.click();//觸動按鈕的點擊
      }
    })

    //set friends html
    let friends = document.getElementById("friends");
    friends.innerHTML = "<h1>friends</h1>";

  }
});

/*log in */
function prelogin() {
  let logemail = document.getElementById("logemail").value;
  let logpassward = document.getElementById("logpassward").value;
  login(logemail, logpassward);
}

function login(email, passward) {
  if (firebase.auth().currentUser !== null) logout;
  firebase.auth().signInWithEmailAndPassword(email, passward)
    .then((userCredential) => {
      // Signed in
      console.log("log in sus");
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      alert(errorCode);
    });
}

function logout() {
  let chatingfield = document.getElementById("chatingfield");
  chatingfield.innerHTML = "";
  chatingfield.style = "overflow-y: hidden";

  let inputfield = document.getElementById("inputfield");
  inputfield.innerHTML = "";


  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("log out sus");
  }).catch((error) => {
    // An error happened.
    console.log(error);
  });
}

function sentmove() {
  let inputvu = document.getElementById("inputvu");
  inputvu.addEventListener("keydown", function (event) {
    //console.log(event.key);
    if (event.key === "Enter") {
      if(!event.shiftKey){
        event.preventDefault();
        document.getElementById("inputsent").click();
      } 
      else{
        inputvu.style.height = '100px';
        inputvu.style.height = event.target.scrollHeight + 'px';
      }
    }
  })
  inputvu.addEventListener("keydown", function (event) {
    if (event.key === "Backspace") {
        inputvu.style.height = '100px';
        inputvu.style.height = event.target.scrollHeight + 'px';
      }
    }
  )

  let inputsent = document.getElementById("inputsent");
  console.log("yes", inputsent);
  inputsent.addEventListener("click", function () {
    console.log(currentobject, currentuuid);
    let inputvu = document.getElementById("inputvu");
    
    if (inputvu.value !== null && inputvu.value !== "" && inputvu.value.replace(/(^s*)|(s*$)/g, "").length !== 0) {
      /*for(let i = 0;i<inputvu.value.length;i++){
        if(inputvu.value.charCodeAt(i) === 10){

        }
      }*/
      let newinput = inputvu.value.replace(/\n/g,'<br>');
      let newtime = new Date();
      let user = firebase.auth().currentUser;
      db.collection(`${currentuuid}`).doc().set({
        infotmation: newinput,
        time: newtime,
        name: user.email
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
        alert("something goes wrong when you sent text...", error.Message);
      });
      inputvu.value = "";
    }
  })
}

/*dark mode event */
let colorarr = ["white" , "black"];
let colortime = 0;
function setdarkmode(){
  let darkmode = document.getElementById("darkmode");
  console.log(typeof(darkmode));
  darkmode.addEventListener("click" , function (){

    colortime++;
    let pe = document.querySelectorAll("p");
    for(i of pe)i.style = `color: ${colorarr[(colortime+1)%2]}`;
    let h = document.querySelectorAll("h1");
    for(i of h)i.style = `color: ${colorarr[(colortime+1)%2]}`;
    let c = document.getElementById("chating");
    let pr = document.getElementById("profile");
    c.style = `border-left: 1px solid ${colorarr[(colortime+1)%2]};`;
    pr.style = `border-left: 1px solid ${colorarr[(colortime+1)%2]};`;
    let html = document.querySelector("html");
    document.body.style.background= `${colorarr[(colortime)%2]}`;
    document.getElementById("foo").style= `border-top: 1px solid ${colorarr[(colortime+1)%2]};`;
    
  })
}


window.addEventListener("load", function () {
  let chatingfield = document.getElementById("chatingfield");
  chatingfield.innerHTML = "";
  chatingfield.style = "overflow-y: hidden";
  
})