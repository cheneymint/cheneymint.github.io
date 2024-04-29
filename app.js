let currentImages = []; // Global array to store images fetched from the API
let currentIndex = 0; // Index for navigating through images

document.addEventListener("DOMContentLoaded", function () {
    const moodSelector = document.getElementById('moodSelector');
    moodSelector.addEventListener('change', function () {
        displayArt(this.value);
    });

    loadSavedImages();

    // Attach a click event to the entire body
    document.body.addEventListener('click', function (event) {
        // Check if the click was not on the mood selector to avoid triggering navigation while changing moods
        if (!event.target.closest('#moodSelector')) {
            showNextArtwork();
        }
    });
});
function redirectToMood(mood) {
    if (!mood) return;  // Do nothing if no mood is selected

    // Redirect to a mood-specific page
    window.location.href = `${mood}.html`; // Assumes mood-specific pages are named joy.html, sadness.html, etc.
}
function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm to shuffle an array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

async function displayArt(mood) {
    const artGallery = document.getElementById('artGallery');
    artGallery.innerHTML = '';  // Clear previous results

    const moodThemes = {
        joy: { bg: 'var(--joy-bg)', text: 'var(--joy-text)' },
        sadness: { bg: 'var(--sad-bg)', text: 'var(--sad-text)' },
        tranquility: { bg: 'var(--tranq-bg)', text: 'var(--tranq-text)' },
        anger: { bg: 'var(--anger-bg)', text: 'var(--anger-text)' },
        love: { bg: 'var(--love-bg)', text: 'var(--love-text)' },
        fear: { bg: 'var(--fear-bg)', text: 'var(--fear-text)' },
        excitement: { bg: 'var(--excite-bg)', text: 'var(--excite-text)' }
    };

    if (moodThemes[mood]) {
        document.body.style.backgroundColor = moodThemes[mood].bg;
        document.querySelector('h1').style.color = moodThemes[mood].text;
        document.querySelector('#artGallery').style.color = moodThemes[mood].text;
    }

    const moodKeywords = {
        joy: ['celebration', 'happiness', 'joy'],
        sadness: ['melancholy', 'sadness', 'gloom'],
        tranquility: ['calm', 'peace', 'serenity'],
        anger: ['conflict', 'anger', 'rage'],
        love: ['love', 'affection', 'romance'],
        fear: ['fear', 'terror', 'horror'],
        excitement: ['excitement', 'thrill', 'adventure']
    };

    const query = moodKeywords[mood] ? moodKeywords[mood][0] : null;

    if (query) {
        const apiKey = 'b7f50e7a-8bf6-4fd1-8f7a-af64e821df31';  // Use your actual API key
        const url = `https://api.harvardartmuseums.org/object?keyword=${encodeURIComponent(query)}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            currentImages = data.records.filter(record => record.primaryimageurl); // Store fetched images

            shuffleArray(currentImages); // Shuffle the array to make it random

            currentIndex = 0; // Reset index

            showNextArtwork(); // Show the first image from the shuffled array
        } catch (error) {
            console.error('Failed to fetch art:', error);
            artGallery.innerText = 'Failed to load art. Please try again.';
        }
    }
}
function getRandomCoordinate(containerWidth, containerHeight, elementWidth, elementHeight) {
    // Randomize a position that keeps the element within the container boundaries
    const x = Math.floor(Math.random() * (containerWidth - elementWidth));
    const y = Math.floor(Math.random() * (containerHeight - elementHeight));
    return { x, y };
}

function showNextArtwork() {
    const artGallery = document.getElementById('artGallery');

    if (currentIndex < currentImages.length) {
        const image = currentImages[currentIndex];
        const img = document.createElement('img');
        img.src = `${image.primaryimageurl}?${new Date().getTime()}`;  // Cache busting
        img.alt = image.title;
        img.title = image.title;
        artGallery.innerHTML = '';  // Clear previous results
        artGallery.appendChild(img);  // Display new image

        currentIndex++; // Move to the next image
    } else {
        artGallery.innerText = '.......';
    }
}

function loadSavedImages() {
    const artGallery = document.getElementById('artGallery');
    const savedArtworks = JSON.parse(localStorage.getItem('savedArtworks')) || [];

    savedArtworks.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        artGallery.appendChild(img);
    });
}

function saveArtwork(imageUrl) {
    let savedArtworks = JSON.parse(localStorage.getItem('savedArtworks')) || [];

    if (!savedArtworks.includes(imageUrl)) {
        savedArtworks.push(imageUrl);
        localStorage.setItem('savedArtworks', JSON.stringify(savedArtworks));
        alert('Artwork saved!');
    } else {
        alert('You have already saved this artwork.');
    }
}
