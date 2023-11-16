"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_LINK = "http://api.tvmaze.com";
const MISSING_IMAGE = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

const formSearchTerm = $("#searchForm").val();

async function getShowsByTerm(formSearchTerm) {
  console.log("getShowsByTerm", "you made it to this function");

  const searchTerm = new URLSearchParams({
    q: formSearchTerm,
  });
  const response = await fetch(`${TVMAZE_LINK}/search/shows?${searchTerm}`);

  const showsData = await response.json();

  console.log("initial gross iterable response", showsData);

  const showsResults = showsData.map(eachShow => {
    const show = eachShow.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image === null ? MISSING_IMAGE : show.image.medium
    };
  });

  console.log("showResults", showsResults);

  return showsResults;
}

/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src= "${show.image}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await fetch(`${TVMAZE_LINK}/shows/${id}/episodes`);
  const episodes = await response.json();

  console.log("episodes", episodes);

  const episodesResult = episodes.map(eachEpisode => {
    return {
      id: eachEpisode.id,
      name: eachEpisode.name,
      season: eachEpisode.season,
      number: eachEpisode.number
    };
  });

  return episodesResult;
}

/** Given the list of episodes creates a list "name (season, number)"
 * and display it onto the webpage  */

function displayEpisodes(episodesResults) {
  $("ul").empty();

  console.log("displayEpisodes");

  for (let episodeInfo of episodesResults) {
    const $episodeLi = $(
      `<li>
          ${episodeInfo.name}
          (season ${episodeInfo.season}, number ${episodeInfo.number})
       </li>`
       );
    $("ul").append($episodeLi);
  }
  $episodesArea.show();
}

/** When the episode button is clicked, this conductor function is called,
 * it pulls the episodeId and passes it onto the getEpisodesOfShow,
 * this value is then passed to displayEpisode to create episode list. */

async function handleEpisodesClick(evt) {
  const episodeId =  Number($(evt.target).closest('div.Show').attr("data-show-id"));
  console.log("episodeId=", episodeId)
  const showEpisodes = await getEpisodesOfShow(episodeId);
  displayEpisodes(showEpisodes)
}

$("#showsList").on("click", "button", handleEpisodesClick)

// add other functions that will be useful / match our structure & design


