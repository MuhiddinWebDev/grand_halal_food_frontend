<script setup>
import { ref, h, onMounted, computed, watch, inject } from "vue";
import { useNotification } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import { NIcon, useDialog } from "naive-ui";
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "@/stores/global";
import usersService from "@/services/users.service.js";
import MainLogo from "@/assets/icons/logo.png"

// Icons
import {
  Home24Icon,
  AdminIcon,
  BuildIcon,
  ReportIcon,
  OrderIcon,
  threeLineIcon,
  ClientIcon,
  FaqIcon,
  CategoryIcon,
  NewsIcon,
  SettingIcon,
  BrandIcon,
  EventIcon,
  ClientIcon as DefaultAvatarIcon,
  ContactIcon,
  BasketIcon,
  WarehouseIcon
} from "../../components/icons/icon.js";

const emits = defineEmits(["updatelang"]);
const notification = useNotification();
const { t, locale, fallbackLocale } = useI18n();
const fileUrl = inject('fileUrl')
const router = useRouter();
const route = useRoute();
const dialog = useDialog();
const globalStore = useGlobalStore();

// Sidebar collapse and responsive state
const collapsed = ref(false);
const selectMenu = ref(null);
const accordionValue = ref([]);
const responsiveMenu = ref(false);
const windowWidth = ref(window.innerWidth);

const userSetting = (e) => {
  if (e === "logout") {
    dialog.info({
      title: t("info"),
      content: t("logout"),
      positiveText: t("yes"),
      negativeText: t("no"),
      onPositiveClick: () => {
        localStorage.clear();
        router.push({ name: "Login" });
      }
    });
  }
};

// User dropdown options
const userOption = computed(() => [
  { label: t("exit"), key: "logout" }
]);

// Language switcher
const updateLang = (lang) => {
  localStorage.setItem("lang", lang);
  globalStore.currentData.lang = lang;
  globalStore.currentLang = lang;
  locale.value = lang;
  emits("updatelang", lang);
  usersService.update(globalStore.currentData.id, globalStore.currentData);
};

// Menu icon rendering
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// Menu options
const menuOptions = computed(() => [
  {
    label: t("home"),
    key: "home",
    icon: renderIcon(Home24Icon)
  },
  // {
  //   label: t("report"),
  //   key: "Hisobotlar",
  //   icon: renderIcon(ReportIcon)
  // },
  {
    label: t("document"),
    key: "documents",
    icon: renderIcon(BuildIcon),
    children: [
      { label: t("prixod"), key: "stock-entries", icon: renderIcon(WarehouseIcon) },
      { label: t("orders"), key: "order", icon: renderIcon(OrderIcon) },
    ]
  },
  {
    label: t("information"),
    key: "information",
    icon: renderIcon(BuildIcon),
    children: [
      { label: t("admin"), key: "admin", icon: renderIcon(AdminIcon) },
      { label: t("client"), key: "client", icon: renderIcon(ClientIcon) },
      { label: t("category"), key: "category", icon: renderIcon(CategoryIcon) },
      { label: t("brand"), key: "brand", icon: renderIcon(BrandIcon) },
      { label: t("products"), key: "product", icon: renderIcon(BasketIcon) },
      { label: t("contact"), key: "contact", icon: renderIcon(ContactIcon) },
      { label: t("offers"), key: "offers", icon: renderIcon(EventIcon) },
      { label: t("news"), key: "news", icon: renderIcon(NewsIcon) },
      { label: "F.A.Q", key: "F.A.Q", icon: renderIcon(FaqIcon) }
    ]
  },
  // {
  //   label: t("settings"),
  //   key: "settings",
  //   show: localStorage.getItem("role") === "Programmer",
  //   icon: renderIcon(SettingIcon)
  // }
]);

