<template>
  <div class="app-container">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">User Management</router-link>
        <div class="d-flex">
          <button class="btn theme-toggle" @click="toggleTheme">
            <i :class="isDark ? 'bi bi-sun' : 'bi bi-moon'"></i>
          </button>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import themeService from '@/services/theme'

export default {
  name: 'App',
  data() {
    return {
      isDark: false
    }
  },
  created() {
    this.isDark = themeService.getTheme()
    themeService.setTheme(this.isDark)
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('theme') === null) {
        this.isDark = e.matches
        themeService.setTheme(this.isDark)
      }
    })
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      themeService.setTheme(this.isDark)
    }
  }
}
</script>


<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

:root {
  --bg-color: #ffffff;
  --text-color: #212529;
  --card-bg: #f8f9fa;
  --border-color: #dee2e6;
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --input-bg: #ffffff;
  --input-border: #ced4da;
  --table-stripe: rgba(0, 0, 0, 0.05);
  --nav-link: #495057;
  --nav-link-active: #0d6efd;
  --dropdown-bg: #ffffff;
  --dropdown-link-hover: #f8f9fa;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --bg-color: #121212;
  --text-color: #e1e1e1;
  --card-bg: #1e1e1e;
  --border-color: #2d2d2d;
  --primary-color: #4d94ff;
  --secondary-color: #a0a0a0;
  --input-bg: #2c2c2c;
  --input-border: #444444;
  --table-stripe: rgba(255, 255, 255, 0.05);
  --nav-link: #b0b0b0;
  --nav-link-active: #4d94ff;
  --dropdown-bg: #2c2c2c;
  --dropdown-link-hover: #383838;
  --shadow-color: rgba(0, 0, 0, 0.5);
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.navbar {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.navbar-brand {
  color: var(--text-color);
}

.card {
  background-color: var(--card-bg);
  border-color: var(--border-color);
  box-shadow: 0 2px 5px var(--shadow-color);
}

.table {
  color: var(--text-color);
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: var(--table-stripe);
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.theme-toggle:hover {
  transform: rotate(30deg);
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-secondary {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.form-control, .form-select {
  background-color: var(--input-bg);
  border-color: var(--input-border);
  color: var(--text-color);
}

.form-control:focus, .form-select:focus {
  background-color: var(--input-bg);
  color: var(--text-color);
  box-shadow: 0 0 0 0.25rem rgba(77, 148, 255, 0.25);
}

.nav-tabs .nav-link {
  color: var(--nav-link);
}

.nav-tabs .nav-link.active {
  background-color: transparent;
  border-color: transparent;
  color: var(--nav-link-active);
}

.dropdown-menu {
  background-color: var(--dropdown-bg);
  border-color: var(--border-color);
}

.dropdown-item {
  color: var(--text-color);
}

.dropdown-item:hover {
  background-color: var(--dropdown-link-hover);
}

.modal-content {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

.modal-header, .modal-footer {
  border-color: var(--border-color);
}

a {
  color: var(--primary-color);
}

[data-theme="dark"] a {
  color: #6ca9ff;
}
</style>
