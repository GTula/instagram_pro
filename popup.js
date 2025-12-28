// Popup script with premium features - handles UI interactions and communicates with content script

let isRunning = false;
let currentStats = { completed: 0, failed: 0 };
let licenseManager = null;
let isPremiumUser = false;

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
const actionsUsed = document.getElementById('actionsUsed');
const premiumSection = document.getElementById('premiumSection');
const premiumBtn = document.getElementById('premiumBtn');
const premiumStatus = document.getElementById('premiumStatus');
const licenseModal = document.getElementById('licenseModal');
const closeModal = document.getElementById('closeModal');
const activateBtn = document.getElementById('activateBtn');
const cancelBtn = document.getElementById('cancelBtn');
const licenseInput = document.getElementById('licenseInput');
const licenseError = document.getElementById('licenseError');
const licenseSuccess = document.getElementById('licenseSuccess');
const buyLicense = document.getElementById('buyLicense');
const turboOption = document.getElementById('turboOption');

// Initialize license manager
document.addEventListener('DOMContentLoaded', async () => {
  licenseManager = new LicenseManager();
  await initializePremiumFeatures();
});

// Initialize premium features
async function initializePremiumFeatures() {
  isPremiumUser = await licenseManager.isPremium();
  const trialActions = await licenseManager.getTrialActionsUsed();
  
  // Show premium section
  premiumSection.style.display = 'block';
  
  // Update UI based on premium status
  if (isPremiumUser) {
    const license = await licenseManager.getLicenseInfo();
    premiumStatus.innerHTML = `
      <p class="premium-active">
        <span class="premium-icon">✅</span>
        <strong>Premium Activo</strong>
        <small>Válido hasta: ${new Date(license.expiry).toLocaleDateString()}</small>
      </p>
    `;
    premiumBtn.textContent = '💎 Gestionar Licencia';
    premiumBtn.classList.remove('btn-premium');
    premiumBtn.classList.add('btn-secondary');
    
    // Enable turbo speed
    turboOption.classList.remove('locked');
    document.querySelector('input[value="turbo"]').disabled = false;
    
    // Update action limit help text
    document.getElementById('limitHelpText').textContent = 'Premium: acciones ilimitadas';
    
    // Update actions used display
    actionsUsed.textContent = '∞ Premium';
  } else {
    premiumStatus.innerHTML = `
      <p class="premium-inactive">
        <span class="premium-icon">🔒</span>
        <strong>Versión Gratuita</strong>
        <small>${100 - trialActions} acciones restantes</small>
      </p>
    `;
    
    // Lock turbo speed
    turboOption.classList.add('locked');
    document.querySelector('input[value="turbo"]').disabled = true;
    
    // Update actions used display
    actionsUsed.textContent = `${trialActions}/100`;
  }
}

// Premium button click
premiumBtn.addEventListener('click', () => {
  licenseModal.style.display = 'flex';
  licenseInput.value = '';
  licenseError.style.display = 'none';
  licenseSuccess.style.display = 'none';
});

// Close modal
closeModal.addEventListener('click', () => {
  licenseModal.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
  licenseModal.style.display = 'none';
});

// Activate license
activateBtn.addEventListener('click', async () => {
  const key = licenseInput.value.trim().toUpperCase();
  
  if (!key) {
    showLicenseError('Por favor ingresa una clave de licencia');
    return;
  }
  
  activateBtn.disabled = true;
  activateBtn.textContent = 'Activando...';
  
  const result = await licenseManager.activateLicense(key);
  
  if (result.success) {
    showLicenseSuccess('¡Licencia activada correctamente!');
    setTimeout(() => {
      licenseModal.style.display = 'none';
      initializePremiumFeatures();
    }, 1500);
  } else {
    showLicenseError(result.error || 'Error al activar la licencia');
  }
  
  activateBtn.disabled = false;
  activateBtn.textContent = 'Activar';
});

// Buy license link
buyLicense.addEventListener('click', (e) => {
  e.preventDefault();
  // Open purchase page - replace with your actual URL
  window.open('https://tu-sitio.com/buy-license', '_blank');
});

// Show license error
function showLicenseError(message) {
  licenseError.textContent = message;
  licenseError.style.display = 'block';
  licenseSuccess.style.display = 'none';
}

// Show license success
function showLicenseSuccess(message) {
  licenseSuccess.textContent = message;
  licenseSuccess.style.display = 'block';
  licenseError.style.display = 'none';
}

// Load saved settings
chrome.storage.sync.get(['speed', 'actionLimit'], (result) => {
  if (result.speed) {
    const speedRadio = document.querySelector(`input[name="speed"][value="${result.speed}"]`);
    if (speedRadio && !speedRadio.disabled) {
      speedRadio.checked = true;
    }
  }
  if (result.actionLimit) {
    actionLimitInput.value = result.actionLimit;
  }
});

// Save settings on change
document.querySelectorAll('input[name="speed"]').forEach(radio => {
  radio.addEventListener('change', async () => {
    // Check if turbo and not premium
    if (radio.value === 'turbo' && !isPremiumUser) {
      radio.checked = false;
      document.querySelector('input[name="speed"][value="fast"]').checked = true;
      updateStatus('Velocidad Turbo requiere Premium 💎', 'error');
      licenseModal.style.display = 'flex';
      return;
    }
    chrome.storage.sync.set({ speed: radio.value });
  });
});

actionLimitInput.addEventListener('change', () => {
  chrome.storage.sync.set({ actionLimit: actionLimitInput.value });
});

// Check if we're on Instagram
async function checkInstagramPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url) {
    updateStatus('Por favor, abre Instagram primero', 'error');
    followBtn.disabled = true;
    unfollowBtn.disabled = true;
    return false;
  }
  
  // Proper URL validation to prevent URL spoofing
  try {
    const url = new URL(tab.url);
    const isInstagram = url.hostname === 'instagram.com' || 
                       url.hostname === 'www.instagram.com' || 
                       url.hostname.endsWith('.instagram.com');
    
    if (!isInstagram) {
      updateStatus('Por favor, abre Instagram primero', 'error');
      followBtn.disabled = true;
      unfollowBtn.disabled = true;
      return false;
    }
  } catch (e) {
    updateStatus('URL inválida', 'error');
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
    moderate: { min: 5000, max: 10000, name: 'Moderada' },
    fast: { min: 2000, max: 4000, name: 'Rápida' },
    veryfast: { min: 500, max: 2000, name: 'Muy Rápida' },
    turbo: { min: 100, max: 500, name: 'Turbo' }
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
  
  const limit = parseInt(actionLimitInput.value, 10) || 50;
  const speedSettings = getSpeedSettings();
  
  // Check premium restrictions
  const canPerform = await licenseManager.canPerformAction(limit, speedSettings.name.toLowerCase());
  
  if (!canPerform.allowed) {
    if (canPerform.reason === 'premium_speed') {
      updateStatus('Velocidad Turbo requiere Premium 💎', 'error');
      licenseModal.style.display = 'flex';
    } else if (canPerform.reason === 'premium_limit') {
      updateStatus('Más de 100 acciones requiere Premium 💎', 'error');
      licenseModal.style.display = 'flex';
    } else if (canPerform.reason === 'trial_exceeded') {
      updateStatus('Has alcanzado el límite gratuito (100 acciones) 💎', 'error');
      licenseModal.style.display = 'flex';
    }
    return;
  }
  
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
    // Update trial actions if not premium
    if (!isPremiumUser) {
      licenseManager.incrementTrialActions(1).then(total => {
        actionsUsed.textContent = `${total}/100`;
      });
    }
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
