// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { resolve, dirname } from "node:path";
import { defineConfig } from "file:///C:/Users/Nurmuhammad/Desktop/projects/jaz/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Nurmuhammad/Desktop/projects/jaz/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/Nurmuhammad/Desktop/projects/jaz/frontend/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import VueI18nPlugin from "file:///C:/Users/Nurmuhammad/Desktop/projects/jaz/frontend/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Nurmuhammad/Desktop/projects/jaz/frontend/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(
      {
        template: {
          compilerOptions: {
            isCustomElement: (tag) => [
              "YandexMap",
              "YandexMarker"
            ].includes(tag)
          }
        }
      }
    ),
    vueJsx(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "./src/locales/**"),
      strictMessage: false
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxOdXJtdWhhbW1hZFxcXFxEZXNrdG9wXFxcXHByb2plY3RzXFxcXGphelxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTnVybXVoYW1tYWRcXFxcRGVza3RvcFxcXFxwcm9qZWN0c1xcXFxqYXpcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL051cm11aGFtbWFkL0Rlc2t0b3AvcHJvamVjdHMvamF6L2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XHJcbmltcG9ydCB7IHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tIFwibm9kZTpwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XHJcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gXCJAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFt2dWUoXHJcbiAgICB7XHJcbiAgICAgIHRlbXBsYXRlOiB7XHJcbiAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XHJcbiAgICAgICAgICBpc0N1c3RvbUVsZW1lbnQ6ICh0YWcpID0+IFsnWWFuZGV4TWFwJyxcclxuICAgICAgICAgICAgJ1lhbmRleE1hcmtlciddLmluY2x1ZGVzKHRhZyksXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgKSwgXHJcbiAgdnVlSnN4KCksXHJcbiAgVnVlSTE4blBsdWdpbih7XHJcbiAgICBpbmNsdWRlOiByZXNvbHZlKGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSwgJy4vc3JjL2xvY2FsZXMvKionKSxcclxuICAgIHN0cmljdE1lc3NhZ2U6IGZhbHNlXHJcbiAgfSlcclxuXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNWLFNBQVMsZUFBZSxXQUFXO0FBQ3pYLFNBQVMsU0FBUyxlQUFlO0FBQ2pDLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxtQkFBbUI7QUFMK0wsSUFBTSwyQ0FBMkM7QUFRMVEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQUM7QUFBQSxNQUNSO0FBQUEsUUFDRSxVQUFVO0FBQUEsVUFDUixpQkFBaUI7QUFBQSxZQUNmLGlCQUFpQixDQUFDLFFBQVE7QUFBQSxjQUFDO0FBQUEsY0FDekI7QUFBQSxZQUFjLEVBQUUsU0FBUyxHQUFHO0FBQUEsVUFDaEM7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxJQUNQLGNBQWM7QUFBQSxNQUNaLFNBQVMsUUFBUSxRQUFRLGNBQWMsd0NBQWUsQ0FBQyxHQUFHLGtCQUFrQjtBQUFBLE1BQzVFLGVBQWU7QUFBQSxJQUNqQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0UsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
