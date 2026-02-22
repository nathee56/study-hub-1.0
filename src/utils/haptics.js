export const triggerHaptic = (pattern = 50) => {
    // Check if running in a browser and if navigator.vibrate is supported
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        try {
            window.navigator.vibrate(pattern);
        } catch {
            // Ignore errors (some browsers might restrict it without interaction)
        }
    }
};
