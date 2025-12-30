// Content script - runs on Instagram pages and performs the operations

let isOperationRunning = false;
let shouldStop = false;
let operationStats = { completed: 0, failed: 0 };

// Random delay between min and max
function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Send message to popup
function sendMessageToPopup(action, data) {
  chrome.runtime.sendMessage({ action, ...data }).catch((error) => {
    // Popup might be closed, which is expected behavior
    console.log('Popup not available:', error.message);
  });
}

// Click button with human-like behavior
async function clickButton(button) {
  // Scroll element into view
  button.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await sleep(randomDelay(200, 500));
  
  // Click the button
  button.click();
  
  // Wait for Instagram to process
  await sleep(randomDelay(800, 1500));
}

// Find follow/unfollow buttons on the page
function findActionButtons(type) {
  const buttons = [];
  
  // Instagram uses different button texts and structures
  // This covers various Instagram layouts (followers list, following list, explore, profile)
  const allButtons = document.querySelectorAll('button');
  
  allButtons.forEach(button => {
    const buttonText = button.innerText.toLowerCase().trim();
    
    if (type === 'follow') {
      // Look for "Seguir" or "Follow" buttons (not "Siguiendo" / "Following")
      if ((buttonText === 'seguir' || buttonText === 'follow') && 
          !buttonText.includes('siguiendo') && 
          !buttonText.includes('following')) {
        // Make sure it's not disabled and visible
        if (!button.disabled && button.offsetParent !== null) {
          buttons.push(button);
        }
      }
    } else if (type === 'unfollow') {
      // Look for "Siguiendo" or "Following" buttons
      if (buttonText === 'siguiendo' || buttonText === 'following') {
        // Make sure it's not disabled and visible
        if (!button.disabled && button.offsetParent !== null) {
          buttons.push(button);
        }
      }
    }
  });
  
  return buttons;
}

// Confirm unfollow in dialog (Instagram shows confirmation)
async function confirmUnfollow() {
  await sleep(500);
  
  // Look for the confirmation button in the dialog
  const dialogButtons = document.querySelectorAll('button');
  
  for (const button of dialogButtons) {
    const buttonText = button.innerText.toLowerCase().trim();
    // Look for "Dejar de seguir" or "Unfollow" in the confirmation dialog
    if (buttonText === 'dejar de seguir' || buttonText === 'unfollow') {
      await clickButton(button);
      return true;
    }
  }
  
  return false;
}

// Scroll to load more users
async function scrollToLoadMore() {
  // Find the scrollable dialog/list - check both role="dialog" containers and computed overflow
  const dialogDivs = document.querySelectorAll('[role="dialog"] > div');
  
  for (const element of dialogDivs) {
    const computedStyle = window.getComputedStyle(element);
    const isScrollable = computedStyle.overflow === 'auto' || 
                        computedStyle.overflow === 'scroll' || 
                        computedStyle.overflowY === 'auto' || 
                        computedStyle.overflowY === 'scroll';
    
    if (isScrollable && element.scrollHeight > element.clientHeight) {
      const scrollTop = element.scrollTop;
      element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
      await sleep(randomDelay(1500, 2500));
      
      // Check if new content loaded
      return element.scrollTop !== scrollTop;
    }
  }
  
  // Fallback: scroll the page
  window.scrollBy({ top: 500, behavior: 'smooth' });
  await sleep(randomDelay(1500, 2500));
  return true;
}

