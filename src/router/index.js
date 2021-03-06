import Vue from "vue";
import VueRouter from "vue-router";

import WelcomePage from '@/views/WelcomePage.vue';

// SPA auth
import RegistrationPage from '@/views/auth/Registration.vue'
import LoginPage from '@/views/auth/Login.vue';

// tourist pages
import TDashboard from '@/views/tourist/Dashboard.vue';
import TProfile from '@/views/tourist/profile/Profile.vue';
import TPersonalInfo from '@/views/tourist/profile/PersonalInfo.vue';
import TImageGallery from '@/views/tourist/profile/ImageGallery.vue';
import TDashboardWall from '@/views/tourist/dashboard/DashboardWall.vue';
import TAppointments from '@/views/tourist/appointments/Appointments.vue';
import TViewAppointments from '@/views/tourist/appointments/ViewAppointments.vue';
import TCreateAppointment from '@/views/tourist/appointments/CreateAppointment.vue';

// guide pages
import GDashboard from '@/views/guide/Dashboard.vue';
import GDashboardPage from '@/views/guide/dashboard/Dashboard.vue';
import GProfile from '@/views/guide/profile/Profile.vue';
import GPosts from '@/views/guide/posts/Posts.vue';
import GViewPosts from '@/views/guide/posts/ViewPosts.vue';
import GCreatePost from '@/views/guide/posts/CreatePost.vue';
import GViewAppointments from '@/views/guide/appointments/ViewAppointments.vue';

import { Store } from "vuex";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "welcome-page",
    component: WelcomePage,
    meta: { }
  },
  {
    path: "/register",
    name: "registration-page",
    component: RegistrationPage,
    meta: { guestOnly: true},
  },
  {
    path: "/login",
    name: "login-page",
    component: LoginPage,
    meta: { guestOnly: true},
  },
  {
    path: '/tourist/dashboard',
    name: 'tourist-dashboard',
    component: TDashboard,
    meta: { authOnly: true},
    children: [
      {
        path: 'dashboardwall',
        name: 'tourist-dashboardwall',
        component: TDashboardWall,
      },
      {
        path: 'profile',
        name: 'tourist-profile',
        component: TProfile,
        children: [
          {
            path: 'personalinfo',
            name: 'tourist-personal-info',
            component: TPersonalInfo,
          },
          {
            path: 'imagegallery',
            name: 'tourist-image-gallery',
            component: TImageGallery,
          },
        ]
      },
      {
        path: '/tourist/appointments',
        name: 'tourist-appointments',
        component: TAppointments,
        children: [
          {
            path: 'viewappointments',
            name: 'tourist-view-appointments',
            component: TViewAppointments,
          },
          {
            path: 'createappointment',
            name: 'tourist-create-appointment',
            component: TCreateAppointment,
          },
        ]
      },
    ],
  },
  {
    path: '/guide/dashboard',
    name: 'guide-dashboard',
    component: GDashboard,
    meta: { authOnly: true},
    children: [
      {
        path: 'dashboard',
        name: 'guide-dashboard-page',
        component: GDashboardPage,
      },
      {
        path: 'profile',
        name: 'guide-profile',
        component: GProfile,
      },
      {
        path: 'posts',
        name: 'guide-posts',
        component: GPosts,
        children: [
          {
            path: 'viewposts',
            name: 'guide-view-posts',
            component: GViewPosts,
          },
          {
            path: 'createpost',
            name: 'guide-create-post',
            component: GCreatePost,
          },
        ]
      },
      {
        path: 'appointments',
        name: 'guide-appointments',
        component: GViewAppointments,
      },
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

function isLoggedIn() {
  return !!localStorage.getItem('auth');
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authOnly)) {
    if (!isLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guestOnly)) {
    if (isLoggedIn() && Store.Login.role === 'tourist') {
      next({
        path: '/tourist/dashboard',
        query: { redirect: to.fullPath }
      })
    } else if (isLoggedIn() && Store.Login.role === 'guide') {
      next({
        path: '/guide/dashboard',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;
