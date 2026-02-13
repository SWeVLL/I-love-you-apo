// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
    const warnings = [];

    // Check required fields
    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    // Validate colors
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    // Validate animation values
    if (parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    // Log warnings if any
    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle;

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Validate configuration first
    validateConfig();

    // Set texts from config
    document.getElementById('valentineTitle').textContent = `${config.valentineName}, my love...`;
    
    // Set first question texts
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;
    
    // Set second question texts
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;
    
    // Set third question texts
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    // Create initial floating elements
    createFloatingElements();

    // Setup music player
    setupMusicPlayer();

    // Add scroll reveal animations
    setupScrollAnimations();
});

// Create floating hearts and bears with better distribution
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    
    // Create hearts with staggered timing
    config.floatingEmojis.hearts.forEach((heart, index) => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div, index);
        container.appendChild(div);
    });

    // Create bears with staggered timing
    config.floatingEmojis.bears.forEach((bear, index) => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div, index + config.floatingEmojis.hearts.length);
        container.appendChild(div);
    });
}

// Set random position for floating elements with better distribution
function setRandomPosition(element, index = 0) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = (Math.random() * 5 + index * 0.2) + 's';
    element.style.animationDuration = (10 + Math.random() * 20) + 's';
}

// Setup scroll reveal animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.question-section').forEach(section => {
        observer.observe(section);
    });
}

// Function to show next question with smooth transition
function showNextQuestion(questionNumber) {
    const sections = document.querySelectorAll('.question-section');
    sections.forEach(q => {
        q.style.opacity = '0';
        setTimeout(() => {
            q.classList.add('hidden');
        }, 300);
    });
    
    setTimeout(() => {
        const nextSection = document.getElementById(`question${questionNumber}`);
        nextSection.classList.remove('hidden');
        nextSection.style.opacity = '1';
    }, 300);
}

// Function to move the "No" button when clicked
function moveButton(button) {
    const padding = 50;
    const x = Math.random() * (window.innerWidth - button.offsetWidth - padding * 2) + padding;
    const y = Math.random() * (window.innerHeight - button.offsetHeight - padding * 2) + padding;
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
    
    // Add scale animation
    button.style.animation = 'none';
    setTimeout(() => {
        button.style.animation = 'scaleIn 0.3s ease-out';
    }, 10);
}

// Add scaleIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes scaleIn {
        from { transform: scale(0.8); }
        to { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Love meter functionality
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    loveMeter.value = 100;
    loveValue.textContent = 100;
}

loveMeter.addEventListener('input', () => {
    const value = parseInt(loveMeter.value);
    loveValue.textContent = value;
    
    if (value > 100) {
        extraLove.classList.remove('hidden');
        const overflowPercentage = (value - 100) / 9900;
        const extraWidth = overflowPercentage * window.innerWidth * 0.8;
        loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
        loveMeter.style.transition = 'width 0.3s';
        
        // Show different messages based on the value
        if (value >= 5000) {
            extraLove.classList.add('super-love');
            extraLove.textContent = config.loveMessages.extreme;
        } else if (value > 1000) {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.high;
        } else {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.normal;
        }
    } else {
        extraLove.classList.add('hidden');
        extraLove.classList.remove('super-love');
        loveMeter.style.width = '100%';
    }
});

// Initialize love meter
window.addEventListener('DOMContentLoaded', setInitialPosition);
window.addEventListener('load', setInitialPosition);

// Celebration function
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    
    // Set celebration messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;
    
    // Add confetti effect
    createConfetti();
    
    // Create heart explosion effect
    createHeartExplosion();
    
    // Trigger confetti multiple times
    setTimeout(() => createConfetti(), 500);
    setTimeout(() => createConfetti(), 1000);
}

// Create confetti effect
function createConfetti() {
    const colors = ['💞', '💗', '💕', '❤️', '🩷', '🌹', '💖'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.innerHTML = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-50px';
        confetti.style.fontSize = '2rem';
        confetti.style.zIndex = '999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        const duration = 2 + Math.random() * 1;
        const xMove = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            { 
                transform: 'translateY(0) translateX(0) rotate(0deg)',
                opacity: 1 
            },
            { 
                transform: `translateY(${window.innerHeight + 100}px) translateX(${xMove}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0 
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Create heart explosion animation
function createHeartExplosion() {
    for (let i = 0; i < 60; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'heart';
        document.querySelector('.floating-elements').appendChild(heart);
        
        const angle = (i / 60) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        heart.style.left = 'calc(50vw + ' + x + 'px)';
        heart.style.top = 'calc(50vh + ' + y + 'px)';
        heart.style.animation = 'explodeHeart 1.2s ease-out forwards';
        heart.style.animationDelay = (Math.random() * 0.3) + 's';
        
        setTimeout(() => heart.remove(), 1500);
    }
}

// Add explodeHeart animation
const explosionStyle = document.createElement('style');
explosionStyle.textContent = `
    @keyframes explodeHeart {
        0% {
            transform: scale(0) translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: scale(1) translate(0, 300px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(explosionStyle);

// Music Player Setup
function setupMusicPlayer() {
    const musicControls = document.getElementById('musicControls');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicSource = document.getElementById('musicSource');

    // Only show controls if music is enabled in config
    if (!config.music.enabled) {
        musicControls.style.display = 'none';
        return;
    }

    // Set music source and volume
    musicSource.src = config.music.musicUrl;
    bgMusic.volume = config.music.volume || 0.5;
    bgMusic.load();

    // Try autoplay if enabled
    if (config.music.autoplay) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented by browser");
                musicToggle.textContent = config.music.startText;
            });
        }
    }

    // Toggle music on button click
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = config.music.stopText;
        } else {
            bgMusic.pause();
            musicToggle.textContent = config.music.startText;
        }
    });
}