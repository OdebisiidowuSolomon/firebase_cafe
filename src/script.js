// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  doc as Doc,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0BEulX2WI3V7TK2NE4BwT_27LCIN1PDc",
  authDomain: "firestore-cafe-fadfb.firebaseapp.com",
  projectId: "firestore-cafe-fadfb",
  storageBucket: "firestore-cafe-fadfb.appspot.com",
  messagingSenderId: "834778689636",
  appId: "1:834778689636:web:54712561729e52c872ef71",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var db = getFirestore(app);
let update = false;
let modId;

const cafeList = document.querySelector("#cafe-list");
const button = document.querySelector("button");
const form = document.querySelector("form");

function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");
  let modif = document.createElement("span");

  li.setAttribute("data-id", doc.id);
  modif.classList.add("modif");
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";
  modif.textContent = "edit";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
  li.appendChild(modif);

  cafeList.appendChild(li);

  // Deleting Data
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    deleteDoc(Doc(db, "cafes", id));
  });

  // modify Data
  modif.addEventListener("click", (e) => {
    modId = e.target.parentElement.getAttribute("data-id");
    getDoc(Doc(db, "cafes", modId)).then((doc) => {
      form.name.value = doc.data().name;
      form.city.value = doc.data().city;
      update = true;
      button.textContent = "Update Cafe";
    });
  });
}

// Getting data
// const q = query(
//   collection(db, "cafes"),
//   orderBy("name")
//   // where("name", "==", "Zenith")
// );
// getDocs(q).then((snapShot) => snapShot.forEach((doc) => renderCafe(doc)));

// Storing Data

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!update) {
    const { name, city } = form;

    if (city.value && name.value) {
      try {
        addDoc(collection(db, "cafes"), {
          city: city.value,
          name: name.value,
        }).then((e) => {
          name.value = "";
          city.value = "";
        });
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    if (form.name.value || form.city.value) {
      const set = Doc(db, "cafes", modId);

      updateDoc(set, {
        name: form.name.value,
        city: form.city.value,
      }).then((res) => {
        button.textContent = "Add Cafe";
        form.name.value = "";
        form.city.value = "";
        update = false;
      });
    }
  }
});

const q = query(
  collection(db, "cafes"),
  orderBy("name")
  // where("name", "==", "Zenith")
);

const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      renderCafe(change.doc);
    } else if (change.type === "removed") {
      let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
      cafeList.removeChild(li);
    } else if (change.type === "modified") {
      let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");

      li.querySelectorAll("span")[0].textContent = change.doc.data().name;
      li.querySelectorAll("span")[1].textContent = change.doc.data().city;
    }
  });
});
