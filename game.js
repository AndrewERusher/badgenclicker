let points = 0;
let level = 1;
let experience = 0;
let clickValue = 1;
let autoClickerCount = 0;
let superClickerCount = 0;
let achievements = [];
let leaderboard = [];
let username = "Guest";
let isMusicPlaying = false;
let blackjackUnlocked = false;
let blackjackMultiplier = 1;
let consecutiveWins = 0;
let startTime = Date.now();
let pointsPerSecond = 0;
let autoClickerSpeedBoost = 1;
let musicVolume = 0.5;
let isDarkMode = false;

// New variables for upgrade costs and bonuses
let clickUpgradeCost = 10;
let autoClickerCost = 50;
let superClickerCost = 1000;
let clickUpgradeBought = 0;
let autoClickerBought = 0;
let superClickerBought = 0;

// AI Players
const aiPlayers = [
    { name: "Derrick Jr.", score: 1000 },
    { name: "Destinee", score: 2000 },
    { name: "Austin", score: 3000 },
    { name: "Brandon", score: 4000 },
    { name: "Felicia", score: 5000 }
];

const pointsDisplay = document.getElementById('points');
const levelDisplay = document.getElementById('level');
const experienceDisplay = document.getElementById('experience');
const nextLevelDisplay = document.getElementById('next-level');
const badgenArea = document.getElementById('badgen-area');
const upgradeClickButton = document.getElementById('upgrade-click');
const upgradeAutoClickerButton = document.getElementById('upgrade-auto-clicker');
const upgradeSuperClickerButton = document.getElementById('upgrade-super-clicker');
const themeToggleButton = document.getElementById('theme-toggle');
const achievementList = document.getElementById('achievement-list');
const leaderboardList = document.getElementById('leaderboard-list');
const usernameInput = document.getElementById('username-input');
const saveUsernameButton = document.getElementById('save-username');
const playerNameDisplay = document.getElementById('player-name');
const saveGameButton = document.getElementById('save-game');
const loadGameButton = document.getElementById('load-game');
const badgenImage = document.getElementById('badgen-image');
const backgroundMusic = document.getElementById('background-music');
const toggleMusicButton = document.getElementById('toggle-music');
const timePlayedDisplay = document.getElementById('time-played');
const pointsPerSecondDisplay = document.getElementById('points-per-second');
const experienceBar = document.getElementById('experience-bar');
const openSettingsButton = document.getElementById('open-settings');
const settingsMenu = document.getElementById('settings-menu');
const closeSettingsButton = document.getElementById('close-settings');
const musicToggle = document.getElementById('music-toggle');
const volumeControl = document.getElementById('volume-control');
const savePreferencesButton = document.getElementById('save-preferences');

function updateDisplay() {
    pointsDisplay.textContent = Math.floor(points);
    levelDisplay.textContent = level;
    playerNameDisplay.textContent = username;
    upgradeClickButton.textContent = `Upgrade Click (Cost: ${clickUpgradeCost}) [${clickUpgradeBought}]`;
    upgradeAutoClickerButton.textContent = `Auto Clicker (Cost: ${autoClickerCost}) [${autoClickerBought}]`;
    upgradeSuperClickerButton.textContent = `Super Clicker (Cost: ${superClickerCost}) [${superClickerCount}]`;
    pointsPerSecondDisplay.textContent = pointsPerSecond.toFixed(1);
    
    const experiencePercentage = (experience / getNextLevelExperience()) * 100;
    experienceBar.style.width = `${experiencePercentage}%`;
    experienceBar.textContent = `${experiencePercentage.toFixed(1)}%`;
}

function getNextLevelExperience() {
    let baseExp = 100;
    if (level <= 25) {
        return baseExp * level;
    } else {
        return Math.floor(baseExp * Math.pow(1.5, level - 25) * 5);
    }
}

function clickBadgen() {
    points += clickValue;
    experience += clickValue;
    checkLevelUp();
    checkAchievements();
    updateDisplay();
    
    badgenImage.classList.add('click-animation');
    setTimeout(() => badgenImage.classList.remove('click-animation'), 200);
}

function upgradeClick() {
    if (points >= clickUpgradeCost) {
        points -= clickUpgradeCost;
        clickValue += getUpgradeBonus(clickUpgradeBought);
        clickUpgradeBought++;
        clickUpgradeCost = Math.floor(clickUpgradeCost * 1.15);
        updateDisplay();
    }
}

function upgradeAutoClicker() {
    if (points >= autoClickerCost) {
        points -= autoClickerCost;
        autoClickerCount += getUpgradeBonus(autoClickerBought);
        autoClickerBought++;
        autoClickerCost = Math.floor(autoClickerCost * 1.15);
        updateDisplay();
        
        if (!blackjackUnlocked) {
            blackjackUnlocked = true;
            unlockBlackjack();
        }
    }
}

