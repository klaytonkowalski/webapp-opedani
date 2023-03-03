////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

import $ from "jquery"
import { showStatus } from "./status"
import { querySongDocument } from "./firebase"

////////////////////////////////////////////////////////////////////////////////
// ELEMENTS
////////////////////////////////////////////////////////////////////////////////

const contributeWrapper = $("#contributeWrapper")
const contributeMethod = $("#contributeMethod")
const contributeSearch = $("#contributeSearch")
const contributeSearchBox = $("#contributeSearchBox")
const contributeQuery = $("#contributeQuery")
const contributeAddSong = $("#contributeAddSong")
const contributeAddSongTitle = $("#contributeAddSongTitle")
const contributeAddSongAnimeTitle = $("#contributeAddSongAnimeTitle")
const contributeAddSongArtistName = $("#contributeAddSongArtistName")
const contributeAddSongOrdinal = $("#contributeAddSongOrdinal")
const contributeAddSongOpening = $("#contributeAddSongOpening")
const contributeEditSong = $("#contributeEditSong")
const contributeEditSongTitle = $("#contributeEditSongTitle")
const contributeEditSongAnimeTitle = $("#contributeEditSongAnimeTitle")
const contributeEditSongArtistName = $("#contributeEditSongArtistName")
const contributeEditSongOrdinal = $("#contributeEditSongOrdinal")
const contributeEditSongOpening = $("#contributeEditSongOpening")
const contributeEditSongEnding = $("#contributeEditSongEnding")
const contributeEditAnime = $("#contributeEditAnime")
const contributeEditAnimeTitle = $("#contributeEditAnimeTitle")
const contributeEditArtist = $("#contributeEditArtist")
const contributeEditArtistName = $("#contributeEditArtistName")

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

let contributeSearchHandle
let contributeSearchResults

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function init()
{
    contributeMethod.val("addSong")
    contributeMethod.trigger("change", contributeMethod_onChange)
}

function contributeMethod_onChange()
{
    const method = contributeMethod.val()
    contributeSearch.toggleClass("hidden", true)
    contributeAddSong.toggleClass("hidden", true)
    contributeEditSong.toggleClass("hidden", true)
    contributeEditAnime.toggleClass("hidden", true)
    contributeEditArtist.toggleClass("hidden", true)
    if (method == "addSong")
    {
        contributeAddSong.toggleClass("hidden", false)
    }
    else if (method == "editSong")
    {
        contributeSearch.toggleClass("hidden", false)
    }
    else if (method == "editAnime")
    {
        contributeSearch.toggleClass("hidden", false)
    }
    else if (method == "editArtist")
    {
        contributeSearch.toggleClass("hidden", false)
    }
    contributeQuery.val("")
    contributeSearchBox.children().remove()
    contributeSearchResults = undefined
}

function contributeQuery_onInput()
{
    if (contributeSearchHandle)
    {
        clearTimeout(contributeSearchHandle)
        contributeSearchHandle = undefined
    }
    const value = contributeQuery.val()
    if (value.length >= 2)
    {
        contributeSearchHandle = setTimeout(async () =>
        {
            contributeSearchHandle = undefined
            contributeSearchBox.children().remove()
            const method = contributeMethod.val()
            if (method == "editSong")
            {
                contributeSearchResults = await querySongDocument("titleSearch", value)
                for (const result of contributeSearchResults)
                {
                    contributeSearchBox.append(`<button type="button" class="padding-small" data-title="${result.title}">${result.title}</button>`)
                }
            }
            else if (method == "editAnime")
            {
                contributeSearchResults = await querySongDocument("animeTitleSearch", value)
                for (const result of contributeSearchResults)
                {
                    contributeSearchBox.append(`<button type="button" class="padding-small" data-title="${result.title}">${result.animeTitle}</button>`)
                }
            }
            else if (method == "editArtist")
            {
                contributeSearchResults = await querySongDocument("artistNameSearch", value)
                for (const result of contributeSearchResults)
                {
                    contributeSearchBox.append(`<button type="button" class="padding-small" data-title="${result.title}">${result.artistName}</button>`)
                }
            }
        },
        500)
    }
}

