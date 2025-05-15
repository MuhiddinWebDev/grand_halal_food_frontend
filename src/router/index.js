import { createRouter, createWebHistory } from "vue-router";
const role = localStorage.getItem("role");
let currentPage = '/home';
if (role == 'Inspector') currentPage = '/sklad-table';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: currentPage,
      component: () => import("@/views/Layouts/Index.vue"),
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("@/views/Home/Index.vue"),
        },
        {
          path: "/admin-table",
          name: "admin",
          component: () => import("@/views/Admin/Index.vue"),
        },
        {
          path: "/client-table",
          name: "client",
          component: () => import("@/views/Client/Index.vue"),
        },
        {
          path: "/category-table",
          name: "category",
          component: () => import("@/views/Category/Index.vue"),
        },
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Log/Index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: 'error page',
      component: () => import('../views/error.vue')
    }
  ],
});


router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("token");
  if (authRequired && !loggedIn) {
    localStorage.clear();
    return next("/login");
  }
  // Barcha shartlardan o'tgandan keyin davom ettirish
  next();
});


export default router;
