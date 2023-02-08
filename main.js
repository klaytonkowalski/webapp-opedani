////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const express = require("express")
const path = require("path")

const { credential } = require("firebase-admin")
const { initializeApp } = require("firebase-admin/app")
const { getAuth } = require("firebase-admin/auth")
const firebaseServiceAccountKey = require("./firebase-service-account-key.json")

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

const app = express()
const port = process.env.PORT || 8080

const firebaseApp = initializeApp({ credential: credential.cert(firebaseServiceAccountKey) })
const firebaseAuth = getAuth(firebaseApp)

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function getIndexPage(req, res)
{
    res.render("index")
}

function getUserPage(req, res)
{
    res.render("user")
}

function getContributePage(req, res)
{
    res.render("contribute")
}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, "public")))

app.set("view engine", "pug")
app.set("trust proxy", true)

app.get("/", getIndexPage)
app.get(/^\/user\/([0-9A-Za-z]+)$/, getUserPage)
app.get("/contribute", getContributePage)

app.listen(port, () =>
{
    console.log("Started server. { url = http://localhost:8080 }")
})