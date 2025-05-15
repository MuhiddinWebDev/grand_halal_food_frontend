import { fileURLToPath, URL } from "node:url";
import { resolve, dirname } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(
    {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['YandexMap',
            'YandexMarker'].includes(tag),
        }
      }
    }
  ), 
  vueJsx(),
  VueI18nPlugin({
    include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
    strictMessage: false
  })
],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
