////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")

const { credential } = require("firebase-admin")
const { initializeApp } = require("firebase-admin/app")
const { getAuth } = require("firebase-admin/auth")
const { getFirestore, collection } = require("firebase-admin/firestore")
const firebaseServiceAccountKey = require("./firebase-service-account-key.json")

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

const app = express()
const port = process.env.PORT || 8080

const firebaseApp = initializeApp({ credential: credential.cert(firebaseServiceAccountKey) })
const firebaseAuth = getAuth(firebaseApp)
const firebaseFirestore = getFirestore(firebaseApp)

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function routeIndex(req, res)
{
    res.render("index")
}

function routeProfile(req, res)
{
    res.render("profile")
}

function routeContribute(req, res)
{
    res.render("contribute")
}

async function apiAddSong(req, res)
{
    const title = req.body.title
    const animeTitle = req.body.animeTitle
    const artistName = req.body.artistName
    const ordinal = req.body.ordinal
    const opening = req.body.opening
    const document =
    {
        title: title,
        animeTitle: animeTitle,
        artistName: artistName,
        ordinal: ordinal,
        opening: opening
    }
    firebaseFirestore.collection("add-song").add(document)
    .then(() =>
    {
        res.status(200).end()
    })
    .catch(error =>
    {
        res.status(400).end()
    })
}

function apiEditSong(req, res)
{
    const title = req.body.title
    const animeTitle = req.body.animeTitle
    const artistName = req.body.artistName
    const ordinal = req.body.ordinal
    const opening = req.body.opening
    const document =
    {
        title: title,
        animeTitle: animeTitle,
        artistName: artistName,
        ordinal: ordinal,
        opening: opening
    }
    firebaseFirestore.collection("edit-song").add(document)
    .then(() =>
    {
        res.status(200).end()
    })
    .catch(error =>
    {
        res.status(400).end()
    })
}

function apiEditAnime(req, res)
{
    const title = req.body.title
    const document =
    {
        title: title
    }
    firebaseFirestore.collection("edit-anime").add(document)
    .then(() =>
    {
        res.status(200).end()
    })
    .catch(error =>
    {
        res.status(400).end()
    })
}

function apiEditArtist(req, res)
{
    const name = req.body.name
    const document =
    {
        name: name
    }
    firebaseFirestore.collection("edit-artist").add(document)
    .then(() =>
    {
        res.status(200).end()
    })
    .catch(error =>
    {
        res.status(400).end()
    })
}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "pug")
app.set("trust proxy", true)

app.get("/", routeIndex)
app.get(/^\/profile\/([0-9A-Za-z]+)$/, routeProfile)
app.get("/contribute", routeContribute)

app.post("/api/add-song", apiAddSong)
app.post("/api/edit-song", apiEditSong)
app.post("/api/edit-anime", apiEditAnime)
app.post("/api/edit-artist", apiEditArtist)

app.listen(port, () =>
{
    console.log("Started server. { url = http://localhost:8080 }")
})