function contributeSearchBox_onClick(event)
{
    const element = $(event.currentTarget)
    const resultTitle = element.attr("data-title")
    const result = contributeSearchResults.find(result => result.title == resultTitle)
    const method = contributeMethod.val()
    if (method == "editSong")
    {
        contributeEditSong.toggleClass("hidden", false)
        contributeEditSongTitle.val(result.title)
        contributeEditSongOrdinal.val(result.ordinal)
        contributeEditSongAnimeTitle.val(result.animeTitle)
        contributeEditSongArtistName.val(result.artistName)
        contributeEditSongOpening.prop("checked", result.opening)
        contributeEditSongEnding.prop("checked", !result.opening)
    }
    else if (method == "editAnime")
    {
        contributeEditAnime.toggleClass("hidden", false)
        contributeEditAnimeTitle.val(result.animeTitle)
    }
    else if (method == "editArtist")
    {
        contributeEditArtist.toggleClass("hidden", false)
        contributeEditArtistName.val(result.artistName)
    }
    contributeSearch.attr("data-focus", "false")
    return false
}

function submitSuccess()
{
    contributeWrapper.children().remove()
    contributeWrapper.append("<p>Your submission was receieved. Thank you!</p><p>You are being redirected to the home page...</p>")
    setTimeout(() => location.href = location.origin, 2500)
}

function submitError(_, textStatus, errorThrown)
{
    const elementTree = $(`<p>${textStatus} ${errorThrown}</p>`)
    showStatus(elementTree, 5000)
}

function contributeAddSong_onSubmit(event)
{
    event.preventDefault()
    const title = contributeAddSongTitle.val()
    const animeTitle = contributeAddSongAnimeTitle.val()
    const artistName = contributeAddSongArtistName.val()
    const ordinal = contributeAddSongOrdinal.val()
    const opening = contributeAddSongOpening.prop("checked")
    const request =
    {
        url: `${location.origin}/api/add-song`,
        method: "POST",
        dataType: "text",
        data:
        {
            title: title,
            animeTitle: animeTitle,
            artistName: artistName,
            ordinal: ordinal,
            opening: opening
        },
        success: submitSuccess,
        error: submitError
    }
    $.ajax(request)
    return false
}

function contributeEditSong_onSubmit(event)
{
    event.preventDefault()
    const title = contributeEditSongTitle.val()
    const animeTitle = contributeEditSongAnimeTitle.val()
    const artistName = contributeEditSongArtistName.val()
    const ordinal = contributeEditSongOrdinal.val()
    const opening = contributeEditSongOpening.prop("checked")
    const request =
    {
        url: `${location.origin}/api/edit-song`,
        method: "POST",
        dataType: "text",
        data:
        {
            title: title,
            animeTitle: animeTitle,
            artistName: artistName,
            ordinal: ordinal,
            opening: opening
        },
        success: submitSuccess,
        error: submitError
    }
    $.ajax(request)
    return false
}

function contributeEditAnime_onSubmit(event)
{
    event.preventDefault()
    const title = contributeEditAnimeTitle.val()
    const request =
    {
        url: `${location.origin}/api/edit-anime`,
        method: "POST",
        dataType: "text",
        data:
        {
            title: title
        },
        success: submitSuccess,
        error: submitError
    }
    $.ajax(request)
    return false
}

function contributeEditArtist_onSubmit(event)
{
    event.preventDefault()
    const name = contributeEditArtistName.val()
    const request =
    {
        url: `${location.origin}/api/edit-artist`,
        method: "POST",
        dataType: "text",
        data:
        {
            name: name
        },
        success: submitSuccess,
        error: submitError
    }
    $.ajax(request)
    return false
}

////////////////////////////////////////////////////////////////////////////////
// RUN
////////////////////////////////////////////////////////////////////////////////

contributeMethod.on("change", contributeMethod_onChange)
contributeQuery.on("input", contributeQuery_onInput)
contributeSearchBox.on("click", "button", contributeSearchBox_onClick)
contributeAddSong.on("submit", contributeAddSong_onSubmit)
contributeEditSong.on("submit", contributeEditSong_onSubmit)
contributeEditAnime.on("submit", contributeEditAnime_onSubmit)
contributeEditArtist.on("submit", contributeEditArtist_onSubmit)

init()