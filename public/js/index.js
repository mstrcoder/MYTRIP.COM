// console.log("Hello from parcel!");
//this is entry file
import "@babel/polyfill";
import { login,logout } from "./login";
import { displayMap } from "./mapbox";
import {showAlert} from './alert'
import {updateData} from './updateSettings'
//DOM elements
const mapBox = document.getElementById("map");
// console.log('index.js');
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const updateDataa=document.querySelector("form-user-data");
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
if(logOutBtn)
{
    logOutBtn.addEventListener('click',logout)
}
if(updateDataa)
{
  console.log("data updated");
  updateData();
}
