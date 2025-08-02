// vite.config.js
import { defineConfig } from "file:///D:/MySoft/Grand%20Halal%20Food/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/MySoft/Grand%20Halal%20Food/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/MySoft/Grand%20Halal%20Food/frontend/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import VueI18nPlugin from "file:///D:/MySoft/Grand%20Halal%20Food/frontend/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import path from "path";
var __vite_injected_original_dirname = "D:\\MySoft\\Grand Halal Food\\frontend";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["YandexMap", "YandexMarker"].includes(tag)
        }
      }
    }),
    vueJsx(),
    VueI18nPlugin({
      include: path.resolve(__vite_injected_original_dirname, "./src/locales/**"),
      strictMessage: false
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxNeVNvZnRcXFxcR3JhbmQgSGFsYWwgRm9vZFxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcTXlTb2Z0XFxcXEdyYW5kIEhhbGFsIEZvb2RcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L015U29mdC9HcmFuZCUyMEhhbGFsJTIwRm9vZC9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiOy8vIHZpdGUuY29uZmlnLmpzXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCc7XHJcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKHtcclxuICAgICAgdGVtcGxhdGU6IHtcclxuICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcclxuICAgICAgICAgIGlzQ3VzdG9tRWxlbWVudDogKHRhZykgPT4gWydZYW5kZXhNYXAnLCAnWWFuZGV4TWFya2VyJ10uaW5jbHVkZXModGFnKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICB2dWVKc3goKSxcclxuICAgIFZ1ZUkxOG5QbHVnaW4oe1xyXG4gICAgICBpbmNsdWRlOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvbG9jYWxlcy8qKicpLFxyXG4gICAgICBzdHJpY3RNZXNzYWdlOiBmYWxzZSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sVUFBVTtBQUxqQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixVQUFVO0FBQUEsUUFDUixpQkFBaUI7QUFBQSxVQUNmLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxhQUFhLGNBQWMsRUFBRSxTQUFTLEdBQUc7QUFBQSxRQUN0RTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxJQUNQLGNBQWM7QUFBQSxNQUNaLFNBQVMsS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQ25ELGVBQWU7QUFBQSxJQUNqQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