// Perform the operation
async function performOperation(type, limit, delay) {
  if (isOperationRunning) {
    return { success: false, message: 'Ya hay una operación en curso' };
  }
  
  isOperationRunning = true;
  shouldStop = false;
  operationStats = { completed: 0, failed: 0 };
  
  sendMessageToPopup('UPDATE_STATUS', { 
    message: `Buscando usuarios para ${type === 'follow' ? 'seguir' : 'dejar de seguir'}...`, 
    type: 'active' 
  });
  
  let processedCount = 0;
  let retryCount = 0;
  const maxRetries = 3;
  
  try {
    while (processedCount < limit && !shouldStop) {
      // Find buttons
      const buttons = findActionButtons(type);
      
      if (buttons.length === 0) {
        // Try to scroll and load more
        if (retryCount < maxRetries) {
          sendMessageToPopup('UPDATE_STATUS', { 
            message: 'Cargando más usuarios...', 
            type: 'active' 
          });
          
          await scrollToLoadMore();
          retryCount++;
          continue;
        } else {
          // No more buttons found
          sendMessageToPopup('UPDATE_STATUS', { 
            message: 'No se encontraron más usuarios', 
            type: 'info' 
          });
          break;
        }
      }
      
      retryCount = 0; // Reset retry count when we find buttons
      
      // Process available buttons
      for (const button of buttons) {
        if (processedCount >= limit || shouldStop) break;
        
        try {
          sendMessageToPopup('UPDATE_STATUS', { 
            message: `${type === 'follow' ? 'Siguiendo' : 'Dejando de seguir'} usuario ${processedCount + 1}/${limit}...`, 
            type: 'active' 
          });
          
          // Click the button
          await clickButton(button);
          
          // If unfollowing, confirm the action
          if (type === 'unfollow') {
            const confirmed = await confirmUnfollow();
            if (!confirmed) {
              throw new Error('No se pudo confirmar');
            }
          }
          
          operationStats.completed++;
          processedCount++;
          
          // Update progress
          sendMessageToPopup('UPDATE_PROGRESS', { current: processedCount, total: limit });
          sendMessageToPopup('UPDATE_STATS', { 
            completed: operationStats.completed, 
            failed: operationStats.failed 
          });
          
          // Random delay between actions
          if (processedCount < limit && !shouldStop) {
            const waitTime = randomDelay(delay.min, delay.max);
            sendMessageToPopup('UPDATE_STATUS', { 
              message: `Esperando ${Math.round(waitTime / 1000)}s antes de continuar...`, 
              type: 'active' 
            });
            await sleep(waitTime);
          }
          
        } catch (error) {
          console.error('Error processing button:', error);
          operationStats.failed++;
          sendMessageToPopup('UPDATE_STATS', { 
            completed: operationStats.completed, 
            failed: operationStats.failed 
          });
        }
      }
      
      // Scroll to load more users if we haven't reached the limit
      if (processedCount < limit && !shouldStop) {
        await scrollToLoadMore();
      }
    }
    
    // Operation completed
    isOperationRunning = false;
    
    sendMessageToPopup('OPERATION_COMPLETE', {
      completed: operationStats.completed,
      failed: operationStats.failed
    });
    
    return { success: true };
    
  } catch (error) {
    isOperationRunning = false;
    console.error('Error in operation:', error);
    
    sendMessageToPopup('OPERATION_ERROR', {
      message: `Error: ${error.message}`
    });
    
    return { success: false, message: error.message };
  }
}

// Stop the operation
function stopOperation() {
  shouldStop = true;
  isOperationRunning = false;
  sendMessageToPopup('UPDATE_STATUS', { 
    message: 'Deteniendo operación...', 
    type: 'info' 
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'START_OPERATION') {
    // Check if on Instagram with proper URL validation
    try {
      const url = new URL(window.location.href);
      const isInstagram = url.hostname === 'instagram.com' || 
                         url.hostname === 'www.instagram.com' || 
                         url.hostname.endsWith('.instagram.com');
      
      if (!isInstagram) {
        sendResponse({ success: false, message: 'Debes estar en Instagram' });
        return;
      }
    } catch (e) {
      sendResponse({ success: false, message: 'URL inválida' });
      return;
    }
    
    // Start the operation
    performOperation(message.type, message.limit, message.delay)
      .then(result => {
        // Operation result already sent via sendMessageToPopup
      });
    
    sendResponse({ success: true });
  } else if (message.action === 'STOP_OPERATION') {
    stopOperation();
    sendResponse({ success: true });
  }
  
  return true; // Keep the message channel open for async response
});

// Notify that content script is ready
console.log('Instagram Pro extension loaded');
