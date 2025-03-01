// script.js
window.addEventListener('load', () => {
    if (typeof wordlist === "undefined") {
        showModal("Wordlist not loaded. Please ensure eff_wordlist.js is available.");
        return;
    }
    if (wordlist.length !== 7776) {
        showModal("Wordlist should have 7776 words, but found " + wordlist.length);
    }

    // Initialize the theme based on user preference or default to dark
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.dataset.theme = prefersDarkScheme ? 'dark' : 'light';
    updateThemeToggleIcon();

    // Toggle theme event handler
    document.getElementById('toggleDark').addEventListener('click', toggleDarkMode);

    // Handle hash changes for dynamic decrypt page loading
    function checkHash() {
        const hash = window.location.hash.slice(1);
        if (hash && hash !== 'how-to-use' && hash !== 'about') {
            document.getElementById("create").style.display = "none";
            document.getElementById("decrypt").style.display = "block";
        } else {
            if (!hash || hash === '') {
                document.getElementById("create").style.display = "block";
                document.getElementById("decrypt").style.display = "none";
            }
        }
    }

    // Initial check and listen for hash changes
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Character countdown for message
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('charCounter');
    const maxLength = 1500;
    function updateCharCounter() {
        const remaining = maxLength - messageInput.value.length;
        charCounter.textContent = `Characters remaining: ${remaining}`;
        charCounter.style.color = remaining < 100 ? "var(--danger)" : "";
    }
    messageInput.addEventListener('input', updateCharCounter);
    updateCharCounter(); // Initial call

    // Update entropy meter when passphrase changes
    const passphraseInput = document.getElementById('passphrase');
    const entropyMeter = document.getElementById('entropyMeter');
    const entropyBar = document.getElementById('entropyBar');
    
    passphraseInput.addEventListener('input', updateEntropyMeter);
    
    // Smooth scroll to sections
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// Function to toggle dark/light mode
function toggleDarkMode() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = newTheme;
    updateThemeToggleIcon();
}

// Update theme toggle icon based on current theme
function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('toggleDark');
    if (document.body.dataset.theme === 'dark') {
        themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        themeToggle.innerHTML = '<i class="ri-moon-line"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// Function to go home and clear hash
function goHome(event) {
    event.preventDefault();
    history.pushState("", document.title, window.location.pathname + window.location.search);
    document.getElementById("create").style.display = "block";
    document.getElementById("decrypt").style.display = "none";
}

// Show modal with message
function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    setTimeout(() => {
        closeModal();
    }, 3000);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Estimate passphrase entropy
function estimateEntropy(passphrase) {
    const words = passphrase.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length < 7) return words.length * 10;
    const uniqueWords = new Set(words).size;
    const wordlistSize = 7776;
    const maxEntropyPerWord = Math.log2(wordlistSize);
    const effectiveEntropy = Math.floor(maxEntropyPerWord * uniqueWords);
    return effectiveEntropy >= 80 ? effectiveEntropy : Math.min(effectiveEntropy, 75);
}

// Update entropy meter
function updateEntropyMeter() {
    const passphrase = document.getElementById("passphrase").value;
    const entropy = estimateEntropy(passphrase);
    const entropyMeter = document.getElementById("entropyMeter");
    const entropyBar = document.getElementById("entropyBar");
    
    let entropyText, entropyColor, entropyPercentage;
    
    if (entropy < 40) {
        entropyText = "Very Weak";
        entropyColor = "var(--danger)";
        entropyPercentage = 20;
    } else if (entropy < 60) {
        entropyText = "Weak";
        entropyColor = "var(--danger)";
        entropyPercentage = 40;
    } else if (entropy < 80) {
        entropyText = "Moderate";
        entropyColor = "var(--warning)";
        entropyPercentage = 60;
    } else if (entropy < 100) {
        entropyText = "Strong";
        entropyColor = "var(--success)";
        entropyPercentage = 80;
    } else {
        entropyText = "Very Strong";
        entropyColor = "var(--success)";
        entropyPercentage = 100;
    }
    
    entropyMeter.textContent = `Passphrase Strength: ${entropyText} (${entropy} bits)`;
    entropyMeter.style.color = entropyColor;
    entropyBar.style.width = `${entropyPercentage}%`;
}

// Generate a random passphrase
function generatePassphrase() {
    if (!wordlist || wordlist.length < 7) {
        showModal("Wordlist unavailable or too small.");
        return;
    }

    const wordCount = 7;
    const indices = new Set();
    const maxIndex = wordlist.length;
    const randomValues = crypto.getRandomValues(new Uint32Array(wordCount * 2));
    
    let i = 0;
    while (indices.size < wordCount) {
        const index = Math.floor(randomValues[i] / (0xffffffff + 1) * maxIndex);
        indices.add(index);
        i++;
        if (i >= randomValues.length) {
            // If we run out of random values, get more
            const moreValues = crypto.getRandomValues(new Uint32Array(wordCount));
            randomValues.set(moreValues);
            i = 0;
        }
    }

    const passphrase = Array.from(indices)
        .map(index => wordlist[index])
        .join(" ");
        
    document.getElementById("passphrase").value = passphrase;
    updateEntropyMeter();
}

// Copy passphrase to clipboard
function copyPassphrase() {
    const passphrase = document.getElementById("passphrase").value;
    if (passphrase) {
        navigator.clipboard.writeText(passphrase);
        showModal("Copied passphrase to clipboard!");
    }
}

// Copy link to clipboard
function copyLink() {
    const linkElement = document.querySelector('#link .link-text');
    if (linkElement && linkElement.textContent) {
        const url = linkElement.textContent.trim();
        navigator.clipboard.writeText(url)
            .then(() => {
                showCopySuccess();
            })
            .catch(err => {
                console.error('Unable to copy to clipboard:', err);
                showModal("Could not copy to clipboard. Please select and copy the link manually.");
            });
    }
}

// Show copy success feedback
function showCopySuccess() {
    showModal("Link copied to clipboard!");
    
    // Visual feedback on the link container
    const linkContainer = document.getElementById("link");
    linkContainer.classList.add("copied");
    
    setTimeout(() => {
        linkContainer.classList.remove("copied");
    }, 1000);
}

// Encrypt message and generate link
async function encryptMessage() {
    const message = document.getElementById("message").value;
    const passphrase = document.getElementById("passphrase").value;
    const selfDestruct = parseInt(document.getElementById("selfDestruct").value);

    if (!message || !passphrase) {
        showModal("Please enter both a message and a passphrase.");
        return;
    }

    const entropy = estimateEntropy(passphrase);
    if (entropy < 80) {
        showModal(`Passphrase too weak (${entropy} bits). Use 7+ unique random words.`);
        return;
    }

    try {
        const encoder = new TextEncoder();
        const messageBytes = encoder.encode(message);
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const expiry = Math.floor(Date.now() / 1000) + (7 * 86400);
        const expiryBytes = new Uint8Array(4);
        new DataView(expiryBytes.buffer).setUint32(0, expiry);
        const sdBytes = new Uint8Array(1);
        sdBytes[0] = selfDestruct;

        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(passphrase),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );
        const key = await crypto.subtle.deriveKey(
            { name: "PBKDF2", salt, iterations: 1000000, hash: "SHA-256" },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt"]
        );

        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            messageBytes
        );

        const combined = new Uint8Array(
            salt.length + iv.length + expiryBytes.length + sdBytes.length + encrypted.byteLength
        );
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(expiryBytes, salt.length + iv.length);
        combined.set(sdBytes, salt.length + iv.length + expiryBytes.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length + expiryBytes.length + sdBytes.length);

        const base64 = btoa(String.fromCharCode.apply(null, Array.from(combined)));
        if (base64.length > 1500) {
            showModal("Message too long for reliable URL storage. Shorten it for best results.");
            return;
        }

        const url = `${window.location.origin}/#${encodeURIComponent(base64)}`;
        const linkContainer = document.getElementById("link");
        linkContainer.innerHTML = `
            <button class="copy-btn" onclick="copyLink()" title="Copy to clipboard">
                <i class="ri-clipboard-line"></i>
            </button>
            <div class="link-text" onclick="copyLink()" title="Click to copy">
                ${url}
            </div>
        `;
        linkContainer.style.display = "block";
        linkContainer.style.cursor = "pointer";
        // Show brief notification that user can click to copy
        showModal("Secure link generated! Click anywhere on the link to copy to clipboard.");

    } catch (e) {
        console.error(e);
        showModal("Error encrypting message.");
    }
}

