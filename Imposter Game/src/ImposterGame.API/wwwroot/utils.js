// Utility Functions for Imposter Game

/**
 * Parse API response handling empty responses and various formats
 */
async function parseResponse(response) {
    const text = await response.text();
    
    // Handle empty response
    if (!text || text.trim() === '') {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        // If response is just a plain string (like an ID)
        const cleanText = text.replace(/"/g, '').trim();
        
        // Try to determine what type of response it is
        if (cleanText.includes('-')) {
            // Looks like a UUID
            return { id: cleanText };
        }
        
        return { value: cleanText };
    }
}

/**
 * Show a message to the user
 */
function showMessage(message, type = 'info') {
    const messageArea = document.getElementById('messageArea');
    if (!messageArea) return;
    
    const div = document.createElement('div');
    div.className = type;
    div.textContent = message;
    
    messageArea.innerHTML = '';
    messageArea.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, MESSAGE_TIMEOUT);
}

/**
 * Get current timestamp
 */
function getTimestamp() {
    return new Date().toISOString();
}

/**
 * Format player name
 */
function formatPlayerName(player) {
    return player.name || player.playerName || 'Unknown';
}

/**
 * Get phase name from phase number
 */
function getPhaseName(phase) {
    const phaseNames = ['Waiting', 'Playing', 'Voting', 'Ended'];
    return phaseNames[phase] || 'Unknown';
}

/**
 * Check if user is authenticated
 */
function checkAuth() {
    const roomId = sessionStorage.getItem('roomId');
    const playerId = sessionStorage.getItem('playerId');
    
    if (!roomId || !playerId) {
        showMessage('Session expired. Redirecting to home...', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return false;
    }
    
    return true;
}

/**
 * Debounce function to prevent excessive API calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showMessage('Copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showMessage('Copied to clipboard!', 'success');
        } catch (err) {
            showMessage('Failed to copy', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}
