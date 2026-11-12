
// =====================================
// JOSIDE CUSTOM MUSIC PLAYER
// =====================================

const audio = document.getElementById("music-audio");

const playButton = document.getElementById("play-button");
const prevButton = document.getElementById("prev-track");
const nextButton = document.getElementById("next-track");

const progressBar = document.getElementById("progress-bar");
const volumeBar = document.getElementById("volume-bar");

const currentTimeText = document.getElementById("current-time");
const durationText = document.getElementById("duration");

const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");

const playerStatus = document.getElementById("player-status");
const playerDisc = document.querySelector(".player-disc");

const trackRows = document.querySelectorAll(".track-row");

// =====================================
// TRACK DATABASE
// =====================================

const tracks = [
    {
        title: "Ayah, Coba Sekali Lagi — Track 01",
        artist: "JOSAN",
        src: "assets/music_audio/Ayah, Coba Sekali Lagi.mp3"
    },
    {
        title: "Ketuk Pintu Hati — Track 02",
        artist: "JOSAN",
        src: "assets/music_audio/Ketuk Pintu Hati.mp3"
    }
];

let currentTrack = 0;

// =====================================
// FORMAT TIME
// =====================================

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}

// =====================================
// LOAD TRACK
// =====================================
function loadTrack(index) {
    currentTrack = (index + tracks.length) % tracks.length;

    const track = tracks[currentTrack];

    audio.src = track.src;

    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
    if (progressBar) progressBar.value = 0;
    if (currentTimeText) currentTimeText.textContent = "00:00";
    if (durationText) durationText.textContent = "00:00";

    trackRows.forEach((row, rowIndex) => {
        row.classList.toggle("active", rowIndex === currentTrack);
    });

    if (playerStatus) playerStatus.textContent = "TRACK LOADED";
}

/* =====================================
   PLAY / PAUSE
===================================== */

const musicVisualizer = document.getElementById("musicVisualizer");

function updatePlayerUI() {
    const isPlaying = !audio.paused && !audio.ended;

    playButton.textContent = isPlaying ? "Ⅱ" : "▶";

    playerDisc.classList.toggle("playing", isPlaying);

    musicVisualizer?.classList.toggle("playing", isPlaying);

    if (isPlaying) {
        playerStatus.textContent = "NOW PLAYING";
    } else if (audio.ended) {
        playerStatus.textContent = "TRACK ENDED";
    } else {
        playerStatus.textContent = "PAUSED";
    }
}

function playMusic() {
    audio.play().catch(() => {
        playerStatus.textContent = "AUDIO UNAVAILABLE";
    });
}

function pauseMusic() {
    audio.pause();
}

playButton.addEventListener("click", () => {
    if (audio.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
});

audio.addEventListener("play", updatePlayerUI);
audio.addEventListener("pause", updatePlayerUI);
audio.addEventListener("ended", updatePlayerUI);


// =====================================
// NEXT / PREVIOUS
// =====================================

nextButton.addEventListener("click", () => {
    loadTrack(currentTrack + 1);
    playMusic();
});

prevButton.addEventListener("click", () => {
    loadTrack(currentTrack - 1);
    playMusic();
});

// =====================================
// TRACK PROGRESS
// =====================================

audio.addEventListener("loadedmetadata", () => {
    if (durationText) {
        durationText.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration)) return;

    const progress = (audio.currentTime / audio.duration) * 100;

    if (progressBar) progressBar.value = progress;

    if (currentTimeText) {
        currentTimeText.textContent = formatTime(audio.currentTime);
    }

    if (durationText) {
        durationText.textContent = formatTime(audio.duration);
    }
});

progressBar?.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration)) return;

    audio.currentTime = (progressBar.value / 100) * audio.duration;
});
// =====================================
// VOLUME
// =====================================

if (volumeBar) {
    audio.volume = Number(volumeBar.value);

    volumeBar.addEventListener("input", () => {
        audio.volume = Number(volumeBar.value);
    });
}
// =====================================
// AUTO NEXT TRACK
// =====================================

audio.addEventListener("ended", () => {
    loadTrack(currentTrack + 1);
    playMusic();
});

// =====================================
// TRACK LIST CLICK
// =====================================

trackRows.forEach((row) => {
    row.addEventListener("click", () => {
        const index = Number(row.dataset.track);

        loadTrack(index);
        playMusic();
    });
});

// =====================================
// INITIALIZE
// =====================================

loadTrack(0);

/* =====================================
   MOBILE NAVIGATION
===================================== */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle?.classList.remove("active");
        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open navigation");
    });
});

/* =====================================
   SCROLL REVEAL
===================================== */

document.documentElement.classList.add("js-reveal");

const revealElements = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* =====================================
   PLAYLIST DETAIL INTERACTION
===================================== */

const playlistCards = document.querySelectorAll(".playlist-card");

const playlistDetail = document.getElementById("playlist-detail");
const detailImage = document.getElementById("detail-image");
const detailNumber = document.getElementById("detail-number");
const detailTitle = document.getElementById("detail-title");
const detailDescription = document.getElementById("detail-description");
const detailSpotify = document.getElementById("detail-spotify");
const closeDetail = document.getElementById("close-detail");

const playlistData = [
    {
        number: "PLAYLIST / 001",
        title: "MIDNIGHT THOUGHTS.",
        description: "For the nights that never end. A collection of sounds for quiet moments and thoughts that only appear after midnight.",
        image: "assets/images/music/midnight.png",
        spotify: "https://open.spotify.com/playlist/1v6PIWRIXa0w74gBSZBq18?si=7GgUhBzkTRiZDGwo7xfc8w"
    },
    {
        number: "PLAYLIST / 002",
        title: "Chillin' Vibes.",
        description: "Music that i hear when i feel burnout.",
        image: "assets/images/music/chillin.png",
        spotify: "https://open.spotify.com/playlist/0k0WKMaoZs46MFTYHwZku5?si=4Iu2jX2JT861aQhSHUYKTw"
    },
    {
        number: "PLAYLIST / 003",
        title: "ME TIME.",
        description: "When i need to zone out from everything. A collection of music that make the way to go to my own world.",
        image: "assets/images/music/me-time.png",
        spotify: "https://open.spotify.com/playlist/4gaa7g86lan7glRbJ30ZSG"
    }
];

playlistCards.forEach((card, index) => {
    card.addEventListener("click", (event) => {
        event.preventDefault();

        const playlist = playlistData[index];

        if (!playlist) return;

        detailImage.src = playlist.image;
        detailImage.alt = playlist.title;
        detailNumber.textContent = playlist.number;
        detailTitle.textContent = playlist.title;
        detailDescription.textContent = playlist.description;
        detailSpotify.href = playlist.spotify;


const spotifyEmbed = document.getElementById("spotify-embed");
const spotifyFrame = document.getElementById("spotify-player");
const spotifyCurrentTitle = document.getElementById("spotify-current-title");

// Tambahkan di dalam event click playlist,
// setelah detailSpotify.href = playlist.spotify;

const playlistId = playlist.spotify.split("/playlist/")[1]?.split("?")[0];

if (playlistId && spotifyEmbed) {
    spotifyFrame?.classList.add("changing");

    spotifyCurrentTitle.textContent = playlist.title;

    spotifyEmbed.src =
        `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;

    spotifyEmbed.onload = () => {
        spotifyFrame?.classList.remove("changing");
    };
}


        playlistDetail.classList.add("active");

        playlistDetail.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
});

closeDetail?.addEventListener("click", () => {
    playlistDetail.classList.remove("active");
});