// Decrypt message
async function decryptMessage() {
    const passphrase = document.getElementById("decryptPassphrase").value;
    if (!passphrase) {
        showModal("Please enter a passphrase.");
        return;
    }

    try {
        const hash = window.location.hash.slice(1);
        if (!hash) {
            showModal("No encrypted message found in URL.");
            return;
        }

        const combined = Uint8Array.from(atob(decodeURIComponent(hash)), c => c.charCodeAt(0));
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const expiry = new DataView(combined.slice(28, 32).buffer).getUint32(0);
        const selfDestruct = combined[32];
        const ciphertext = combined.slice(33);

        if (Math.floor(Date.now() / 1000) > expiry) {
            showModal("Message has expired.");
            return;
        }

        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(passphrase),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );
        const key = await crypto.subtle.deriveKey(
            { name: "PBKDF2", salt, iterations: 1000000, hash: "SHA-256" },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );
        const decoder = new TextDecoder();
        const message = decoder.decode(decrypted);
        const outputContainer = document.getElementById("output");
        outputContainer.innerHTML = `<div class="mb-2 font-medium">Decrypted Message:</div>${message}`;
        outputContainer.style.display = "block";

        // Clear passphrase field after decrypt
        document.getElementById("decryptPassphrase").value = "";

        // Handle self-destruct timer
        const timer = document.getElementById("selfDestructTimer");
        const timerSeconds = document.getElementById("timerSeconds");
        
        // Clear any existing timer
        if (window.countdownInterval) {
            clearInterval(window.countdownInterval);
            window.countdownInterval = null;
        }
        
        timer.style.display = "none";
        
        if (selfDestruct > 0) {
            let timeLeft = selfDestruct;
            timer.style.display = "block";
            timerSeconds.textContent = timeLeft;
            
            window.countdownInterval = setInterval(() => {
                timeLeft--;
                timerSeconds.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(window.countdownInterval);
                    window.countdownInterval = null;
                    outputContainer.innerHTML = '<div class="text-center text-red-500"><i class="ri-delete-bin-line text-xl mb-2"></i><br>Message self-destructed.</div>';
                    timer.style.display = "none";
                }
            }, 1000);
        }
    } catch (e) {
        console.error(e);
        showModal("Decryption failed. Wrong passphrase or invalid link.");
    }
}
