// License management for Instagram Pro
// Handles premium feature validation and license checking

class LicenseManager {
  constructor() {
    this.LICENSE_KEY = 'instagram_pro_license';
    this.TRIAL_ACTIONS_KEY = 'trial_actions_used';
    this.FREE_LIMIT = 100;
  }

  // Check if user has premium license
  async isPremium() {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.LICENSE_KEY], (result) => {
        const license = result[this.LICENSE_KEY];
        if (license && this.validateLicense(license)) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // Get trial actions used
  async getTrialActionsUsed() {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.TRIAL_ACTIONS_KEY], (result) => {
        resolve(result[this.TRIAL_ACTIONS_KEY] || 0);
      });
    });
  }

  // Increment trial actions
  async incrementTrialActions(count) {
    const current = await this.getTrialActionsUsed();
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.TRIAL_ACTIONS_KEY]: current + count }, () => {
        resolve(current + count);
      });
    });
  }

  // Check if action is allowed
  async canPerformAction(actionCount, speed) {
    const isPremium = await this.isPremium();
    
    // Check speed restrictions
    if (speed === 'turbo' && !isPremium) {
      return { allowed: false, reason: 'premium_speed' };
    }

    // Check action count restrictions
    if (actionCount > this.FREE_LIMIT && !isPremium) {
      return { allowed: false, reason: 'premium_limit' };
    }

    // Check total trial actions
    const trialUsed = await this.getTrialActionsUsed();
    if (trialUsed >= this.FREE_LIMIT && !isPremium) {
      return { allowed: false, reason: 'trial_exceeded' };
    }

    return { allowed: true };
  }

  // Validate license key format
  validateLicense(license) {
    if (!license || !license.key || !license.expiry) {
      return false;
    }

    // Check if license is expired
    const expiryDate = new Date(license.expiry);
    const now = new Date();
    if (expiryDate < now) {
      return false;
    }

    // Simple validation - in production, this should verify with a server
    return license.key.length === 32 && license.key.match(/^[A-Z0-9]{32}$/);
  }

  // Activate license
  async activateLicense(licenseKey) {
    // In production, this should verify with your server
    // For now, we'll do basic validation
    if (licenseKey.length !== 32 || !licenseKey.match(/^[A-Z0-9]{32}$/)) {
      return { success: false, error: 'Clave de licencia inválida' };
    }

    const license = {
      key: licenseKey,
      expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      activated: new Date().toISOString()
    };

    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.LICENSE_KEY]: license }, () => {
        resolve({ success: true });
      });
    });
  }

  // Deactivate license
  async deactivateLicense() {
    return new Promise((resolve) => {
      chrome.storage.local.remove([this.LICENSE_KEY], () => {
        resolve({ success: true });
      });
    });
  }

  // Get license info
  async getLicenseInfo() {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.LICENSE_KEY], (result) => {
        resolve(result[this.LICENSE_KEY] || null);
      });
    });
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LicenseManager;
}
