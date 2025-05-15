<script setup>
import { watch, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification, useLoadingBar } from "naive-ui";
import { useErrorStore } from "./stores/errors";
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const router = useRouter();
const loadingBar = useLoadingBar();
const notification = useNotification();
const Default_title = ref("GRAND HALAL FOOD");

router.beforeEach(() => {
  loadingBar.start();
});
router.afterEach(() => {
  loadingBar.finish();
  document.title = (Default_title.value).toLocaleUpperCase();
});
router.onError(() => {
  loadingBar.error();
});
const error_store = useErrorStore();

watch(
  () => error_store.error_text,
  (val) => {
    if (val) {
      notification.error({
        content: t('error'),
        meta: val.toString(),
        duration: 2000,
        keepAliveOnHover: true,
      });
    }
    setTimeout(() => {
      error_store.error_text = "";
    }, 3000);
  }
);

</script>

<template>
  <router-view></router-view>
</template>
