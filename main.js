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

function routeUser(req, res)
{
    res.render("user")
}

function routeContribute(req, res)
{
    res.render("contribute")
}

async function apiAddSong(req, res)
{
    const displayTitle = req.body.displayTitle
    const alternateTitle = req.body.alternateTitle
    const animeTitle = req.body.animeTitle
    const artistTitle = req.body.artistTitle
    const ordinal = req.body.ordinal
    const opening = req.body.opening
    const document =
    {
        displayTitle: displayTitle,
        alternateTitle: alternateTitle,
        animeTitle: animeTitle,
        artistTitle: artistTitle,
        ordinal: ordinal,
        opening: opening
    }
    firebaseFirestore.collection("contribution").add(document)
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

}

function apiEditAnime(req, res)
{

}

function apiEditArtist(req, res)
{

}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "pug")
app.set("trust proxy", true)

app.get("/", routeIndex)
app.get(/^\/user\/([0-9A-Za-z]+)$/, routeUser)
app.get("/contribute", routeContribute)

app.post("/api/add-song", apiAddSong)
app.post("/api/edit-song", apiEditSong)
app.post("/api/edit-anime", apiEditAnime)
app.post("/api/edit-artist", apiEditArtist)

app.listen(port, () =>
{
    console.log("Started server. { url = http://localhost:8080 }")
})