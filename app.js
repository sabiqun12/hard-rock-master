// API URL
const apiURL = "https://api.lyrics.ovh";

// Variable for ID's
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const result = document.getElementById("result");
const lyricsText = document.getElementById("lyrics-text");

// fetch song by Title or Artist
async function fetchSongs(text) {
    const response = await fetch(`${apiURL}/suggest/${text}`);
    const data = await response.json();
    // console.log(data);
    showResult(data);
}

// Show lyrics title and artist
const showResult = data => {
    if (data.total == 0) { // if no title/ artist found alert
        alertNotification('title-not-found', 'block');
        setTimeout(() => alertNotification('title-not-found', 'none'), 3000);

    } else {
        result.innerHTML = `
         ${data.data.slice(0,10) // show 10 result
        .map(
          songInfo => `
          <div class="single-result row align-items-center my-3 p-3">
            <div class="col-md-9">
                <h3 class="lyrics-name">${songInfo.title}</h3>
                <p class="author lead mb-1">Album by <span>${songInfo.artist.name}</span></p>
                <p class="badge badge-secondary"> Duration: ${(songInfo.duration/60).toFixed(2)} min</p>
            </div>
            <div class="col-md-3 text-md-right text-center">
            <button class="btn btn-success" data-artist="${songInfo.artist.name}" data-song-title="${songInfo.title}" >Get Lyrics</button>
            </div>
          </div>
        `
        )
        .join('')}`
    }
};

// Lyrics button click event handler
result.addEventListener('click', event => {
    // console.log(event.target);
    const clickedElement = event.target;

    if (clickedElement.tagName == "BUTTON") {
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute("data-song-title");

        fetchLyrics(artist, songTitle);
    }

});


// fetch lyrics by artist and title
async function fetchLyrics(artist, songTitle) {
    const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await response.json();
    console.log(data);
    result.innerHTML = "";

    if (data.error) {
        alertNotification('lyrics-not-found', 'block');
        setTimeout(() => alertNotification('lyrics-not-found', 'none'), 3000);
    } else {
        // Formatting lyrics
        const lyricsFormatter = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

        lyricsText.innerHTML = `
        <button onclick="reloadPage()" id="reload-page" class="btn" title="Reload">&#x21bb;</button>
          <h2 class="text-success mb-4">${artist}</strong> - ${songTitle}</h2>
          <pre class="lyric text-white">
          ${lyricsFormatter}
          </pre>`;

        // show reload page icon in lyrics 
        alertNotification("reload-page", "inline-block");
    }
}

const reloadPage = () => location.reload();

// Event listener
searchBtn.addEventListener('click', () => {
    const searchText = searchInput.value.trim();
    // console.log(searchText);
    if (searchText == "") { // if search input is empty show alert and clear innerHtml if exist
        result.innerHTML = "";
        lyricsText.innerHTML = "";
        alertNotification('empty-input', 'block');
        setTimeout(() => alertNotification('empty-input', 'none'), 3000);
    } else {
        result.innerHTML = "";
        lyricsText.innerHTML = "";
        fetchSongs(searchText);
    }
});


// Notification Alert
const alertNotification = (id, value) => document.getElementById(id).style.display = value;





// function alertNotification(id, value) {
//     document.getElementById(id).style.display = value;
// }

// function clearNotification() {
//     alertNotification('not-found', 'none');
//     alertNotification('empty-input', 'none');
// }