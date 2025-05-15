<script setup>
import App from '../App.vue'
import { useGlobalStore } from "@/stores/global"
import { enUS, ruRU } from 'naive-ui';
import { ref } from "vue"
const store = useGlobalStore();
const locale = ref(store.currentLang === 'uz' ? store.uzUz : store.currentLang === 'ru' ? ruRU : store.currentLang == 'ka' ? store.kaKa : enUS)
const changeLang = (lang) => {
  locale.value = lang === 'uz' ? store.uzUz : lang === 'ru' ? ruRU : lang == 'ka' ? store.kaKa : enUS;
}
</script>

<template>
  <n-config-provider :theme-overrides="store.menuStyle" :locale="locale">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-loading-bar-provider>
              <div class="app-box">
                <App @updatelang="changeLang" />
              </div>
            </n-loading-bar-provider>
          </n-notification-provider>
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
