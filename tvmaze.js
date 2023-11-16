"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_LINK = "http://api.tvmaze.com/search/shows?";
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
  const response = await fetch(`${TVMAZE_LINK}${searchTerm}`);

  const showData = JSON.parse(await response.text());

  console.log("initial gross iterable response", showData);

  const showsResults = showData.map(allShows => {
    const show = allShows.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image
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
    let finalImage;
    if (show.image === null) {
      finalImage = MISSING_IMAGE;
    } else {
      finalImage = show.image.medium;
    }

    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src= "${finalImage}"
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

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
