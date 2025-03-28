// src/services/theme.js
export default {
  setTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  },
  
  getTheme() {
    const savedTheme = localStorage.getItem('theme')
    // Check for system preference if no saved preference
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return savedTheme === 'dark'
  }
}
