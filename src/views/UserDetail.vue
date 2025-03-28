<template>
    <div class="user-detail">
      <div class="d-flex align-items-center mb-4">
        <router-link to="/users" class="btn btn-link">
          <i class="bi bi-arrow-left"></i> Back to Users
        </router-link>
      </div>
      
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      
      <div v-else>
        <div class="user-header d-flex align-items-center mb-4">
          <div class="user-avatar">
            {{ getInitials(user.name || user.email) }}
          </div>
          <div class="ms-3">
            <h2>{{ user.email }}</h2>
            <div class="text-muted">{{ user.user_id }}</div>
          </div>
          <div class="ms-auto">
            <div class="dropdown">
              <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Actions
              </button>
              <ul class="dropdown-menu">
                <li><router-link class="dropdown-item" :to="`/users/${user.user_id}/edit`">Edit</router-link></li>
                <li><a class="dropdown-item text-danger" href="#" @click.prevent="confirmDelete">Delete</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a class="nav-link active" href="#">Details</a>
          </li>
        </ul>
        
        <div class="card">
          <div class="card-body">
            <div class="row mb-4">
              <div class="col-md-4">
                <label class="form-label">Name</label>
                <div>{{ user.name || user.email }}</div>
                <div class="mt-2">
                  <router-link :to="`/users/${user.user_id}/edit`" class="btn btn-sm btn-link p-0">Edit</router-link>
                </div>
              </div>
              
              <div class="col-md-4">
                <label class="form-label">Email</label>
                <div>{{ user.email }}</div>
                <div class="mt-2">
                  <router-link :to="`/users/${user.user_id}/edit`" class="btn btn-sm btn-link p-0">Edit</router-link>
                </div>
              </div>
              
              <div class="col-md-4">
                <label class="form-label">Username</label>
                <div>{{ user.username || 'Not set' }}</div>
                <div class="mt-2">
                  <router-link :to="`/users/${user.user_id}/edit`" class="btn btn-sm btn-link p-0">Edit</router-link>
                </div>
              </div>
            </div>
            
            <div class="row mb-4">
              <div class="col-md-4">
                <label class="form-label">Phone Number</label>
                <div>
                  <span class="badge bg-secondary">UNVERIFIED</span>
                </div>
                <div class="mt-2">
                  <router-link :to="`/users/${user.user_id}/edit`" class="btn btn-sm btn-link p-0">Edit</router-link>
                </div>
              </div>
              
              <div class="col-md-4">
                <label class="form-label">Signed Up</label>
                <div>{{ formatDate(user.created_at) }}</div>
              </div>
              
              <div class="col-md-4">
                <label class="form-label">Primary Identity Provider</label>
                <div>{{ user.identities && user.identities[0] ? user.identities[0].provider : 'Database' }}</div>
              </div>
            </div>
            
            <div class="row mb-4">
              <div class="col-md-4">
                <label class="form-label">Latest Login</label>
                <div>{{ formatDate(user.last_login) }}</div>
              </div>
              
              <div class="col-md-4">
                <label class="form-label">Accounts Associated</label>
                <div>None</div>
              </div>
              
              <div class="col-md-4">
                <label class="form-label">Browser</label>
                <div>Other 0.0.0 / Windows 0.0.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true" ref="deleteModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Delete</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this user?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" @click="deleteUser">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '@/services/api'
  import { Modal } from 'bootstrap'
  
  export default {
    name: 'UserDetail',
    data() {
      return {
        user: {},
        loading: true,
        error: null,
        deleteModal: null
      }
    },
    mounted() {
      this.fetchUser()
      this.deleteModal = new Modal(this.$refs.deleteModal)
    },
    methods: {
      async fetchUser() {
        this.loading = true
        try {
          const response = await api.getUser(this.$route.params.id)
          this.user = response.data
          this.error = null
        } catch (error) {
          this.error = 'Error loading user details: ' + (error.response?.data?.message || error.message)
        } finally {
          this.loading = false
        }
      },
      getInitials(name) {
        if (!name) return 'U'
        return name.split(' ')
          .map(part => part.charAt(0).toUpperCase())
          .slice(0, 2)
          .join('')
      },
      formatDate(dateString) {
        if (!dateString) return 'Never'
        
        const date = new Date(dateString)
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }
        return date.toLocaleDateString('en-US', options)
      },
      confirmDelete() {
        this.deleteModal.show()
      },
      async deleteUser() {
        try {
          await api.deleteUser(this.user.user_id)
          this.deleteModal.hide()
          this.$router.push('/users')
        } catch (error) {
          this.error = 'Error deleting user: ' + (error.response?.data?.message || error.message)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.5rem;
  }
  
  .nav-tabs .nav-link.active {
    border-bottom: 2px solid var(--primary-color);
    color: var(--primary-color);
    font-weight: bold;
  }
  </style>
  