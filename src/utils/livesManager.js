const MAX_LIVES = 5;
const REGEN_INTERVAL = 3 * 60 * 1000;

const STORAGE_KEYS = {
  LIVES: "lives",
  LAST_UPDATE: "lastLifeUpdate",
};

function getLives() {
  const storedLives = parseInt(localStorage.getItem(STORAGE_KEYS.LIVES), 10);
  return isNaN(storedLives) ? MAX_LIVES : storedLives;
}

function getLastUpdate() {
  const storedTime = parseInt(
    localStorage.getItem(STORAGE_KEYS.LAST_UPDATE),
    10
  );
  return isNaN(storedTime) ? Date.now() : storedTime;
}

function saveLives(lives) {
  localStorage.setItem(STORAGE_KEYS.LIVES, lives.toString());
}

function saveLastUpdate(time) {
  localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, time.toString());
}

function regenerateLives(currentLives, lastUpdate) {
  const now = Date.now();
  let newLives = currentLives;
  let newLastUpdate = lastUpdate;

  while (newLives < MAX_LIVES && now - newLastUpdate >= REGEN_INTERVAL) {
    newLives++;
    newLastUpdate += REGEN_INTERVAL;
  }

  if (newLives !== currentLives) {
    saveLives(newLives);
    saveLastUpdate(newLastUpdate);
  }

  return { lives: newLives, lastUpdate: newLastUpdate };
}

function calculateCurrentLives() {
  const storedLives = getLives();
  const storedLastUpdate = getLastUpdate();

  const { lives: newLives, lastUpdate: newLastUpdate } = regenerateLives(
    storedLives,
    storedLastUpdate
  );

  // Обновляем localStorage, если изменилось
  if (newLives !== storedLives || newLastUpdate !== storedLastUpdate) {
    saveLives(newLives);
    saveLastUpdate(newLastUpdate);
  }

  return { lives: newLives, lastUpdate: newLastUpdate };
}

function consumeLife(currentLives) {
  if (currentLives <= 0) return 0;
  const newLives = currentLives - 1;
  saveLives(newLives);
  saveLastUpdate(Date.now());
  return newLives;
}

export {
  MAX_LIVES,
  REGEN_INTERVAL,
  getLives,
  getLastUpdate,
  saveLives,
  saveLastUpdate,
  regenerateLives,
  consumeLife,
  calculateCurrentLives,
};
