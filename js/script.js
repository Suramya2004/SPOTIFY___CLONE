console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs = [];
let currFolder = "songs";  // Define your song folder
let currentIndex = 0;

// Convert seconds to "MM:SS" format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Function to fetch songs from the "songs" folder and display them
async function getSongs() {
    // Fetch the directory contents from the 'songs' folder
    let response = await fetch(`/songs/`);
    let text = await response.text();

    // Create a temporary element to parse the response as HTML
    let div = document.createElement("div");
    div.innerHTML = text;
    let anchors = div.getElementsByTagName("a");

    // Extract .mp3 files
    songs = [];
    for (const element of anchors) {
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split("/songs/")[1]));
        }
    }

    // Display the songs in the playlist
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" width="34" src="img/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Artist Name</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="play.svg" alt="">
                </div>
            </li>
        `;
    }

    // Attach event listeners to each song to allow play on click
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            currentIndex = index;
            playMusic(songs[currentIndex]);
        });
    });
}

// Function to play the selected music track
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;  // Set the source of the audio file
    if (!pause) {
        currentSong.play();  // Play the song
        document.getElementById("play").src = "img/pause.svg";  // Update play button to pause
    }
    document.querySelector(".songinfo").innerHTML = track;  // Display the song info
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// Main function to load and play the songs
async function main() {
    await getSongs();
    playMusic(songs[0], true);

    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "img/pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume img").src = "img/volume.svg";
        } else {
            document.querySelector(".volume img").src = "img/mute.svg";
        }
    });

    document.querySelector(".volume img").addEventListener("click", e => {
        if (currentSong.volume > 0) {
            e.target.src = "img/mute.svg";
            currentSong.volume = 0;
        } else {
            e.target.src = "img/volume.svg";
            currentSong.volume = 0.1;
        }
    });

    document.getElementById("previous").addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            playMusic(songs[currentIndex]);
        }
    });

    document.getElementById("next").addEventListener("click", () => {
        if (currentIndex < songs.length - 1) {
            currentIndex++;
            playMusic(songs[currentIndex]);
        }
    });
}

// Function to handle Sign Up
function signUp() {
    alert("Sign Up functionality is not implemented yet.");
}

// Function to handle Log In
function logIn() {
    alert("Log In functionality is not implemented yet.");
}

main();
