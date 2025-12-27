// Popup script - handles UI interactions and communicates with content script

let isRunning = false;
let currentStats = { completed: 0, failed: 0 };

// Elements
const followBtn = document.getElementById('followBtn');
const unfollowBtn = document.getElementById('unfollowBtn');
const stopBtn = document.getElementById('stopBtn');
const statusText = document.getElementById('statusText');
const statusDot = document.querySelector('.status-dot');
const progressContainer = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const completedCount = document.getElementById('completedCount');
const failedCount = document.getElementById('failedCount');
const actionLimitInput = document.getElementById('actionLimit');

// Load saved settings
chrome.storage.sync.get(['speed', 'actionLimit'], (result) => {
  if (result.speed) {
    document.querySelector(`input[name="speed"][value="${result.speed}"]`).checked = true;
  }
  if (result.actionLimit) {
    actionLimitInput.value = result.actionLimit;
  }
});

// Save settings on change
document.querySelectorAll('input[name="speed"]').forEach(radio => {
  radio.addEventListener('change', () => {
    chrome.storage.sync.set({ speed: radio.value });
  });
});

actionLimitInput.addEventListener('change', () => {
  chrome.storage.sync.set({ actionLimit: actionLimitInput.value });
});

// Check if we're on Instagram
async function checkInstagramPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url || !tab.url.includes('instagram.com')) {
    updateStatus('Por favor, abre Instagram primero', 'error');
    followBtn.disabled = true;
    unfollowBtn.disabled = true;
    return false;
  }
  
  followBtn.disabled = false;
  unfollowBtn.disabled = false;
  return true;
}

// Update status
function updateStatus(message, type = 'info') {
  statusText.textContent = message;
  statusDot.className = 'status-dot';
  if (type === 'active') {
    statusDot.classList.add('active');
  } else if (type === 'error') {
    statusDot.classList.add('error');
  }
}

// Update progress
function updateProgress(current, total) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `${current} de ${total}`;
}

// Update stats
function updateStats(completed, failed) {
  completedCount.textContent = completed;
  failedCount.textContent = failed;
  currentStats = { completed, failed };
}

// Get speed settings
function getSpeedSettings() {
  const speed = document.querySelector('input[name="speed"]:checked').value;
  const settings = {
    safe: { min: 15000, max: 25000, name: 'Segura' },
    moderate: { min: 8000, max: 15000, name: 'Moderada' },
    fast: { min: 3000, max: 8000, name: 'Rápida' }
  };
  return settings[speed];
}

// Send message to content script
async function sendMessageToContent(action, data) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      action,
      ...data
    });
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

// Start operation
async function startOperation(type) {
  if (isRunning) return;
  
  const isOnInstagram = await checkInstagramPage();
  if (!isOnInstagram) return;
  
  const limit = parseInt(actionLimitInput.value) || 50;
  const speedSettings = getSpeedSettings();
  
  // Update UI
  isRunning = true;
  followBtn.style.display = 'none';
  unfollowBtn.style.display = 'none';
  stopBtn.style.display = 'block';
  progressContainer.style.display = 'block';
  
  updateStatus(`Iniciando ${type === 'follow' ? 'follows' : 'unfollows'} (${speedSettings.name})...`, 'active');
  updateProgress(0, limit);
  updateStats(0, 0);
  
  // Send message to content script
  const response = await sendMessageToContent('START_OPERATION', {
    type,
    limit,
    delay: speedSettings
  });
  
  if (!response || !response.success) {
    updateStatus(response?.message || 'Error al iniciar operación', 'error');
    resetUI();
  }
}

// Stop operation
async function stopOperation() {
  await sendMessageToContent('STOP_OPERATION');
  updateStatus('Operación detenida', 'info');
  resetUI();
}

// Reset UI
function resetUI() {
  isRunning = false;
  followBtn.style.display = 'block';
  unfollowBtn.style.display = 'block';
  stopBtn.style.display = 'none';
}

// Event listeners
followBtn.addEventListener('click', () => startOperation('follow'));
unfollowBtn.addEventListener('click', () => startOperation('unfollow'));
stopBtn.addEventListener('click', stopOperation);

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'UPDATE_PROGRESS') {
    updateProgress(message.current, message.total);
  } else if (message.action === 'UPDATE_STATS') {
    updateStats(message.completed, message.failed);
  } else if (message.action === 'UPDATE_STATUS') {
    updateStatus(message.message, message.type);
  } else if (message.action === 'OPERATION_COMPLETE') {
    updateStatus(`Completado: ${message.completed} exitosas, ${message.failed} fallidas`, 'info');
    resetUI();
  } else if (message.action === 'OPERATION_ERROR') {
    updateStatus(message.message, 'error');
    resetUI();
  }
});

// Initialize
checkInstagramPage();
