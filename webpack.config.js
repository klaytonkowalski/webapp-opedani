////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const path = require("path")

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

module.exports =
{
    entry:
    [
        "./public/scripts/firebase.js",
        "./public/scripts/layout.js",
        "./public/scripts/status.js"
    ],
    output:
    {
        path: path.join(__dirname, "public", "scripts"),
        filename: "bundle.js"
    }
}