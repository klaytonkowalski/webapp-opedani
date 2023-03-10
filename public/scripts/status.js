////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

import $ from "jquery"

////////////////////////////////////////////////////////////////////////////////
// ELEMENTS
////////////////////////////////////////////////////////////////////////////////

const layoutStatusBox = $("#layoutStatusBox")

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

let showHandle

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

export function showStatus(elementTree, milliseconds)
{
    if (showHandle)
    {
        clearTimeout(showHandle)
        showHandle = undefined
    }
    layoutStatusBox.children().remove()
    layoutStatusBox.append(elementTree)
    layoutStatusBox.toggleClass("hidden", false)
    showHandle = setTimeout(() =>
    {
        showHandle = undefined
        layoutStatusBox.children().remove()
        layoutStatusBox.toggleClass("hidden", true)
    },
    milliseconds)
}