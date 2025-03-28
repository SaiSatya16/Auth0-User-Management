<template>
    <div class="user-form">
      <div class="d-flex align-items-center mb-4">
        <router-link to="/users" class="btn btn-link">
          <i class="bi bi-arrow-left"></i> Back to Users
        </router-link>
      </div>
      
      <h2>{{ isEditMode ? 'Edit User' : 'Create User' }}</h2>
      
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      
      <form v-else @submit.prevent="submitForm" class="card mt-4">
        <div class="card-body">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              class="form-control" 
              required
            />
          </div>
          
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              class="form-control"
            />
          </div>
          
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="formData.username" 
              class="form-control"
            />
          </div>
          
          <div v-if="!isEditMode" class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="formData.password" 
              class="form-control"
              required
            />
            <small class="form-text text-muted">
              Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
            </small>
          </div>
          
          <div v-if="!isEditMode" class="mb-3">
            <label for="connection" class="form-label">Connection</label>
            <select id="connection" v-model="formData.connection" class="form-select">
              <option value="Username-Password-Authentication">Username-Password-Authentication</option>
              <option value="google-oauth2">Google OAuth2</option>
              <option value="Satya-test-db">Satya-test-db</option>
            </select>
          </div>
        </div>
        
        <div class="card-footer">
          <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update' : 'Create' }}</button>
          <router-link to="/users" class="btn btn-secondary ms-2">Cancel</router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import api from '@/services/api'
  
  export default {
    name: 'UserForm',
    data() {
      return {
        formData: {
          email: '',
          name: '',
          username: '',
          password: '',
          connection: 'Username-Password-Authentication'
        },
        loading: false,
        error: null
      }
    },
    computed: {
      isEditMode() {
        return !!this.$route.params.id
      }
    },
    mounted() {
      if (this.isEditMode) {
        this.fetchUser()
      }
    },
    methods: {
      async fetchUser() {
        this.loading = true
        try {
          const response = await api.getUser(this.$route.params.id)
          const userData = response.data
          
          this.formData = {
            email: userData.email || '',
            name: userData.name || '',
            username: userData.username || '',
                  }
          
          this.error = null
        } catch (error) {
          this.error = 'Error loading user: ' + (error.response?.data?.message || error.message)
        } finally {
          this.loading = false
        }
      },
      async submitForm() {
        this.loading = true
        try {
          if (this.isEditMode) {
            await api.updateUser(this.$route.params.id, this.formData)
          } else {
            await api.createUser(this.formData)
          }
          
          this.$router.push('/users')
        } catch (error) {
          this.error = `Error ${this.isEditMode ? 'updating' : 'creating'} user: ` + 
                      (error.response?.data?.message || error.message)
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  