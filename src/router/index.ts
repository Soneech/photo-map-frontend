import { useAuthStore } from '@/stores/auth';
import HomeVue from '@/views/HomeView.vue';
import LoginVue from '@/views/LoginView.vue';
import RegistrationVue from '@/views/RegistrationView.vue';
import CreateMarkVue from '@/views/CreateMarkView.vue';
import MarkPageVue from '@/views/MarkPage.vue';
import ProfilePageVue from '@/views/ProfilePageView.vue'

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeVue
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: LoginVue
    },
    {
      path: '/auth/registration',
      name: 'Registration',
      component: RegistrationVue
    },
    {
      path: '/marks/create',
      name: 'CreateMark',
      component: CreateMarkVue
    },
    {
      path: '/marks/:id',
      name: 'MarkPage',
      component: MarkPageVue
    },
    {
      path: '/profile/:id',
      name: 'ProfilePage',
      component: ProfilePageVue
    }
  ]
});

router.beforeEach(async (to) => {
  const publicPages = ['Home', 'Login', 'Registration', 'MarkPage'];
  const authRequired = !publicPages.includes(to.name as string);
  const auth = useAuthStore();

  if (authRequired && !auth.token) {
    return '/auth/login'
  }
});

export default router
