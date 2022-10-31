import Vue from "vue";
import VueRouter from "vue-router";

import DashBoard from "./components/DashBoard.vue";
import DashBoard2 from "./components/child components/DashBoard2.vue";
import ProfileRouter from "./components/child components/ProfileView.vue";
import SettingRouter from "./components/child components/SystemSetting.vue";
import signUp from "./views/auth/AuthView.vue";
import NotFound from "./views/NotFound.vue";
import EditProfile from './views/profile/EditProfile.vue';

import { companiesRouter } from './views/company/router';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: DashBoard,
    children: [
      {
        path: "/",
        component: DashBoard2,
      },
      ...companiesRouter,
      {
        path: "/profile",
        component: ProfileRouter
      },
      {
        path: '/profile/edit',
        component: EditProfile
      },
      {
        path: "/setting",
        component: SettingRouter,
      },
    ],
  },
  {
    path: "/auth",
    component: signUp,
  },
  {
    name: "NotFound",
    path: "**",
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, __, next) => {
  if (!localStorage.getItem("user")) {
    if (to.path !== "/auth") {
      next("/auth");
    }
  } else if (to.path === "/auth") {
    next("/");
  }

  next();
});

export default router;
