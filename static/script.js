document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('translate-btn');
    const englishInput = document.getElementById('english-text');
    const kannadaOutput = document.getElementById('kannada-text');
    const playBtn = document.getElementById('play-audio-btn');
    const audioPlayer = document.getElementById('audio-player');

    let currentAudioUrl = null;

    translateBtn.addEventListener('click', async () => {
        const text = englishInput.value.trim();
        if (!text) return;

        // Visual feedback
        translateBtn.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.9)' },
            { transform: 'scale(1)' }
        ], { duration: 200 });

        kannadaOutput.placeholder = "Translating...";
        kannadaOutput.value = "";
        playBtn.disabled = true;

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (data.error) {
                kannadaOutput.value = "Error: " + data.error;
            } else {
                kannadaOutput.value = data.translation;
                currentAudioUrl = data.audio_url;
                playBtn.disabled = false;

                // Set audio source
                audioPlayer.src = currentAudioUrl;
                // Auto play optional? Let's just ready it.
            }

        } catch (error) {
            kannadaOutput.value = "Network error occurred.";
            console.error(error);
        }
    });

    playBtn.addEventListener('click', () => {
        if (currentAudioUrl) {
            audioPlayer.play().catch(err => console.error("Playback failed", err));
        }
    });

    // Mobile specific: Listen for 'Enter' key? Maybe not on textarea.

    // Speech Recognition Setup
    const micBtn = document.getElementById('mic-btn');

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        micBtn.addEventListener('click', () => {
            if (micBtn.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        recognition.onstart = () => {
            micBtn.classList.add('listening');
            englishInput.placeholder = "Listening...";
        };

        recognition.onend = () => {
            micBtn.classList.remove('listening');
            englishInput.placeholder = "Type something here...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            englishInput.value = transcript;
            // Auto-trigger translation
            translateBtn.click();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            micBtn.classList.remove('listening');
            englishInput.placeholder = "Error hearing you. Try again.";
        };
    } else {
        micBtn.style.display = 'none'; // Hide if not supported
        console.log("Web Speech API not supported in this browser.");
    }

});
