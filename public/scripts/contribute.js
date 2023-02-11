////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

import $ from "jquery"
import { showStatus } from "./status"
import { querySong, queryAnime, queryArtist } from "./firebase"

////////////////////////////////////////////////////////////////////////////////
// ELEMENTS
////////////////////////////////////////////////////////////////////////////////

const contributeWrapper = $("#contributeWrapper")
const contributeMethod = $("#contributeMethod")
const contributeSearch = $("#contributeSearch")
const contributeSearchBox = $("#contributeSearchBox")
const contributeQuery = $("#contributeQuery")
const contributeAddSong = $("#contributeAddSong")
const contributeAddSongDisplayTitle = $("#contributeAddSongDisplayTitle")
const contributeAddSongAlternateTitle = $("#contributeAddSongAlternateTitle")
const contributeAddSongAnimeTitle = $("#contributeAddSongAnimeTitle")
const contributeAddSongArtistTitle = $("#contributeAddSongArtistTitle")
const contributeAddSongOrdinal = $("#contributeAddSongOrdinal")
const contributeAddSongOpening = $("#contributeAddSongOpening")
const contributeEditSong = $("#contributeEditSong")
const contributeEditSongDisplayTitle = $("#contributeEditSongDisplayTitle")
const contributeEditSongAlternateTitle = $("#contributeEditSongAlternateTitle")
const contributeEditSongAnimeTitle = $("#contributeEditSongAnimeTitle")
const contributeEditSongArtistTitle = $("#contributeEditSongArtistTitle")
const contributeEditSongOrdinal = $("#contributeEditSongOrdinal")
const contributeEditSongOpening = $("#contributeEditSongOpening")
const contributeEditSongEnding = $("#contributeEditSongEnding")
const contributeEditAnime = $("#contributeEditAnime")
const contributeEditAnimeDisplayTitle = $("#contributeEditAnimeDisplayTitle")
const contributeEditAnimeAlternateTitle = $("#contributeEditAnimeAlternateTitle")
const contributeEditArtist = $("#contributeEditArtist")
const contributeEditArtistDisplayTitle = $("#contributeEditArtistDisplayTitle")
const contributeEditArtistAlternateTitle = $("#contributeEditArtistAlternateTitle")

////////////////////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////

let contributeSearchHandle
let contributeSearchResults

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

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
    const text = contributeQuery.val()
    if (text.length >= 2)
    {
        contributeSearchHandle = setTimeout(async () =>
        {
            contributeSearchHandle = undefined
            const method = contributeMethod.val()
            if (method == "editSong")
            {
                contributeSearchResults = await querySong(text)
            }
            else if (method == "editAnime")
            {
                contributeSearchResults = await queryAnime(text)
            }
            else if (method == "editArtist")
            {
                contributeSearchResults = await queryArtist(text)
            }
            let elementTree = ""
            for (const result of contributeSearchResults)
            {
                elementTree += `<button type="button" class="padding-small" data-id="${result.id}">${result.displayTitle}</button>`
            }
            contributeSearchBox.children().remove()
            contributeSearchBox.append(elementTree)
        },
        500)
    }
}

function contributeSearchBox_onClick(event)
{
    const element = $(event.currentTarget)
    const resultId = element.attr("data-id")
    const result = contributeSearchResults.find(result => result.id == resultId)
    const method = contributeMethod.val()
    if (method == "editSong")
    {
        contributeEditSong.toggleClass("hidden", false)
        contributeEditSongDisplayTitle.val(result.displayTitle)
        contributeEditSongAlternateTitle.val(result.alternateTitle)
        contributeEditSongOrdinal.val(result.ordinal)
        contributeEditSongOpening.prop("checked", result.opening)
        contributeEditSongEnding.prop("checked", !result.opening)
    }
    else if (method == "editAnime")
    {
        contributeEditAnime.toggleClass("hidden", false)
        contributeEditAnimeDisplayTitle.val(result.displayTitle)
        contributeEditAnimeAlternateTitle.val(result.alternateTitle)
    }
    else if (method == "editArtist")
    {
        contributeEditArtist.toggleClass("hidden", false)
        contributeEditArtistDisplayTitle.val(result.displayTitle)
        contributeEditArtistAlternateTitle.val(result.alternateTitle)
    }
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
    const displayTitle = contributeAddSongDisplayTitle.val()
    const alternateTitle = contributeAddSongAlternateTitle.val()
    const animeTitle = contributeAddSongAnimeTitle.val()
    const artistTitle = contributeAddSongArtistTitle.val()
    const ordinal = contributeAddSongOrdinal.val()
    const opening = contributeAddSongOpening.prop("checked")
    const request =
    {
        url: `${location.origin}/api/add-song`,
        method: "POST",
        dataType: "text",
        data:
        {
            displayTitle: displayTitle,
            alternateTitle: alternateTitle,
            animeTitle: animeTitle,
            artistTitle: artistTitle,
            ordinal: ordinal,
            opening: opening
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