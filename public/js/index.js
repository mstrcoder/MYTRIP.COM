// console.log("Hello from parcel!");
//this is entry file
import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { showAlert } from "./alert";
import { updateData } from "./updateSettings";
import {bookTour1}  from './stripe'
import {signup} from './signup'
//DOM elements
const mapBox = document.getElementById("map");
// console.log('index.js');
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".nav__el--logout");
const updateDataa = document.querySelector(".form-user-data");
const updatePass = document.querySelector(".form-user-password ");
const bookTour=document.getElementById('book-tour')
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById("map").dataset.locations
  );
  console.log(locations);
  displayMap(locations);
}

if (loginForm) {
  // console.log("login form open");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if(signupForm)
{
  signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    // console.log(name,email, password, passwordConfirm);
    signup(name,email, password, passwordConfirm);
  })
}
if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}
if (updateDataa) {
  updateDataa.addEventListener("submit", (e) => {
    e.preventDefault();
    const from=new FormData();
    form.append('name',document.getElementById("name").value)
    form.append('email',document.getElementById("email").value)
    form.append('photo',document.getElementById("photo").files[0])
    // const name = 
    // const email = document.getElementById("email").value;
    // console.log(name,email);
    updateData(from, "data");
  });
}
if (updatePass) {
  updatePass.addEventListener("submit", async (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    // console.log(name,email);
    // console.log({ passwordCurrent, password, passwordConfirm });
    await updateData(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if(bookTour)
{
  console.log('clicked');
  bookTour.addEventListener('click',e=>{
    e.target.textContext='Processing...'
    const tourId=e.target.dataset.tourId;
    console.log(tourId);
    bookTour1(tourId)
  })
}