function upgradeSuperClicker() {
    if (points >= superClickerCost) {
        points -= superClickerCost;
        superClickerCount++;
        autoClickerCount += 5 * getUpgradeBonus(superClickerBought);
        superClickerBought++;
        superClickerCost = Math.floor(superClickerCost * 1.15);
        updateDisplay();
    }
}

function getUpgradeBonus(boughtCount) {
    return Math.pow(2, Math.floor(boughtCount / 25));
}

function autoClick() {
    const pointsToAdd = autoClickerCount * autoClickerSpeedBoost;
    if (pointsToAdd > 0) {
        console.log(`AutoClick: Adding ${pointsToAdd.toFixed(2)} points (Count: ${autoClickerCount}, Boost: ${autoClickerSpeedBoost})`);
        points += pointsToAdd;
        experience += pointsToAdd;
        checkLevelUp();
        checkAchievements();
        checkEndGame();
        updateDisplay();
    }
}

function checkLevelUp() {
    while (experience >= getNextLevelExperience()) {
        experience -= getNextLevelExperience();
        level++;
        if (level % 5 === 0) {
            autoClickerSpeedBoost += 0.0025; // 0.25% increase every 5 levels
        }
    }
}

function checkAchievements() {
    const newAchievements = [
        { name: "Beginner Clicker", condition: () => points >= 100 },
        { name: "Intermediate Clicker", condition: () => points >= 1000 },
        { name: "Expert Clicker", condition: () => points >= 10000 },
        { name: "Level 5 Reached", condition: () => level >= 5 },
        { name: "Level 10 Reached", condition: () => level >= 10 },
    ];

    newAchievements.forEach(achievement => {
        if (!achievements.includes(achievement.name) && achievement.condition()) {
            achievements.push(achievement.name);
            const li = document.createElement('li');
            li.textContent = achievement.name;
            li.classList.add('achievement-unlock');
            achievementList.appendChild(li);
            showAchievementPopup(achievement.name);
        }
    });
}

function showAchievementPopup(achievementName) {
    const popup = document.createElement('div');
    popup.id = 'achievement-popup';
    popup.textContent = `Achievement unlocked: ${achievementName}`;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show-popup');
        setTimeout(() => {
            popup.classList.remove('show-popup');
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    }, 100);
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
}

function saveUsername() {
    username = usernameInput.value || "Guest";
    updateDisplay();
    saveGame();
}

function saveGame() {
    const gameState = {
        points,
        level,
        experience,
        clickValue,
        autoClickerCount,
        superClickerCount,
        achievements,
        username,
        clickUpgradeCost,
        autoClickerCost,
        superClickerCost,
        clickUpgradeBought,
        autoClickerBought,
        superClickerBought,
        autoClickerSpeedBoost,
        startTime
    };
    localStorage.setItem('badgenClickerSave', JSON.stringify(gameState));
    alert('Game saved successfully!');
}

function loadGame() {
    console.log("Attempting to load game...");
    const savedGame = localStorage.getItem('badgenClickerSave');
    if (savedGame) {
        try {
            const gameState = JSON.parse(savedGame);
            console.log("Loaded game state:", gameState);
            points = gameState.points || 0;
            level = gameState.level || 1;
            experience = gameState.experience || 0;
            clickValue = gameState.clickValue || 1;
            autoClickerCount = gameState.autoClickerCount || 0;
            superClickerCount = gameState.superClickerCount || 0;
            achievements = gameState.achievements || [];
            username = gameState.username || "Guest";
            clickUpgradeCost = gameState.clickUpgradeCost || 10;
            autoClickerCost = gameState.autoClickerCost || 50;
            superClickerCost = gameState.superClickerCost || 1000;
            clickUpgradeBought = gameState.clickUpgradeBought || 0;
            autoClickerBought = gameState.autoClickerBought || 0;
            superClickerBought = gameState.superClickerBought || 0;
            autoClickerSpeedBoost = gameState.autoClickerSpeedBoost || 1;
            startTime = gameState.startTime || Date.now();

            updateDisplay();
            updateAchievementsList();
            console.log("Game loaded successfully.");
        } catch (e) {
            console.error("Error parsing saved game data:", e);
            startTime = Date.now();
            points = 0;
            level = 1;
            experience = 0;
            clickValue = 1;
            autoClickerCount = 0;
            superClickerCount = 0;
            achievements = [];
            username = "Guest";
            clickUpgradeCost = 10;
            autoClickerCost = 50;
            superClickerCost = 1000;
            clickUpgradeBought = 0;
            autoClickerBought = 0;
            superClickerBought = 0;
            autoClickerSpeedBoost = 1;
        }
    } else {
        console.log("No saved game found, initializing new game.");
        startTime = Date.now();
    }
}

