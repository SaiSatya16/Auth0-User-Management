import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

export default {
  getUsers() {
    return axios.get(`${API_URL}/users`)
  },
  
  getUser(id) {
    return axios.get(`${API_URL}/users/${id}`)
  },
  
  createUser(userData) {
    return axios.post(`${API_URL}/users`, userData)
  },
  
  updateUser(id, userData) {
    return axios.put(`${API_URL}/users/${id}`, userData)
  },
  
  deleteUser(id) {
    return axios.delete(`${API_URL}/users/${id}`)
  }
}
