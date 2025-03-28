import { createRouter, createWebHistory } from 'vue-router'
import UserList from '@/views/UserList.vue'
import UserDetail from '@/views/UserDetail.vue'
import UserForm from '@/views/UserForm.vue'

const routes = [
  {
    path: '/',
    redirect: '/users'
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/users/new',
    name: 'CreateUser',
    component: UserForm
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: UserDetail
  },
  {
    path: '/users/:id/edit',
    name: 'EditUser',
    component: UserForm
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
