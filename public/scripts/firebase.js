////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

import $ from "jquery"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, collection, getDocs, getDoc, query, where, orderBy, limit } from "firebase/firestore"
import { showStatus } from "./status"

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

async function queryAnime(text)
{
    const results = []
    const request = query(collection(firebaseFirestore, "anime"), where("displaySearchTitle", ">=", text), where("displaySearchTitle", "<=", text + "\u08ff"), orderBy("displaySearchTitle"), limit(5))
    const response = await getDocs(request)
    for (const animeDocument of response.docs)
    {
        const animeData = animeDocument.data()
        for (const songId of animeData.songIds)
        {
            const songDocument = await getDoc(songId)
            const songData = songDocument.data()
            const object =
            {
                animeId: animeDocument.id,
                animeDisplayTitle: animeData.displayTitle,
                songId: songDocument.id,
                songDisplayTitle: songData.displayTitle,
                globalRanking: songData.globalRanking,
                globalRating: songData.globalRating,
                opening: songData.opening,
                ordinal: songData.ordinal,
                popularity: songData.popularity
            }
            results.push(object)
        }
    }
    return results
}

async function querySong(text)
{
    const results = []
    const request = query(collection(firebaseFirestore, "song"), where("displaySearchTitle", ">=", text), where("displaySearchTitle", "<=", text + "\u08ff"), orderBy("displaySearchTitle"), limit(5))
    const response = await getDocs(request)
    for (const songDocument of response.docs)
    {
        const songData = songDocument.data()
        const animeDocument = await getDoc(songData.animeId)
        const animeData = animeDocument.data()
        const object =
        {
            animeId: animeDocument.id,
            animeDisplayTitle: animeData.displayTitle,
            songId: songDocument.id,
            songDisplayTitle: songData.displayTitle,
            globalRanking: songData.globalRanking,
            globalRating: songData.globalRating,
            opening: songData.opening,
            ordinal: songData.ordinal,
            popularity: songData.popularity
        }
        results.push(object)
    }
    return results
}

async function queryUser(text)
{

}

export async function queryCategory(text, category)
{
    text = text.toLowerCase()
    if (category == "anime")
    {
        return await queryAnime(text)
    }
    if (category == "song")
    {
        return await querySong(text)
    }
    if (category == "user")
    {
        return await queryUser(text)
    }
}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

onAuthStateChanged(firebaseAuth, firebaseAuth_onAuthStateChanged)
checkSessionAuth()