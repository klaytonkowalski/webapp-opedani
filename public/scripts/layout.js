////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

import $ from "jquery"
import feather from "feather-icons"
import { createAccount, logIn, logOut, queryCategory } from "./firebase"

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

const layoutLogOutButton = $("#layoutLogOutButton")

const layoutSearchQuery = $("#layoutSearchQuery")
const layoutSearchCategory = $("#layoutSearchCategory")
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

function layoutSearchQuery_onInput()
{
    if (layoutSearchHandle)
    {
        clearTimeout(layoutSearchHandle)
        layoutSearchHandle = undefined
    }
    layoutSearchBox.children().remove()
    const text = layoutSearchQuery.val()
    const category = layoutSearchCategory.val()
    if (text.length >= 2)
    {
        layoutSearchHandle = setTimeout(async () =>
        {
            clearTimeout(layoutSearchHandle)
            layoutSearchHandle = undefined
            const results = await queryCategory(text, category)
            let elementTree = ""
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
                            <a href="${result.songId}">${result.songDisplayTitle}</a>
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
            layoutSearchBox.append(elementTree)
            feather.replace()
        },
        500)
    }
}

function layoutSearchCategory_onChange()
{
    layoutSearchQuery.val("")
    layoutSearchBox.children().remove()
    const category = layoutSearchCategory.val()
    if (category == "anime")
    {
        layoutSearchQuery.attr("placeholder", "Shiki")
    }
    else if (category == "song")
    {
        layoutSearchQuery.attr("placeholder", "Venus Line")
    }
    else if (category == "user")
    {
        layoutSearchQuery.attr("placeholder", "Tortellini Soup")
    }
}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

$(document).ready(document_ready)
$(document).on('click', document_onClick)

layoutSignUpForm.on("submit", layoutSignUpForm_onSubmit)
layoutLogInForm.on("submit", layoutLogInForm_onSubmit)
layoutLogOutButton.on("click", layoutLogOutButton_onClick)
layoutSearchQuery.on("input", layoutSearchQuery_onInput)
layoutSearchCategory.on("change", layoutSearchCategory_onChange)

feather.replace()