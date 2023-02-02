////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const express = require("express")
const path = require("path")

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

const app = express()
const port = process.env.PORT || 8080

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, "public")))

app.set("view engine", "pug")
app.set("trust proxy", true)

app.get("/", (req, res) =>
{
    res.render("index")
})

app.listen(port, () =>
{
    console.log("Started server. { url = http://localhost:8080 }")
})