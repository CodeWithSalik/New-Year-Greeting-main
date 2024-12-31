document.addEventListener('DOMContentLoaded', () => {
    const countdownDisplay = document.getElementById('countdown');
    const nameInputArea = document.getElementById('name-input-area');
    const wishInputArea = document.getElementById('wish-input-area');
    const finalMessageArea = document.getElementById('finalMessageArea');
    const submitNameButton = document.getElementById('submit-name');
    const userNameInput = document.getElementById('userName');
    const greetingMessage = document.getElementById('greeting-message');
    const submitWishButton = document.getElementById('submitWishButton');
    const finalMessageElement = document.getElementById('finalMessageElement');
    const background = document.getElementById('background');
    const audio = document.getElementById('bgm');
    const showCountdownButton = document.getElementById('show-countdown');
    const countdownContainer = document.getElementById('countdown-container');

    let countdownInterval;

    // Countdown function
    function startCountdown() {
        const now = new Date();
        const newYear = new Date(now.getFullYear() + 1, 0, 1);
        let diff = newYear - now;

        countdownInterval = setInterval(() => {
        diff = newYear - new Date();

        // If the New Year has already occurred, stop the countdown and display 00:00:00
        if (diff <= -24) {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = "00:00:00";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownDisplay.textContent = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

    // Show area function (to manage the input sections)
    function showArea(area) {
        const areas = [nameInputArea, wishInputArea, finalMessageArea];
        areas.forEach(a => a.classList.remove('active'));
        area.classList.add('active');
    }

    // Countdown display section
    showCountdownButton.addEventListener('click', () => {
        countdownContainer.style.display = "block";
        startCountdown();
        audio.play();
        showArea(nameInputArea);
        showCountdownButton.style.display = "none";
    });

    // Name submission
    submitNameButton.addEventListener('click', () => {
        const name = userNameInput.value.trim();
        if (name) {
            greetingMessage.textContent = `Happy New Year, ${name}! What's your wish for 2025?`;
            showArea(wishInputArea);
        } else {
            alert("Please enter your name.");
        }
    });

    // Show final message
    function showFinalMessage(name, wish) {
        finalMessageElement.innerHTML = `
            <div class="message-content">
                <h2 class="greeting">Happy New Year, ${name}!</h2>
                <p class="wishes">May the coming year bring you:</p>
                <ul class="wish-list">
                    <li><i class="fas fa-chart-line"></i> Success in all your endeavors</li>
                    <li><i class="fas fa-laugh-beam"></i> Laughter that fills your days with joy</li>
                    <li><i class="fas fa-glass-cheers"></i> Fun and exciting adventures</li>
                    <li><i class="fas fa-heart"></i> Joy that overflows your heart</li>
                    <li><i class="fas fa-star"></i> Good luck in every step you take</li>
                    <li><i class="fas fa-smile"></i> Happiness that shines brightly throughout the year</li>
                </ul>
                ${wish ? `<p class="user-wish">And I wish you all the best for your wish: "${wish}"!</p>` : ""}
                <p class="closing">Wishing you a year of prosperity, love, and unforgettable moments.</p>
            </div>
        `;
        showArea(finalMessageArea);
        startConfetti();
    }

    // Wish submission + email sending
    submitWishButton.addEventListener('click', () => {
        const wish = document.getElementById('userWish').value.trim();
        const name = document.getElementById('userName').value.trim();

        if (name && wish) {
            fetch('https://newyear-backend.onrender.com/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, wish: wish }), 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error sending email');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showFinalMessage(name, wish); // Show message after sending email
                } else {
                    console.error(data.message || 'Error sending wish. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                alert(error.message || 'Error sending wish. Please try again later.');
            });
        } else {
            alert("Please enter your name and wish.");
        }
    });

    // Fireworks creation function
    function createFirework() {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        firework.style.left = Math.random() * window.innerWidth + 'px';
        firework.style.top = Math.random() * window.innerHeight + 'px';
        background.appendChild(firework);

        firework.addEventListener('animationend', () => {
            firework.remove();
        });
    }

    setInterval(createFirework, 500);

    // Confetti function
    function startConfetti() {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
    
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 70 * (timeLeft / duration); // Increased base particle count
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'],
                shapes: ['circle', 'square'],
                scalar: randomInRange(0.4, 1)
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'],
                shapes: ['circle', 'square'],
                scalar: randomInRange(0.4, 1)
            }));
        }, 150);
    }

    countdownContainer.style.display = "none";
});
