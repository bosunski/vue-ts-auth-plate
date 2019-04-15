import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import { TokenService } from '@/services/TokenService';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        public: true,
        onlyWhenLoggedOut: true,
      },
    },
    {
      path: 'login',
      name: 'login',
      component: Home,
      meta: {
        public: true,
        onlyWhenLoggedOut: true,
      },
    },
    {
      meta: {
        public: true,
        onlyWhenLoggedOut: true,
      },
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some((record) => record.meta.onluWhenLoggedOut);
  const loggedIn = !!TokenService.getToken();

  if (!isPublic && !loggedIn) {
    return next({
      path: '/login',
      query: {redirect: to.fullPath },
    });
  }

  if (loggedIn && onlyWhenLoggedOut) {
    return next('/');
  }

  next();
});

export default router;
