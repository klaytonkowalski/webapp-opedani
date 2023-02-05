////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
import { showStatus } from "/scripts/status.js"

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

const firebaseConfig =
{
    apiKey: "AIzaSyBnRMdLg8sDVSfJquzFrKDRYFhXCQ7IWx4",
    authDomain: "webapp-opedani.firebaseapp.com",
    projectId: "webapp-opedani",
    storageBucket: "webapp-opedani.appspot.com",
    messageSenderId: "639208296831",
    appId: "1:639208296831:web:16d468cdb6ea37a7d88a4a",
    measurementId: "G-8Z823DQX6V"
}

const firebaseApp = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(firebaseApp)

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function checkSessionAuth()
{
    const dataAuth = sessionStorage.getItem("data-auth")
    if (!dataAuth)
    {
        sessionStorage.setItem("data-auth", "false")
    }
    if (dataAuth == "true")
    {
        $("[data-auth='true']").removeAttr("data-auth")
        $("[data-auth='false']").remove()
    }
    else
    {
        $("[data-auth='false']").removeAttr("data-auth")
        $("[data-auth='true']").remove()
    }
}

export function createAccount(email, password)
{
    createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then(userCredential =>
    {
        location.reload()
    })
    .catch(error =>
    {
        const elementTree = $(`<p>${error.code}</p>`)
        showStatus(elementTree, 5000)
    })
}

export function logIn(email, password)
{
    signInWithEmailAndPassword(firebaseAuth, email, password)
    .then(userCredential =>
    {
        location.reload()
    })
    .catch(error =>
    {
        const elementTree = $(`<p>${error.code}</p>`)
        showStatus(elementTree, 5000)
    })
}

export function logOut()
{
    signOut(firebaseAuth)
    .then(() =>
    {
        location.reload()
    })
    .catch(error =>
    {
        const elementTree = $(`<p>${error.code}</p>`)
        showStatus(elementTree, 5000)
    })
}

function firebaseAuth_onAuthStateChanged(user)
{
    sessionStorage.setItem("data-auth", user ? "true" : "false")
    checkSessionAuth()
}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

onAuthStateChanged(firebaseAuth, firebaseAuth_onAuthStateChanged)
checkSessionAuth()