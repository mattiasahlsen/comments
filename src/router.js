import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Url from './views/Url'
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
      path: '/support',
      name: 'support',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Support.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('./views/Faq.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/links',
      name: 'links',
      component: () => import('./views/Links.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('./views/Account.vue')
    },
    {
      path: '/password',
      name: 'password',
      component: () => import('./views/Password.vue')
    },
    {
      path: '/not-found',
      name: '404',
      component: NotFound
		},
		{
			path: '/',
			name: 'home',
			component: Home,
		},
    {
      path: '/:url',
      name: 'url',
			component: Url,
		},
    {
      path: '*',
      redirect: { name: '404' },
    }
  ]
})
router.afterEach((to, from) => {
  store.commit('clearError')
})

export default router
