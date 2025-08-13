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
        {
          path: "/brand-table",
          name: "brand",
          component: () => import("@/views/Brand/Index.vue"),
        },
        {
          path: "/offers-table",
          name: "offers",
          component: () => import("@/views/Offers/Index.vue"),
        },
        {
          path: "/contact-table",
          name: "contact",
          component: () => import("@/views/Contact/Index.vue"),
        },
        {
          path: "/product-table",
          name: "product",
          component: () => import("@/views/Product/Index.vue"),
        },
        {
          path: "/stock-entries-table",
          name: "stock-entries",
          component: () => import("@/views/StockEntries/Index.vue"),
        },
        {
          path: "/order-table",
          name: "order",
          component: () => import("@/views/Order/Index.vue"),
        },
        {
          path: "/delivery-summa-table",
          name: "delivery summa",
          component: () => import("@/views/DeliverySumma/Index.vue"),
        },
        {
          path: "/offerta-table",
          name: "offerta",
          component: () => import("@/views/Offerta/Index.vue"),
        },
        {
          path: "/plastic-card-table",
          name: "plastic-card",
          component: () => import("@/views/PlasticCard/Index.vue"),
        },
        {
          path: "/reports",
          name: "reports",
          component: () => import("@/views/Report/Index.vue"),
        }

      ]
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Log/Index.vue"),
    },
    {
      path: "/report-warehouse",
      name: "report-warehouse",
      component: () => import("@/views/Report/sklad_report.vue"),
    },
    {
      path: "/sverka-warehouse",
      name: "sverka-warehouse",
      component: () => import("@/views/Report/sklad_sverka.vue"),
    },
    {
      path: "/report-orders",
      name: "report-orders",
      component: () => import("@/views/Report/order_report.vue"),
    },
    {
      path: "/sverka-orders",
      name: "sverka-orders",
      component: () => import("@/views/Report/order_sverka.vue"),
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