// Initial setup
const getUser = () => {
  usersService.getCurrentUser().then((res) => {
    globalStore.currentData = res;
  });
};
const showBigMenu = ref(true)
const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value < 768) {
    showBigMenu.value = false
  } else {
    showBigMenu.value = true
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize());
  globalStore.currentLang = localStorage.getItem("lang") || "uz";
  locale.value = globalStore.currentLang;
  fallbackLocale.value = globalStore.currentLang;

  const accordion = localStorage.getItem("accordion");
  if (accordion) {
    try {
      accordionValue.value = JSON.parse(accordion);
    } catch (e) {
      // fallback agar JSON emas bo‘lsa
      accordionValue.value = [accordion];
    }
  }

  const coll = localStorage.getItem("collopsed");
  if (coll) collapsed.value = JSON.parse(coll.toLowerCase());

  selectMenu.value = route.name;
  getUser();
});

watch(collapsed, (val) => {
  localStorage.setItem("collopsed", val);
});
window.addEventListener("resize", handleResize);
const openMenuEvent = () => {
  handleResize();
  if (windowWidth.value > 768) {
    collapsed.value = !collapsed.value;
  }
  responsiveMenu.value = !responsiveMenu.value
}
const UpdateAccordion = (e) => {
  try {
    accordionValue.value = e;
    localStorage.removeItem("accordion");
    localStorage.setItem("accordion", JSON.stringify(e));
  } catch (e) {
    console.log("Xatolik");
    console.log(e);
  }
}
const updateMenu = (e) => {
  try {
    selectMenu.value = e;
    responsiveMenu.value = false;
    router.push({ name: e });
  } catch (err) {
    notification.warning({
      title: "Ogohlantirish",
      content: "Texnik ishlar olib borilmoqda",
      keepAliveOnHover: true,
      duration: 1000
    })
  }
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Layout container with has-sider -->
    <n-layout has-sider>
      <!-- Sidebar -->
      <n-layout-sider v-if="showBigMenu" collapse-mode="width" :collapsed-width="70" :width="280" bordered
        :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false" show-trigger="bar"
        :style="{ height: '100vh', background: '#115D33', color: '#fff' }">
        <div class="logo flex items-center justify-center py-2">
          <img style="width: 200px; height: 100px; border-radius: 10px;" :src="MainLogo" alt="">
        </div>
        <n-menu accordion :collapsed="collapsed" v-model:value="selectMenu" :options="menuOptions"
          :on-update:value="updateMenu" @update:expanded-keys="UpdateAccordion"
          :default-expanded-keys="accordionValue" />
      </n-layout-sider>

      <!-- Main Layout -->
      <n-layout class="flex-1 bg-gray-50">
        <!-- Header -->
        <div class="flex justify-between items-center px-4 py-3 bg-white shadow-sm">
          <n-button @click="openMenuEvent">
            <n-icon size="24">
              <threeLineIcon />
            </n-icon>
          </n-button>

          <div class="flex items-center gap-4">
            <n-select class="w-[150px]" v-model:value="locale" @update:value="updateLang"
              :options="globalStore.langOption" />

            <n-dropdown @select="userSetting" :options="userOption">
              <div class="flex items-center gap-2 cursor-pointer">
                <h3 class="text-sm font-medium text-gray-800">
                  {{ globalStore.currentData?.fullname }}
                </h3>
                <n-avatar size="small" round :src="fileUrl + globalStore.currentData?.image || ''">
                  <template v-if="!globalStore.currentData?.image">
                    <NIcon size="24">
                      <DefaultAvatarIcon />
                    </NIcon>
                  </template>
                </n-avatar>
              </div>
            </n-dropdown>
          </div>
        </div>

        <!-- Page Content -->
        <div class="p-4">
          <RouterView />
        </div>
      </n-layout>
    </n-layout>

    <!-- Mobile Drawer -->
    <n-drawer v-model:show="responsiveMenu" :style="{ height: '100vh', width: '80vw', background: '#115D33' }"
      placement="left">
      <n-drawer-content title="GRAND HALAL FOOD" :header-style="{ color: '#fff' }" closable>
        <n-menu v-model:value="selectMenu" :options="menuOptions" :on-update:value="updateMenu" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
