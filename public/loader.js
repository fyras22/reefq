(function() {
  // Configuration defaults
  const DEFAULT_CONFIG = {
    theme: 'luxury',
    language: 'en',
    containerId: 'reefq-container',
    analytics: true,
    debug: false
  };

  // Global state
  let config = { ...DEFAULT_CONFIG };
  let container = null;
  let isInitialized = false;

  // Utility functions
  const log = (...args) => {
    if (config.debug) {
      console.log('[Reefq]', ...args);
    }
  };

  const error = (...args) => {
    console.error('[Reefq]', ...args);
  };

  // Analytics tracking
  const track = (event, data = {}) => {
    if (!config.analytics) return;
    
    try {
      const analyticsData = {
        event,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        ...data
      };
      
      // Send to analytics endpoint
      fetch('https://api.reefq.com/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData),
        keepalive: true // Ensure request completes even if page is unloaded
      }).catch(err => error('Analytics error:', err));
    } catch (err) {
      error('Analytics error:', err);
    }
  };

  // Create container element
  const createContainer = () => {
    if (container) return container;

    container = document.createElement('div');
    container.id = config.containerId;
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    `;
    closeButton.onclick = () => hideViewer();
    container.appendChild(closeButton);

    document.body.appendChild(container);
    return container;
  };

  // Load 3D viewer
  const loadViewer = async (productId) => {
    try {
      track('viewer_load_start', { productId });
      
      // Show loading state
      container.style.display = 'flex';
      container.innerHTML = `
        <div style="color: white; text-align: center;">
          <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #C0A080; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          <p style="margin-top: 20px;">Loading 3D Viewer...</p>
        </div>
      `;

      // Load viewer script dynamically
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://cdn.reefq.com/viewer.js?theme=${config.theme}&lang=${config.language}`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Initialize viewer
      if (window.ReefqViewer) {
        await window.ReefqViewer.init({
          container,
          productId,
          theme: config.theme,
          language: config.language
        });
        
        track('viewer_load_complete', { productId });
      } else {
        throw new Error('Viewer script failed to load');
      }
    } catch (err) {
      error('Failed to load viewer:', err);
      track('viewer_load_error', { productId, error: err.message });
      
      // Show error state
      container.innerHTML = `
        <div style="color: white; text-align: center;">
          <p>Failed to load 3D viewer. Please try again later.</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #C0A080; border: none; border-radius: 4px; color: white; cursor: pointer;">
            Retry
          </button>
        </div>
      `;
    }
  };

  // Hide viewer
  const hideViewer = () => {
    if (container) {
      container.style.display = 'none';
      if (window.ReefqViewer) {
        window.ReefqViewer.destroy();
      }
    }
  };

  // Initialize product triggers
  const initProductTriggers = () => {
    const triggers = document.querySelectorAll('[data-reefq-product]');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = trigger.getAttribute('data-reefq-product');
        loadViewer(productId);
      });
    });
  };

  // Main initialization
  const init = (userConfig = {}) => {
    if (isInitialized) {
      log('Already initialized');
      return;
    }

    try {
      // Merge user config with defaults
      config = { ...DEFAULT_CONFIG, ...userConfig };
      
      // Create container
      createContainer();
      
      // Initialize product triggers
      initProductTriggers();
      
      // Track initialization
      track('init_complete', { config });
      
      isInitialized = true;
      log('Initialized successfully');
    } catch (err) {
      error('Initialization failed:', err);
      track('init_error', { error: err.message });
    }
  };

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Export global API
  window.Reefq = {
    init,
    loadViewer,
    hideViewer,
    track
  };

  // Auto-initialize if config is present
  if (window.REEFQ_CONFIG) {
    init(window.REEFQ_CONFIG);
  }
})(); 