function updateAchievementsList() {
    achievementList.innerHTML = '';
    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = achievement;
        achievementList.appendChild(li);
    });
}

function updateLeaderboard() {
    leaderboard = [
        { name: username, score: points },
        ...aiPlayers
    ];
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);

    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

async function toggleMusic() {
    isMusicPlaying = !isMusicPlaying;
    if (isMusicPlaying) {
        backgroundMusic.play();
        musicToggle.checked = true;
    } else {
        backgroundMusic.pause();
        musicToggle.checked = false;
    }
}

function unlockBlackjack() {
    const blackjackButton = document.createElement('button');
    blackjackButton.id = 'play-blackjack';
    blackjackButton.textContent = 'Play Blackjack (Cost: 100)';
    blackjackButton.addEventListener('click', startBlackjackGame);
    document.getElementById('game-container').appendChild(blackjackButton);
}

function startBlackjackGame() {
    if (points < 100) {
        alert('Not enough points to play Blackjack!');
        return;
    }
    
    points -= 100;
    updateDisplay();
    
    const deck = createDeck();
    shuffleDeck(deck);
    
    const playerHand = [drawCard(deck), drawCard(deck)];
    const dealerHand = [drawCard(deck), drawCard(deck)];
    
    displayBlackjackGame(playerHand, dealerHand, deck);
}

function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard(deck) {
    return deck.pop();
}

function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    
    for (let card of hand) {
        value += getCardValue(card);
        if (card.value === 'A') aces++;
    }
    
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    
    return value;
}

function displayBlackjackGame(playerHand, dealerHand, deck) {
    const gameArea = document.createElement('div');
    gameArea.id = 'blackjack-game';
    gameArea.innerHTML = `
        <h3>Blackjack</h3>
        <p>Dealer's hand: <span id="dealer-hand"></span></p>
        <p>Your hand: <span id="player-hand"></span></p>
        <p>Your hand value: <span id="player-value"></span></p>
        <button id="hit">Hit</button>
        <button id="stand">Stand</button>
    `;
    
    document.getElementById('game-container').appendChild(gameArea);
    
    updateBlackjackDisplay(playerHand, dealerHand);
    
    document.getElementById('hit').addEventListener('click', () => hitAction(playerHand, dealerHand, deck));
    document.getElementById('stand').addEventListener('click', () => standAction(playerHand, dealerHand, deck));
}

function updateBlackjackDisplay(playerHand, dealerHand, showDealerCards = false) {
    const dealerHandElement = document.getElementById('dealer-hand');
    const playerHandElement = document.getElementById('player-hand');
    const playerValueElement = document.getElementById('player-value');
    
    dealerHandElement.textContent = showDealerCards ? 
        dealerHand.map(card => `${card.value}${card.suit}`).join(', ') :
        `${dealerHand[0].value}${dealerHand[0].suit}, Hidden`;
    
    playerHandElement.textContent = playerHand.map(card => `${card.value}${card.suit}`).join(', ');
    playerValueElement.textContent = calculateHandValue(playerHand);
}

function hitAction(playerHand, dealerHand, deck) {
    playerHand.push(drawCard(deck));
    updateBlackjackDisplay(playerHand, dealerHand);
    
    if (calculateHandValue(playerHand) > 21) {
        endBlackjackGame(playerHand, dealerHand, 'You busted! Dealer wins.');
    }
}

function standAction(playerHand, dealerHand, deck) {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(drawCard(deck));
    }
    
    endBlackjackGame(playerHand, dealerHand);
}

function endBlackjackGame(playerHand, dealerHand, message = '') {
    updateBlackjackDisplay(playerHand, dealerHand, true);
    
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);
    
    if (!message) {
        if (dealerValue > 21) {
            message = 'Dealer busted! You win!';
        } else if (playerValue > dealerValue) {
            message = 'You win!';
        } else if (playerValue < dealerValue) {
            message = 'Dealer wins!';
        } else {
            message = 'It\'s a tie!';
        }
    }
    
    const resultElement = document.createElement('p');
    resultElement.textContent = message;
    document.getElementById('blackjack-game').appendChild(resultElement);
    
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.addEventListener('click', () => {
        document.getElementById('game-container').removeChild(document.getElementById('blackjack-game'));
        startBlackjackGame();
    });
    document.getElementById('blackjack-game').appendChild(playAgainButton);
    
    if (message.includes('You win')) {
        consecutiveWins++;
        blackjackMultiplier = Math.min(10, 1 + consecutiveWins);
        const winnings = 200 * blackjackMultiplier;
        points += winnings;
        updateDisplay();
        alert(`You won ${winnings} points! Consecutive wins: ${consecutiveWins}, Multiplier: ${blackjackMultiplier}x`);
    } else {
        consecutiveWins = 0;
        blackjackMultiplier = 1;
    }
}

