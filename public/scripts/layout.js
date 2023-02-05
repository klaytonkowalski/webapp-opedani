////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

import { createAccount, logIn, logOut } from "/scripts/firebase.js"

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

const layoutLogInForm = $("#layoutLogInForm")
const layoutLogInEmail = $("#layoutLogInEmail")
const layoutLogInPassword = $("#layoutLogInPassword")

const layoutSignUpForm = $("#layoutSignUpForm")
const layoutSignUpEmail = $("#layoutSignUpEmail")
const layoutSignUpPassword = $("#layoutSignUpPassword")
const layoutSignUpRetype = $("#layoutSignUpRetype")

const layoutLogOutButton = $("#layoutLogOutButton")

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function document_ready()
{
    $("html").css("visibility", "visible")
}

function document_onClick(event)
{
    $("[data-focus]").each((_, element) =>
    {
        $(element).attr("data-focus", $.contains(element, event.target) ? "true" : "false")
    })
}

function layoutLogInForm_onSubmit(event)
{
    event.preventDefault()
    logIn(layoutLogInEmail.val(), layoutLogInPassword.val())
    return false
}

function layoutSignUpForm_onSubmit(event)
{
    event.preventDefault()
    if (layoutSignUpPassword.val() != layoutSignUpRetype.val())
    {
        return false
    }
    createAccount(layoutSignUpEmail.val(), layoutSignUpPassword.val())
    return false
}

function layoutLogOutButton_onClick()
{
    logOut()
}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

$(document).ready(document_ready)
$(document).on('click', document_onClick)

layoutSignUpForm.on("submit", layoutSignUpForm_onSubmit)
layoutLogInForm.on("submit", layoutLogInForm_onSubmit)
layoutLogOutButton.on("click", layoutLogOutButton_onClick)