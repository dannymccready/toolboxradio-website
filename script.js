// Device Detection and Mobile Layout
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

function initMobileLayout() {
    const body = document.body;
    
    // Create iPhone app-style mobile layout
    body.innerHTML = `
        <!-- Loading Screen for Mobile -->
        <div class="app-loading-screen" id="appLoadingScreen">
            <div class="app-loading-content">
                <div class="app-logo-container">
                    <img src="images/logo1.png" alt="ToolBox Radio" class="app-logo-loading">
                    <div class="loading-pulse"></div>
                </div>
                <h2>ToolBox Radio</h2>
                <p>Loading...</p>
            </div>
        </div>

        <!-- Simple Mobile Layout -->
        <div class="mobile-app-container">
            <!-- Top Header with Logo and Rotating Text -->
            <div class="mobile-header">
                <div class="header-logo">
                    <img src="images/logo1.png" alt="ToolBox Radio" class="header-logo-image">
                </div>
                <div class="header-text">
                    <div class="station-name">ToolBox Radio</div>
                    <div class="rotating-phrase" id="rotatingPhrase">🎶 Now streaming: certified bangers and power hammers.</div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="mobile-content-center">
                <!-- Live Indicator -->
                <div class="mobile-live-indicator">
                    <div class="mobile-live-dot"></div>
                    <span>LIVE NOW</span>
                </div>
                
                <!-- Album Art Display -->
                <div class="mobile-album-display">
                    <div class="mobile-album-cover">
                        <img src="images/logo1.png" alt="Album Art" class="album-cover-image" id="albumCoverImage">
                    </div>
                </div>
                
                <!-- Track Progress Bar -->
                <div class="mobile-progress-section">
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                            <div class="progress-dot" id="progressDot"></div>
                        </div>
                    </div>
                    <div class="progress-times">
                        <span class="time-current" id="currentTime">0:00</span>
                        <span class="time-total" id="totalTime">∞</span>
                    </div>
                </div>
                
                <!-- Track Information -->
                <div class="mobile-track-display">
                    <h2 class="mobile-track-name" id="mobileTrackName">Loading...</h2>
                    <p class="mobile-artist-name" id="mobileArtistName">Fetching current song...</p>
                </div>
                
                <!-- Audio Player -->
                <audio id="mobileRadioPlayer" preload="none">
                    <source src="https://radio.toolboxradio.com/radio/8000/radio.mp3" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                
                <!-- Player Controls -->
                <div class="mobile-player-controls">
                    <button class="mobile-control-btn mobile-play-pause-btn" id="mobilePlayPauseBtn">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Hide loading screen and initialize
    setTimeout(() => {
        const loadingScreen = document.getElementById('appLoadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                initAppPlayer();
                startHeaderPhraseRotation();
                fetchCurrentlyPlaying();
            }, 500);
        }
    }, 2500);
}

// Geo-restriction: allow playback only for UK visitors
async function isUKVisitor() {
	try {
		const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
		if (res.ok) {
			const data = await res.json();
			if (data && data.country_code === 'GB') return true;
		}
	} catch (e) {
		console.log('ipapi.co geo lookup failed:', e?.message || e);
	}
	try {
		const res2 = await fetch('https://ipwho.is/', { cache: 'no-store' });
		if (res2.ok) {
			const data2 = await res2.json();
			if (data2 && data2.success && data2.country_code === 'GB') return true;
		}
	} catch (e) {
		console.log('ipwho.is geo lookup failed:', e?.message || e);
	}
	return false;
}

function showRegionRestriction() {
	// Hide any floating live badge
	const liveBadge = document.querySelector('.floating-live');
	if (liveBadge) liveBadge.style.display = 'none';

	// Disable desktop audio element if present
	const desktopAudio = document.getElementById('desktopRadioPlayer');
	if (desktopAudio) {
		try { desktopAudio.pause(); } catch (_) {}
		desktopAudio.removeAttribute('src');
		while (desktopAudio.firstChild) desktopAudio.removeChild(desktopAudio.firstChild);
	}

	// Replace hero player with region-locked message
	const heroPlayer = document.querySelector('.hero-player');
	if (heroPlayer) {
		heroPlayer.innerHTML = `
			<div class="region-locked" role="status" aria-live="polite">
				<i class="fas fa-lock" aria-hidden="true"></i>
				<span>Sorry, the radio player is only available in the UK.</span>
			</div>
		`;
	}

	// Inject minimal styles for the region lock message
	if (!document.getElementById('region-lock-styles')) {
		const style = document.createElement('style');
		style.id = 'region-lock-styles';
		style.textContent = `
			.region-locked {
				display: flex;
				align-items: center;
				gap: 10px;
				background: rgba(255,255,255,0.95);
				border: 1px solid rgba(0,0,0,0.08);
				border-radius: 16px;
				padding: 16px 20px;
				color: #1f2937;
				box-shadow: 0 10px 25px rgba(0,0,0,0.10);
			}
			.region-locked i { color: #ef4444; }
		`;
		document.head.appendChild(style);
	}
}

// Mobile App Player Controls
function initAppPlayer() {
    const audioPlayer = document.getElementById('mobileRadioPlayer');
    const playPauseBtn = document.getElementById('mobilePlayPauseBtn');
    let isPlaying = false;
    
    if (audioPlayer && playPauseBtn) {
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (!isPlaying) {
                // Start playing
                audioPlayer.play().then(() => {
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playPauseBtn.classList.add('playing');
                    isPlaying = true;
                    
                    // Track when user started playing
                    userPlayStartTime = Date.now();
                    
                    // Only reset progress if this is the first time playing or song changed
                    if (!songStartTime) {
                        resetSongProgress();
                        fetchCurrentlyPlaying();
                    }
                    
                    startProgressAnimation();
                }).catch(error => {
                    console.log('Playback failed:', error);
                    showAppMessage('Tap to allow audio playback');
                });
            } else {
                // Pause
                audioPlayer.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('playing');
                
                // Track pause time to maintain correct elapsed calculation
                const pauseStartTime = Date.now();
                if (userPlayStartTime) {
                    const userListenTime = Math.floor((pauseStartTime - userPlayStartTime) / 1000);
                    songApiElapsed += userListenTime;
                    console.log(`Mobile: User paused after listening for ${userListenTime}s, total elapsed now: ${songApiElapsed}s`);
                }
                
                stopProgressAnimation();
                isPlaying = false;
            }
        });
        
        // Audio event listeners
        audioPlayer.addEventListener('loadstart', () => {
            console.log('Started loading radio stream...');
        });
        
        audioPlayer.addEventListener('canplay', () => {
            console.log('Radio stream ready to play');
        });
        
        audioPlayer.addEventListener('error', (e) => {
            console.log('Audio error:', e);
            showAppMessage('Connection error - please try again');
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.classList.remove('playing');
            isPlaying = false;
        });
        
        // Touch feedback
        playPauseBtn.addEventListener('touchstart', () => {
            playPauseBtn.style.transform = 'scale(0.95)';
        });
        
        playPauseBtn.addEventListener('touchend', () => {
            playPauseBtn.style.transform = 'scale(1)';
        });
    }
}

// Progress Bar Animation for Songs
let progressInterval = null;
let progressStartTime = null;
let songDuration = null;
let songStartTime = null;
let songApiElapsed = 0; // Elapsed time from API when last fetched
let userPlayStartTime = null; // When user pressed play
let totalPauseTime = 0; // Total time spent paused

function startProgressAnimation() {
    stopProgressAnimation(); // Clear any existing animation
    
    const progressFill = document.getElementById('progressFill');
    const progressDot = document.getElementById('progressDot');
    const currentTimeElement = document.getElementById('currentTime');
    
    if (!progressFill || !progressDot || !currentTimeElement) return;
    
    progressStartTime = Date.now();
    
    progressInterval = setInterval(() => {
        updateProgressDisplay();
    }, 1000);
}

function stopProgressAnimation() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    
    const progressFill = document.getElementById('progressFill');
    const progressDot = document.getElementById('progressDot');
    const currentTimeElement = document.getElementById('currentTime');
    
    if (progressFill) progressFill.style.width = '0%';
    if (progressDot) progressDot.style.left = '0%';
    if (currentTimeElement) currentTimeElement.textContent = '0:00';
}

function resetSongProgress() {
    // Reset all progress elements to start fresh for new song
    const progressFill = document.getElementById('progressFill');
    const progressDot = document.getElementById('progressDot');
    const currentTimeElement = document.getElementById('currentTime');
    
    if (progressFill) progressFill.style.width = '0%';
    if (progressDot) progressDot.style.left = '0%';
    if (currentTimeElement) currentTimeElement.textContent = '0:00';
    
    // Reset song timing variables - will be set properly in updateSongProgress
    songStartTime = Date.now();
    songDuration = null;
    
    console.log('Mobile progress reset for new song');
}

function updateSongProgress(duration, elapsed = null) {
    songDuration = duration;
    
    // Store the elapsed time from API
    if (elapsed && elapsed > 0) {
        songApiElapsed = elapsed;
        // Calculate the actual song start time based on elapsed time
        const now = Date.now();
        songStartTime = now - (elapsed * 1000);
        console.log(`Mobile: Song has been playing for ${elapsed} seconds already, setting start time to ${elapsed}s ago`);
    } else if (songApiElapsed > 0) {
        // Use previous elapsed time if we don't get new data
        const now = Date.now();
        songStartTime = now - (songApiElapsed * 1000);
        console.log(`Mobile: Using previous elapsed time: ${songApiElapsed} seconds`);
    } else {
        // Song is starting now or no elapsed time available
        songApiElapsed = 0;
        songStartTime = Date.now();
        console.log(`Mobile: No elapsed time, starting progress from 0:00`);
    }
    
    const totalTimeElement = document.getElementById('totalTime');
    
    if (duration && duration > 0) {
        // Format duration as MM:SS
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (totalTimeElement) totalTimeElement.textContent = durationString;
        
        console.log(`Song duration set to: ${durationString} (${duration} seconds)`);
    } else {
        // Keep previous duration if we had one, otherwise use default
        if (!songDuration) {
            songDuration = 210; // 3.5 minutes as default only if no previous duration
        }
        
        // Always update the display with current songDuration
        if (totalTimeElement && songDuration) {
            const minutes = Math.floor(songDuration / 60);
            const seconds = songDuration % 60;
            const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            totalTimeElement.textContent = durationString;
            console.log(`Displaying duration: ${durationString} (${songDuration} seconds)`);
        }
    }
    
    // Update progress immediately
    updateProgressDisplay();
}

function updateProgressDisplay() {
    const progressFill = document.getElementById('progressFill');
    const progressDot = document.getElementById('progressDot');
    const currentTimeElement = document.getElementById('currentTime');
    
    if (!progressFill || !progressDot || !currentTimeElement || !songStartTime) return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - songStartTime) / 1000);
    
    // Update current time display
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    currentTimeElement.textContent = timeString;
    
    // Update progress bar based on actual song duration
    let progressPercent = 0;
    
    if (songDuration && songDuration > 0) {
        // Calculate progress as percentage of actual song duration
        progressPercent = Math.min((elapsed / songDuration) * 100, 100);
        
        // If song is finished (with 2 second buffer), fetch new metadata
        if (elapsed >= (songDuration - 2)) {
            console.log(`Song nearly finished (${elapsed}s/${songDuration}s), fetching new metadata...`);
            setTimeout(() => {
                fetchCurrentlyPlaying();
            }, 2000);
        }
    } else {
        // Should not happen with new logic, but fallback just in case
        progressPercent = 0;
    }
    
    progressFill.style.width = `${progressPercent}%`;
    progressDot.style.left = `${progressPercent}%`;
    
    // Debug logging every 10 seconds
    if (elapsed > 0 && elapsed % 10 === 0) {
        console.log(`Mobile song progress: ${elapsed}s / ${songDuration}s (${progressPercent.toFixed(1)}%) - Start time was ${songStartTime}`);
    }
}

// Header phrase rotation
function startHeaderPhraseRotation() {
    const rotatingPhrase = document.getElementById('rotatingPhrase');
    
    if (!rotatingPhrase) {
        console.log('Rotating phrase element not found');
        return;
    }
    
	const phrases = [
		"Now streaming: certified bangers and power hammers.",
		"Our mixtape passed the building inspection.",
		"Noise complaint? Nope — just your new favorite station.",
		"We don't drop bricks — just beats.",
		"Under construction: your taste in music.",
		"Powered by coffee, concrete, and killer playlists.",
		"⚠️ Warning: Tunes may cause spontaneous head nodding on site.",
		"From rebar to reverb — we've got you."
	];
    
    let phraseIndex = 0;
    
    setInterval(() => {
        // Fade out
        rotatingPhrase.style.opacity = '0.3';
        
        setTimeout(() => {
            // Update content
            rotatingPhrase.textContent = phrases[phraseIndex];
            
            // Fade in
            rotatingPhrase.style.opacity = '1';
        }, 300);
        
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }, 10000);
}

// Fetch currently playing song from ToolBox Radio
let currentSong = null;
let metadataCheckInterval = null;

async function fetchCurrentlyPlaying() {
    // Check for both mobile and desktop elements
    const mobileTrackName = document.getElementById('mobileTrackName');
    const mobileArtistName = document.getElementById('mobileArtistName');
    const mobileAlbumImage = document.getElementById('albumCoverImage');
    
    const desktopTrackName = document.getElementById('desktopTrackName');
    const desktopArtistName = document.getElementById('desktopArtistName');
    const desktopAlbumImage = document.getElementById('desktopAlbumCoverImage');
    
    // Need at least one set of elements to proceed
    const hasMobileElements = mobileTrackName && mobileArtistName && mobileAlbumImage;
    const hasDesktopElements = desktopTrackName && desktopArtistName && desktopAlbumImage;
    
    if (!hasMobileElements && !hasDesktopElements) {
        console.log('No track elements found (mobile or desktop)');
        return;
    }
    
    console.log('Fetching metadata for:', hasMobileElements ? 'mobile' : '', hasDesktopElements ? 'desktop' : '');
    
    // Function to update album art
    function updateAlbumArt(artUrl, fallbackUrl = 'images/logo1.png') {
        console.log('Attempting to load album art:', artUrl);
        
        // Add loading class
        albumCoverImage.classList.add('loading');
        
        // If it's already the fallback, just use it directly
        if (artUrl === fallbackUrl) {
            console.log('Using fallback image directly');
            albumCoverImage.src = fallbackUrl;
            albumCoverImage.classList.remove('loading');
            return;
        }
        
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Try to handle CORS
        
        img.onload = function() {
            console.log('Album art loaded successfully:', artUrl);
            albumCoverImage.src = artUrl;
            albumCoverImage.classList.remove('loading');
        };
        
        img.onerror = function() {
            console.log('Failed to load album art:', artUrl, 'Using fallback:', fallbackUrl);
            albumCoverImage.src = fallbackUrl;
            albumCoverImage.classList.remove('loading');
        };
        
        // Set a timeout in case the image takes too long
        setTimeout(() => {
            if (albumCoverImage.classList.contains('loading')) {
                console.log('Image loading timeout, using fallback');
                albumCoverImage.src = fallbackUrl;
                albumCoverImage.classList.remove('loading');
            }
        }, 5000);
        
        img.src = artUrl;
    }
    
    // Function to update desktop album art
    function updateDesktopAlbumArt(artUrl, fallbackUrl = 'images/logo1.png') {
        const albumCoverImage = document.getElementById('desktopAlbumCoverImage');
        if (!albumCoverImage) return;
        
        console.log('Attempting to load desktop album art:', artUrl);
        
        // Add loading class
        albumCoverImage.classList.add('loading');
        
        // If it's already the fallback, just use it directly
        if (artUrl === fallbackUrl) {
            console.log('Using fallback image directly for desktop');
            albumCoverImage.src = fallbackUrl;
            albumCoverImage.classList.remove('loading');
            return;
        }
        
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Try to handle CORS
        
        img.onload = function() {
            console.log('Desktop album art loaded successfully:', artUrl);
            albumCoverImage.src = artUrl;
            albumCoverImage.classList.remove('loading');
        };
        
        img.onerror = function() {
            console.log('Failed to load desktop album art:', artUrl, 'Using fallback:', fallbackUrl);
            albumCoverImage.src = fallbackUrl;
            albumCoverImage.classList.remove('loading');
        };
        
        // Set a timeout in case the image takes too long
        setTimeout(() => {
            if (albumCoverImage.classList.contains('loading')) {
                console.log('Desktop image loading timeout, using fallback');
                albumCoverImage.src = fallbackUrl;
                albumCoverImage.classList.remove('loading');
            }
        }, 5000);
        
        img.src = artUrl;
    }
    
    // Function to update track display (both mobile and desktop)
    async function updateTrackDisplay(track, artist, providedAlbumArt = null, duration = null, elapsed = null) {
        // Only update if song has changed
        const newSong = `${track} - ${artist}`;
        if (newSong === currentSong) {
            return;
        }
        
        currentSong = newSong;
        console.log('Now playing:', track, 'by', artist, 'Duration:', duration, 'Elapsed:', elapsed, 'Album Art:', providedAlbumArt);
        
        // Get elements for both mobile and desktop
        const mobileTrackName = document.getElementById('mobileTrackName');
        const mobileArtistName = document.getElementById('mobileArtistName');
        const mobileAlbumImage = document.getElementById('albumCoverImage');
        
        const desktopTrackName = document.getElementById('desktopTrackName');
        const desktopArtistName = document.getElementById('desktopArtistName');
        const desktopAlbumImage = document.getElementById('desktopAlbumCoverImage');
        
        // Reset and restart progress for mobile
        if (mobileTrackName) {
            resetSongProgress();
            if (duration && duration > 0) {
                updateSongProgress(duration, elapsed);
            } else {
                updateSongProgress(null, elapsed);
            }
        }
        
        // Reset and restart progress for desktop
        if (desktopTrackName) {
            resetDesktopProgress();
            if (duration && duration > 0) {
                updateDesktopSongProgress(duration, elapsed);
            } else {
                updateDesktopSongProgress(null, elapsed);
            }
        }
        
        // Fade out mobile elements
        if (mobileTrackName) {
            mobileTrackName.style.opacity = '0.3';
            mobileArtistName.style.opacity = '0.3';
            mobileAlbumImage.style.opacity = '0.3';
        }
        
        // Fade out desktop elements
        if (desktopTrackName) {
            desktopTrackName.style.opacity = '0.3';
            desktopArtistName.style.opacity = '0.3';
            desktopAlbumImage.style.opacity = '0.3';
        }
        
        setTimeout(async () => {
            // Update mobile content
            if (mobileTrackName) {
                mobileTrackName.textContent = track;
                mobileArtistName.textContent = artist;
            }
            
            // Update desktop content
            if (desktopTrackName) {
                desktopTrackName.textContent = track;
                desktopArtistName.textContent = artist;
            }
            
            // Use provided album art first, then fallback to API
            let albumArt = providedAlbumArt;
            if (!albumArt || albumArt === '') {
                albumArt = await fetchAlbumArt(track, artist);
            }
            
            // Update album art for both players
            if (mobileAlbumImage) {
                updateAlbumArt(albumArt);
            }
            if (desktopAlbumImage) {
                updateDesktopAlbumArt(albumArt);
            }
            
            // Fade in mobile elements
            if (mobileTrackName) {
                mobileTrackName.style.opacity = '1';
                mobileArtistName.style.opacity = '1';
                mobileAlbumImage.style.opacity = '1';
            }
            
            // Fade in desktop elements
            if (desktopTrackName) {
                desktopTrackName.style.opacity = '1';
                desktopArtistName.style.opacity = '1';
                desktopAlbumImage.style.opacity = '1';
            }
        }, 400);
    }
    
    // Function to get metadata from radio stream
    async function getRadioMetadata() {
        try {
            // Try to fetch from ToolBox Radio's metadata API
            const response = await fetch('https://radio.toolboxradio.com/api/nowplaying/toolbox_radio', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Radio API response:', data);
                
                if (data.now_playing && data.now_playing.song) {
                    const song = data.now_playing.song;
                    let track = song.title || song.text || 'ToolBox Radio';
                    let artist = song.artist || 'Live Stream';
                    let albumArt = song.art || null;
                    
                    // Try multiple fields for duration
                    let duration = song.duration || song.length || data.now_playing.duration || data.now_playing.length || null;
                    
                    let elapsed = song.elapsed || null;
                    let startedAt = song.started_at || data.now_playing.started_at || null;
                    
                    // Try multiple fields for elapsed time
                    if (!elapsed) {
                        elapsed = song.elapsed_time || data.now_playing.elapsed || null;
                    }
                    
                    // Calculate real elapsed time if we have start time
                    if (startedAt && !elapsed) {
                        const songStartTime = new Date(startedAt).getTime();
                        const now = Date.now();
                        elapsed = Math.floor((now - songStartTime) / 1000);
                        console.log(`Calculated elapsed time from start: ${elapsed} seconds`);
                    }
                    
                    // If we still don't have elapsed, try to extract it from progress info
                    if (!elapsed && data.now_playing.progress) {
                        elapsed = Math.floor(data.now_playing.progress * (duration || 210));
                    }
                    
                    // Clean up metadata
                    if (track.includes(' - ')) {
                        const parts = track.split(' - ');
                        artist = parts[0];
                        track = parts[1];
                    }
                    
                    // Log what we found
                    console.log(`API Data - Track: ${track}, Artist: ${artist}, Duration: ${duration}, Elapsed: ${elapsed}, Album Art: ${albumArt ? 'Yes' : 'No'}`);
                    console.log('Raw duration fields:', {
                        'song.duration': song.duration,
                        'song.length': song.length,
                        'data.now_playing.duration': data.now_playing.duration,
                        'data.now_playing.length': data.now_playing.length
                    });
                    
                    // Update track display with real album art, duration, and elapsed time
                    await updateTrackDisplay(track, artist, albumArt, duration, elapsed);
                    return;
                }
            }
        } catch (error) {
            console.log('Failed to fetch from main API, trying alternative:', error);
        }
        
        // Fallback: Try alternative metadata source with CORS proxy
        try {
            const proxyUrl = 'https://corsproxy.io/?';
            const streamUrl = 'https://radio.toolboxradio.com/radio/8000/status-json.xsl';
            
            const streamResponse = await fetch(proxyUrl + encodeURIComponent(streamUrl));
            if (streamResponse.ok) {
                const streamData = await streamResponse.json();
                console.log('Stream metadata:', streamData);
                
                if (streamData.icestats && streamData.icestats.source) {
                    const source = streamData.icestats.source;
                    const title = source.title || source.stream_title || 'ToolBox Radio Live';
                    
                    let track = title;
                    let artist = 'ToolBox Radio';
                    let duration = source.stream_duration || source.duration || null;
                    let elapsed = source.stream_elapsed || source.elapsed || null;
                    
                    if (title.includes(' - ')) {
                        const parts = title.split(' - ');
                        artist = parts[0];
                        track = parts[1];
                    }
                    
                    // Try to get elapsed from stream start time
                    if (source.stream_start && !elapsed) {
                        const streamStart = new Date(source.stream_start).getTime();
                        const now = Date.now();
                        elapsed = Math.floor((now - streamStart) / 1000);
                        console.log(`Stream elapsed time calculated: ${elapsed} seconds`);
                    }
                    
                    await updateTrackDisplay(track, artist, null, duration, elapsed);
                    return;
                }
            }
        } catch (error) {
            console.log('Failed to fetch stream metadata:', error);
        }
        
        // Try to get info from the embed iframe directly
        try {
            await getMetadataFromEmbed();
        } catch (error) {
            console.log('Failed to get metadata from embed:', error);
        }
        
        // Final fallback - add some test elapsed time to verify progress works
        const testElapsed = Math.floor(Math.random() * 120); // Random elapsed time up to 2 minutes
        console.log(`Final fallback with test elapsed time: ${testElapsed} seconds`);
        await updateTrackDisplay('ToolBox Radio', 'Live Construction Music Stream', null, 210, testElapsed);
    }
    
    // Function to extract metadata from embedded player
    async function getMetadataFromEmbed() {
        // Create a hidden iframe to get metadata like the desktop version
        const hiddenIframe = document.createElement('iframe');
        hiddenIframe.src = 'https://radio.toolboxradio.com/public/toolbox_radio/embed?theme=light';
        hiddenIframe.style.display = 'none';
        document.body.appendChild(hiddenIframe);
        
        // Listen for messages from the iframe
        const messageHandler = (event) => {
            if (event.origin === 'https://radio.toolboxradio.com') {
                console.log('Received iframe message:', event.data);
                try {
                    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                    if (data.type === 'metadata' || data.nowplaying) {
                        const metadata = data.nowplaying || data;
                        if (metadata.title || metadata.song) {
                            const track = metadata.title || metadata.song;
                            const artist = metadata.artist || 'ToolBox Radio';
                            const albumArt = metadata.albumart || metadata.art;
                            const duration = metadata.duration;
                            
                            updateTrackDisplay(track, artist, albumArt, duration);
                        }
                    }
                } catch (e) {
                    console.log('Error parsing iframe message:', e);
                }
            }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Clean up after 10 seconds
        setTimeout(() => {
            window.removeEventListener('message', messageHandler);
            if (hiddenIframe.parentNode) {
                hiddenIframe.parentNode.removeChild(hiddenIframe);
            }
        }, 10000);
    }
    
    // Initial load
    await getRadioMetadata();
    
    // Check for updates every 10 seconds for more responsive updates
    if (metadataCheckInterval) {
        clearInterval(metadataCheckInterval);
    }
    
    metadataCheckInterval = setInterval(async () => {
        await getRadioMetadata();
    }, 10000);
}

// Function to fetch album art from external sources
async function fetchAlbumArt(track, artist) {
    console.log(`Fetching album art for: "${track}" by "${artist}"`);
    
    // Skip API calls for generic/stream titles
    const genericTitles = ['toolbox radio', 'live stream', 'construction music', 'loading', 'fetching'];
    const searchTerm = (track + ' ' + artist).toLowerCase();
    
    if (genericTitles.some(term => searchTerm.includes(term))) {
        console.log('Generic title detected, using logo');
        return 'images/logo1.png';
    }
    
    // Clean up track and artist names
    const cleanTrack = track.replace(/[^\w\s-]/gi, '').trim();
    const cleanArtist = artist.replace(/[^\w\s-]/gi, '').trim();
    
    if (!cleanTrack || !cleanArtist || cleanTrack.length < 2 || cleanArtist.length < 2) {
        console.log('Invalid track/artist names, using logo');
        return 'images/logo1.png';
    }
    
    try {
        // Use a more reliable CORS proxy
        const searchQuery = encodeURIComponent(`${cleanArtist} ${cleanTrack}`);
        console.log('Searching for album art:', searchQuery);
        
        // Try direct fetch first (might work on some networks)
        const response = await fetch(`https://itunes.apple.com/search?term=${searchQuery}&media=music&limit=3&explicit=no`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('iTunes search results:', data);
            
            if (data.results && data.results.length > 0) {
                for (const result of data.results) {
                    if (result.artworkUrl100) {
                        const highResArt = result.artworkUrl100.replace('100x100', '600x600');
                        console.log(`Found album art: ${highResArt}`);
                        return highResArt;
                    }
                }
            }
        }
    } catch (error) {
        console.log('iTunes API failed:', error.message);
    }
    
    console.log('No album art found, using logo fallback');
    return 'images/logo1.png';
}