function updateTimer() {
    if (!startTime) return;
    const currentTime = Date.now();
    const timePlayed = Math.floor((currentTime - startTime) / 1000);
    const hours = Math.floor(timePlayed / 3600);
    const minutes = Math.floor((timePlayed % 3600) / 60);
    const seconds = timePlayed % 60;
    timePlayedDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function checkEndGame() {
    if (pointsPerSecond >= 1000000000) {
        alert('Congratulations! You\'ve reached the end game by making a billion points per second!');
    }
}

function initializeGame() {
    loadPreferences();
    loadGame();
    updateDisplay();
    if (badgenImage) {
        if (badgenArea.firstChild) {
           badgenArea.removeChild(badgenArea.firstChild);
        }
        badgenArea.appendChild(badgenImage);
    }
    applyPreferences();
    setupEventListeners();
}

function loadPreferences() {
    const savedPreferences = localStorage.getItem('badgenClickerPreferences');
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        isDarkMode = preferences.isDarkMode;
        isMusicPlaying = preferences.isMusicPlaying;
        musicVolume = preferences.musicVolume;
    }
}

function savePreferences() {
    console.log("Attempting to save preferences...");
    const preferences = {
        isDarkMode,
        isMusicPlaying,
        musicVolume
    };
    try {
        localStorage.setItem('badgenClickerPreferences', JSON.stringify(preferences));
        console.log("Preferences saved:", preferences);
        alert('Preferences saved successfully!');
    } catch (e) {
        console.error("Error saving preferences:", e);
        alert('Failed to save preferences.');
    }
}

function applyPreferences() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggleButton.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleButton.checked = false;
    }

    backgroundMusic.volume = musicVolume;
    volumeControl.value = musicVolume;

    if (isMusicPlaying) {
        backgroundMusic.play().catch(e => console.log("Audio play prevented:", e));
        musicToggle.checked = true;
    } else {
        backgroundMusic.pause();
        musicToggle.checked = false;
    }
}

function updateVolume() {
    musicVolume = parseFloat(volumeControl.value);
    backgroundMusic.volume = musicVolume;
}

function setupEventListeners() {
    if (badgenArea) badgenArea.addEventListener('click', clickBadgen);
    if (upgradeClickButton) upgradeClickButton.addEventListener('click', upgradeClick);
    if (upgradeAutoClickerButton) upgradeAutoClickerButton.addEventListener('click', upgradeAutoClicker);
    if (upgradeSuperClickerButton) upgradeSuperClickerButton.addEventListener('click', upgradeSuperClicker);
    if (saveUsernameButton) saveUsernameButton.addEventListener('click', saveUsername);
    if (saveGameButton) saveGameButton.addEventListener('click', saveGame);
    if (loadGameButton) loadGameButton.addEventListener('click', () => {
        loadGame();
        startIntervals();
        applyPreferences();
    });
    if (openSettingsButton) openSettingsButton.addEventListener('click', () => settingsMenu.classList.remove('hidden'));
    if (closeSettingsButton) closeSettingsButton.addEventListener('click', () => settingsMenu.classList.add('hidden'));
    if (themeToggleButton) themeToggleButton.addEventListener('change', toggleTheme);
    if (musicToggle) musicToggle.addEventListener('change', toggleMusic);
    if (volumeControl) volumeControl.addEventListener('input', updateVolume);
    if (savePreferencesButton) savePreferencesButton.addEventListener('click', savePreferences);
}

let autoClickInterval = null;
let leaderboardInterval = null;
let timerInterval = null;
let ppsInterval = null;
let aiInterval = null;

function startIntervals() {
    stopIntervals();

    autoClickInterval = setInterval(autoClick, 1000);
    leaderboardInterval = setInterval(updateLeaderboard, 5000);
    timerInterval = setInterval(updateTimer, 1000);
    ppsInterval = setInterval(() => {
        pointsPerSecond = calculatePointsPerSecond();
        updateDisplay();
    }, 1000);

    aiInterval = setInterval(() => {
        aiPlayers.forEach(player => {
            player.score += Math.floor(Math.random() * 100) + 50;
        });
        updateLeaderboard();
    }, 5000);
}

function stopIntervals() {
    clearInterval(autoClickInterval);
    clearInterval(leaderboardInterval);
    clearInterval(timerInterval);
    clearInterval(ppsInterval);
    clearInterval(aiInterval);
}

function calculatePointsPerSecond() {
    const basePPS = autoClickerCount;
    const currentPPS = basePPS * autoClickerSpeedBoost;
    return currentPPS;
}

initializeGame();
startIntervals();
