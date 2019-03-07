import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import NotFound from './views/NotFound'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "account" */ './views/Account.vue')
    },
    {
      path: '/:url?',
      name: 'home',
      component: Home,
    },
    { path: '*', component: NotFound }
  ]
})
router.afterEach((to, from) => {
  store.commit('clearError')
})

export default router
