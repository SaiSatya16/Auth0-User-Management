<template>
    <div class="users-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Users</h2>
        <router-link to="/users/new" class="btn btn-primary">
          <i class="bi bi-plus"></i> Create User
        </router-link>
      </div>
      
      <div class="mb-4">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" placeholder="Search for users" v-model="searchQuery">
          <button class="btn btn-outline-secondary" @click="searchQuery = ''">Reset</button>
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Connection</th>
              <th>Logins</th>
              <th>Latest Login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.user_id">
              <td>
                <div class="d-flex align-items-center">
                  <div class="user-avatar">
                    {{ getInitials(user.name || user.email) }}
                  </div>
                  <div class="ms-3">
                    <div>{{ user.email }}</div>
                    <div class="text-muted small">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td>{{ user.connection || 'Username-Password-Authentication' }}</td>
              <td>{{ user.logins_count || 0 }}</td>
              <td>{{ formatDate(user.last_login) }}</td>
              <td>
                <div class="dropdown">
                  <button class="btn btn-sm btn-link" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><router-link class="dropdown-item" :to="`/users/${user.user_id}`">View</router-link></li>
                    <li><router-link class="dropdown-item" :to="`/users/${user.user_id}/edit`">Edit</router-link></li>
                    <li><a class="dropdown-item text-danger" href="#" @click.prevent="confirmDelete(user)">Delete</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
    name: 'UserList',
    data() {
      return {
        users: [],
        searchQuery: '',
        selectedUser: null,
        deleteModal: null
      }
    },
    computed: {
      filteredUsers() {
        if (!this.searchQuery) return this.users
        
        const query = this.searchQuery.toLowerCase()
        return this.users.filter(user => 
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.name && user.name.toLowerCase().includes(query))
        )
      }
    },
    mounted() {
      this.fetchUsers()
      this.deleteModal = new Modal(this.$refs.deleteModal)
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await api.getUsers()
          this.users = response.data
        } catch (error) {
          console.error('Error fetching users:', error)
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
        const now = new Date()
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
        
        if (diffDays < 1) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
        return `${Math.floor(diffDays / 365)} years ago`
      },
      confirmDelete(user) {
        this.selectedUser = user
        this.deleteModal.show()
      },
      async deleteUser() {
        if (!this.selectedUser) return
        
        try {
          await api.deleteUser(this.selectedUser.user_id)
          this.users = this.users.filter(u => u.user_id !== this.selectedUser.user_id)
          this.deleteModal.hide()
        } catch (error) {
          console.error('Error deleting user:', error)
        }
      }
    }
  }
  </script>
  
  <style scoped>
.users-container {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.table {
  color: var(--text-color);
  background-color: var(--bg-color);
}

.table th {
  border-color: var(--border-color);
}

.table td {
  border-color: var(--border-color);
}

.form-control {
  background-color: var(--input-bg);
  color: var(--text-color);
  border-color: var(--input-border);
}

.form-control:focus {
  background-color: var(--input-bg);
  color: var(--text-color);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

  </style>