// Show helper message for app users
function showAppMessage(message) {
    const existingMessage = document.querySelector('.stream-helper-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'stream-helper-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
        z-index: 10001;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Add animation styles if not already added
    if (!document.getElementById('helper-message-styles')) {
        const style = document.createElement('style');
        style.id = 'helper-message-styles';
        style.textContent = `
            @keyframes slideDown {
                0% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Iframe Player Integration
class ToolBoxRadioPlayer {
    constructor() {
        this.iframe = document.querySelector('.iframe-container iframe, #radioStream');
        this.isMobile = isMobileDevice();
        this.init();
    }
    
    init() {
        // Add any iframe-specific functionality here
        console.log('ToolBox Radio iframe player initialized for', this.isMobile ? 'mobile' : 'desktop');
        
        // Optional: Add event listeners for iframe communication
        window.addEventListener('message', (event) => {
            // Handle messages from the iframe if needed
            if (event.origin === 'https://radio.toolboxradio.com') {
                console.log('Message from radio iframe:', event.data);
                
                // If mobile, try to sync custom player state with iframe
                if (this.isMobile) {
                    this.syncMobilePlayerState(event.data);
                }
            }
        });
        
        // Mobile-specific iframe optimizations
        if (this.isMobile && this.iframe) {
            this.iframe.style.touchAction = 'manipulation';
            this.iframe.setAttribute('allow', 'autoplay');
            
            // Ensure iframe is properly hidden initially
            setTimeout(() => {
                this.iframe.style.width = '1px';
                this.iframe.style.height = '1px';
                this.iframe.style.opacity = '0';
                this.iframe.style.pointerEvents = 'none';
            }, 100);
        }
    }
    
    syncMobilePlayerState(data) {
        const playBtn = document.getElementById('mobilePlayBtn');
        if (playBtn && data) {
            // Try to sync play/pause state based on iframe messages
            if (data.includes('play') || data.includes('start')) {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.classList.add('playing');
            } else if (data.includes('pause') || data.includes('stop')) {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.classList.remove('playing');
            }
        }
    }
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const topic = form.querySelector('#topic').value;
            const message = form.querySelector('#message').value;
            
            // Simple validation
            if (!name || !email || !message || topic === '') {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('span').textContent;
            const originalIcon = submitBtn.querySelector('i').className;
            
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.querySelector('i').className = originalIcon;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                border-left: 4px solid var(--primary);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #10b981;
            }
            
            .notification-error {
                border-left-color: #ef4444;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-content i {
                font-size: 1.25rem;
            }
            
            .notification-success .notification-content i {
                color: #10b981;
            }
            
            .notification-error .notification-content i {
                color: #ef4444;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .notification-close:hover {
                background: #f3f4f6;
                color: #6b7280;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .stat-card, .contact-card, .benefit-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Add mobile navigation styles
function addMobileNavStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(style);
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const particles = document.querySelectorAll('.particle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.1;
            particle.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Desktop player functions (similar to mobile but for desktop elements)
function initDesktopPlayer() {
    const audioPlayer = document.getElementById('desktopRadioPlayer');
    const playPauseBtn = document.getElementById('desktopPlayPauseBtn');
    let isPlaying = false;
    
    if (audioPlayer && playPauseBtn) {
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (!isPlaying) {
                // Start playing
                audioPlayer.play().then(() => {
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playPauseBtn.classList.add('playing');
                    isPlaying = true;
                    
                    // Track when user started playing
                    desktopUserPlayStartTime = Date.now();
                    
                    // Only reset progress if this is the first time playing or song changed
                    if (!desktopSongStartTime) {
                        resetDesktopProgress();
                        fetchCurrentlyPlaying();
                    }
                    
                    startDesktopProgressAnimation();
                }).catch(error => {
                    console.log('Desktop playback failed:', error);
                });
            } else {
                // Pause
                audioPlayer.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('playing');
                isPlaying = false;
                
                // Track pause time to maintain correct elapsed calculation
                const pauseStartTime = Date.now();
                if (desktopUserPlayStartTime) {
                    const userListenTime = Math.floor((pauseStartTime - desktopUserPlayStartTime) / 1000);
                    desktopSongApiElapsed += userListenTime;
                    console.log(`Desktop: User paused after listening for ${userListenTime}s, total elapsed now: ${desktopSongApiElapsed}s`);
                }
                
                stopDesktopProgressAnimation();
            }
        });
        
        // Handle audio events
        audioPlayer.addEventListener('pause', () => {
            if (isPlaying) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('playing');
                isPlaying = false;
                stopDesktopProgressAnimation();
            }
        });
        
        audioPlayer.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.classList.remove('playing');
            isPlaying = false;
            stopDesktopProgressAnimation();
        });
        
        console.log('Desktop player initialized');
    }
}

// Desktop progress functions
let desktopProgressInterval = null;
let desktopProgressStartTime = null;
let desktopSongDuration = null;
let desktopSongStartTime = null;
let desktopSongApiElapsed = 0; // Elapsed time from API when last fetched
let desktopUserPlayStartTime = null; // When user pressed play
let desktopTotalPauseTime = 0; // Total time spent paused

function startDesktopProgressAnimation() {
    stopDesktopProgressAnimation();
    
    const progressFill = document.getElementById('desktopProgressFill');
    const progressDot = document.getElementById('desktopProgressDot');
    const currentTimeElement = document.getElementById('desktopCurrentTime');
    
    if (!progressFill || !progressDot || !currentTimeElement) return;
    
    desktopProgressStartTime = Date.now();
    
    desktopProgressInterval = setInterval(() => {
        updateDesktopProgressDisplay();
    }, 1000);
}

function stopDesktopProgressAnimation() {
    if (desktopProgressInterval) {
        clearInterval(desktopProgressInterval);
        desktopProgressInterval = null;
    }
    
    const progressFill = document.getElementById('desktopProgressFill');
    const progressDot = document.getElementById('desktopProgressDot');
    const currentTimeElement = document.getElementById('desktopCurrentTime');
    
    if (progressFill) progressFill.style.width = '0%';
    if (progressDot) progressDot.style.left = '0%';
    if (currentTimeElement) currentTimeElement.textContent = '0:00';
}

function resetDesktopProgress() {
    const progressFill = document.getElementById('desktopProgressFill');
    const progressDot = document.getElementById('desktopProgressDot');
    const currentTimeElement = document.getElementById('desktopCurrentTime');
    
    if (progressFill) progressFill.style.width = '0%';
    if (progressDot) progressDot.style.left = '0%';
    if (currentTimeElement) currentTimeElement.textContent = '0:00';
    
    // Reset timing variables - will be set properly in updateDesktopSongProgress
    desktopSongStartTime = Date.now();
    desktopSongDuration = null;
    
    console.log('Desktop progress reset for new song');
}

function updateDesktopSongProgress(duration, elapsed = null) {
    desktopSongDuration = duration;
    
    // Store the elapsed time from API
    if (elapsed && elapsed > 0) {
        desktopSongApiElapsed = elapsed;
        // Calculate the actual song start time based on elapsed time
        const now = Date.now();
        desktopSongStartTime = now - (elapsed * 1000);
        console.log(`Desktop: Song has been playing for ${elapsed} seconds already, setting start time to ${elapsed}s ago`);
    } else if (desktopSongApiElapsed > 0) {
        // Use previous elapsed time if we don't get new data
        const now = Date.now();
        desktopSongStartTime = now - (desktopSongApiElapsed * 1000);
        console.log(`Desktop: Using previous elapsed time: ${desktopSongApiElapsed} seconds`);
    } else {
        // Song is starting now or no elapsed time available
        desktopSongApiElapsed = 0;
        desktopSongStartTime = Date.now();
        console.log(`Desktop: No elapsed time, starting progress from 0:00`);
    }
    
    const totalTimeElement = document.getElementById('desktopTotalTime');
    
    if (duration && duration > 0) {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (totalTimeElement) totalTimeElement.textContent = durationString;
        
        console.log(`Desktop song duration set to: ${durationString} (${duration} seconds)`);
    } else {
        // Keep previous duration if we had one, otherwise use default
        if (!desktopSongDuration) {
            desktopSongDuration = 210; // 3.5 minutes as default only if no previous duration
        }
        
        // Always update the display with current desktopSongDuration
        if (totalTimeElement && desktopSongDuration) {
            const minutes = Math.floor(desktopSongDuration / 60);
            const seconds = desktopSongDuration % 60;
            const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            totalTimeElement.textContent = durationString;
            console.log(`Desktop displaying duration: ${durationString} (${desktopSongDuration} seconds)`);
        }
    }
    
    updateDesktopProgressDisplay();
}

function updateDesktopProgressDisplay() {
    const progressFill = document.getElementById('desktopProgressFill');
    const progressDot = document.getElementById('desktopProgressDot');
    const currentTimeElement = document.getElementById('desktopCurrentTime');
    
    if (!progressFill || !progressDot || !currentTimeElement || !desktopSongStartTime) return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - desktopSongStartTime) / 1000);
    
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    currentTimeElement.textContent = timeString;
    
    let progressPercent = 0;
    
    if (desktopSongDuration && desktopSongDuration > 0) {
        progressPercent = Math.min((elapsed / desktopSongDuration) * 100, 100);
        
        if (elapsed >= (desktopSongDuration - 2)) {
            console.log(`Desktop song nearly finished (${elapsed}s/${desktopSongDuration}s), fetching new metadata...`);
            setTimeout(() => {
                fetchCurrentlyPlaying();
            }, 2000);
        }
    } else {
        progressPercent = 0;
    }
    
    progressFill.style.width = `${progressPercent}%`;
    progressDot.style.left = `${progressPercent}%`;
    
    // Debug logging every 10 seconds for desktop
    if (elapsed > 0 && elapsed % 10 === 0) {
        console.log(`Desktop song progress: ${elapsed}s / ${desktopSongDuration}s (${progressPercent.toFixed(1)}%) - Start time was ${desktopSongStartTime}`);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const inUK = await isUKVisitor();
    if (!inUK) {
        showRegionRestriction();
        // Initialize non-player features only
        initLoadingScreen();
        initSmoothScrolling();
        initContactForm();
        initScrollAnimations();
        addMobileNavStyles();
        initMobileNav();
        initNavbarScroll();
        initParallaxEffect();
        addInteractiveFeatures();
        return;
    }

    // Check if mobile device and initialize appropriate layout
    if (isMobileDevice()) {
        initMobileLayout();
        initAppPlayer();
        startHeaderPhraseRotation();
        fetchCurrentlyPlaying();
    } else {
        // Desktop device - use standard layout with new player
        const player = new ToolBoxRadioPlayer();
        initLoadingScreen();
        initSmoothScrolling();
        initContactForm();
        initScrollAnimations();
        addMobileNavStyles();
        initMobileNav();
        initNavbarScroll();
        initParallaxEffect();
        initDesktopPlayer();
        setTimeout(() => {
            fetchCurrentlyPlaying();
        }, 2000);
        addInteractiveFeatures();
    }
});

// Additional interactive features
function addInteractiveFeatures() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('button, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple effect styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        button, .cta-button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Add floating animation to stats
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach((stat, index) => {
        stat.style.animationDelay = `${index * 0.2}s`;
        stat.style.animation = 'float 3s ease-in-out infinite';
    });
    
    // Add floating animation styles
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(floatStyle);
}

// Add a simple loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loading animation styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadingStyle);
}); 