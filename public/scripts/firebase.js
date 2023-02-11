////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

import $ from "jquery"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { getFirestore, collection, getDocs, getDoc, query, where, orderBy, limit } from "firebase/firestore"
import { getStorage, getDownloadURL, ref } from "firebase/storage"
import { showStatus } from "./status"

////////////////////////////////////////////////////////////////////////////////
// ELEMENTS
////////////////////////////////////////////////////////////////////////////////

const layoutUser = $("#layoutUser")
const layoutProfile = $("#layoutProfile")

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
const firebaseFirestore = getFirestore(firebaseApp)
const firebaseStorage = getStorage(firebaseApp)

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

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

function initPageContent()
{
    const dataAuth = sessionStorage.getItem("data-auth") || "false"
    if (dataAuth == "true")
    {
        $("[data-auth='true']").removeAttr("data-auth")
        $("[data-auth='false']").remove()
    }
    else if (dataAuth == "false")
    {
        $("[data-auth='false']").removeAttr("data-auth")
        $("[data-auth='true']").remove()
    }
    const photoURL = sessionStorage.getItem("photoURL") || ""
    if (photoURL != "")
    {
        layoutUser.css("background-image", `url(${photoURL})`)
    }
    const uid = sessionStorage.getItem("uid") || ""
    if (uid != "")
    {
        layoutProfile.attr("href", `/user/${uid}`)
    }
}

function firebaseAuth_onAuthStateChanged(user)
{
    if (user)
    {
        sessionStorage.setItem("data-auth", "true")
        sessionStorage.setItem("photoURL", user.photoURL)
        sessionStorage.setItem("uid", user.uid)
    }
    else
    {
        sessionStorage.setItem("data-auth", "false")
        sessionStorage.setItem("photoURL", "")
        sessionStorage.setItem("uid", "")
    }
    initPageContent()
}

export async function querySong(text)
{
    text = text.toLowerCase()
    const results = []
    const request = query(collection(firebaseFirestore, "song"), where("displaySearchTitle", ">=", text), where("displaySearchTitle", "<=", text + "\u08ff"), orderBy("displaySearchTitle"), limit(5))
    const response = await getDocs(request)
    for (const document of response.docs)
    {
        const data = document.data()
        const result =
        {
            alternateTitle: data.alternateTitle,
            animeId: data.animeId.id,
            artistId: data.artistId.id,
            displayTitle: data.displayTitle,
            globalRanking: data.globalRanking,
            globalRating: data.globalRating,
            id: document.id,
            opening: data.opening,
            ordinal: data.ordinal,
            popularity: data.popularity
        }
        results.push(result)
    }
    return results
}

export async function queryAnime(text)
{
    text = text.toLowerCase()
    const results = []
    const request = query(collection(firebaseFirestore, "anime"), where("displaySearchTitle", ">=", text), where("displaySearchTitle", "<=", text + "\u08ff"), orderBy("displaySearchTitle"), limit(5))
    const response = await getDocs(request)
    for (const document of response.docs)
    {
        const data = document.data()
        const result =
        {
            alternateTitle: data.alternateTitle,
            displayTitle: data.displayTitle,
            id: document.id,
            songIds: data.songIds
        }
        results.push(result)
    }
    return results
}

export async function queryArtist(text)
{
    text = text.toLowerCase()
    const results = []
    const request = query(collection(firebaseFirestore, "artist"), where("displaySearchTitle", ">=", text), where("displaySearchTitle", "<=", text + "\u08ff"), orderBy("displaySearchTitle"), limit(5))
    const response = await getDocs(request)
    for (const document of response.docs)
    {
        const data = document.data()
        const result =
        {
            alternateTitle: data.alternateTitle,
            displayTitle: data.displayTitle,
            id: document.id,
            songIds: data.songIds
        }
        results.push(result)
    }
    return results
}

export async function queryDocument(text)
{
    text = text.toLowerCase()
    const results = []
    return results
}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

onAuthStateChanged(firebaseAuth, firebaseAuth_onAuthStateChanged)
initPageContent()