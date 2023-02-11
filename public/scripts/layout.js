////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

import $ from "jquery"
import feather from "feather-icons"
import { createAccount, logIn, logOut, queryDocument } from "./firebase"
import { showStatus } from "./status"

////////////////////////////////////////////////////////////////////////////////
// ELEMENTS
////////////////////////////////////////////////////////////////////////////////

const layoutLogInForm = $("#layoutLogInForm")
const layoutLogInEmail = $("#layoutLogInEmail")
const layoutLogInPassword = $("#layoutLogInPassword")

const layoutSignUpForm = $("#layoutSignUpForm")
const layoutSignUpEmail = $("#layoutSignUpEmail")
const layoutSignUpPassword = $("#layoutSignUpPassword")
const layoutSignUpRetype = $("#layoutSignUpRetype")

const layoutLogOut = $("#layoutLogOut")

const layoutSearchQuery = $("#layoutSearchQuery")
const layoutSearchBox = $("#layoutSearchBox")

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

let layoutSearchHandle

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

function dataHelp_onClick(event)
{
    const text = $(event.currentTarget).attr("data-help")
    const duration = parseInt($(event.currentTarget).attr("data-duration"))
    const elementTree = `<p>${text}</p>`
    showStatus(elementTree, duration)
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

function layoutLogOut_onClick()
{
    logOut()
}

function layoutSearchQuery_onInput()
{
    if (layoutSearchHandle)
    {
        clearTimeout(layoutSearchHandle)
        layoutSearchHandle = undefined
    }
    const text = layoutSearchQuery.val()
    if (text.length >= 2)
    {
        layoutSearchHandle = setTimeout(async () =>
        {
            layoutSearchHandle = undefined
            let elementTree = ""
            const results = await queryDocument(text)
            for (const result of results)
            {
                elementTree += `
                    <div class="vertical padding-small gap-small">
                        <div class="icon-text">
                            <i data-feather="monitor"></i>
                            <a href="/anime/${result.animeId}">${result.animeDisplayTitle}</a>
                        </div>
                        <div class="icon-text">
                            <i data-feather="music"></i>
                            <a href="/song/${result.songId}">${result.songDisplayTitle}</a>
                        </div>
                        <div class="icon-text">
                            <i data-feather="list"></i>
                            <p>${result.opening ? "Opening" : "Ending"} ${result.ordinal}</p>
                        </div>
                        <div class="horizontal space-evenly">
                            <div class="icon-text">
                                <i data-feather="star"></i>
                                <p>${result.globalRating.toFixed(2)}</p>
                            </div>
                            <div class="icon-text">
                                <i data-feather="hash"></i>
                                <p>${result.globalRanking}</p>
                            </div>
                            <div class="icon-text">
                                <i data-feather="users"></i>
                                <p>${result.popularity}</p>
                            </div>
                        </div>
                    </div>`
            }
            layoutSearchBox.children().remove()
            layoutSearchBox.append(elementTree)
            feather.replace()
        },
        500)
    }
}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

$(document).ready(document_ready)
$(document).on("click", document_onClick)

feather.replace()

$("[data-help]").on("click", dataHelp_onClick)

layoutSignUpForm.on("submit", layoutSignUpForm_onSubmit)
layoutLogInForm.on("submit", layoutLogInForm_onSubmit)
layoutLogOut.on("click", layoutLogOut_onClick)
layoutSearchQuery.on("input", layoutSearchQuery_onInput)