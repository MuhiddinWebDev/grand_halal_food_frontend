<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect, h, inject } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { useMessage, useDialog, NIcon, NButton } from "naive-ui";
import { AddIcon, RefreshIcon, DeleteIcon, SearchIcon } from '@/components/icons/icon';
import { useI18n } from "vue-i18n";
import ModelForm from "./Form.vue";
import ModelService from "@/services/stock_entries.service";
import productService from "@/services/product.service";
const { t, locale } = useI18n();
const { insert, shift, r } = useMagicKeys();
const dialog = useDialog();
const message = useMessage();
const dayJS = inject('dayJS')
const tableData = ref([]);
const loading = ref(false);
const productResidual = ref([]);
const productOption = ref([]);
const filterHeader = ref({
  type: 'in',
  text: "",
});
const productFilter = ref({
  product_id: null
})

const model_act = ref({
  create: false,
  update: false,
  update_id: null,
});

const getAllData = () => {
  loading.value = true;

  const params = {
    ...filterHeader.value, // agar filterlar bo‘lsa
    page: pagination.page,
    pageSize: pagination.pageSize,
  };

  ModelService.all(params).then((res) => {
    tableData.value = res.data;
    pagination.itemCount = res.total;
    loading.value = false;
  });
};


const getProductResidual = () => {
  ModelService.productResidual(productFilter.value).then((res) => {
    productResidual.value = res;
  });
};

const getAllProduct = () => {
  productService.all().then((res) => {
    productOption.value = res;
  });
};


const tableColumn = computed(() => [
  {
    title: "№",
    key: "id",
    align: "center",
    width: 50,
    render: (_, index) => index + 1,
  },
  {
    title: t("datetime"),
    key: "createdAt",
    width: 150,
    render(row) {
      return dayJS(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: t("product"),
    key: "product_id",
    render(row) {
      return row.product?.title_uz || "-";
    },
  },
  {
    title: t("quantity"),
    key: "quantity",
    align: "center",
  },
  {
    title: t("comment"),
    key: "note",
  },
  {
    title: t("action"),
    key: "action",
    align: "center",
    fixed: "right",
    width: 120,
    render(row) {
      return [
        h(NButton,
          {
            size: "small",
            type: "warning",
            onClick: () => {
              dialog.warning({
                title: t("warning"),
                content: t("delete_row"),
                positiveText: t("yes"),
                negativeText: t("no"),
                onPositiveClick: () => {
                  ModelService.delete(row.id)
                    .then(() => getAllData())
                    .catch(() => message.error(t("error")));
                },
                onNegativeClick: () => message.success(t("cancel")),
              });
            },
          },
          {
            icon: () => h(NIcon, { component: DeleteIcon }),
          }),
      ];
    },
  },
]);

const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20],
  onChange: (page) => {
    pagination.page = page;
    getAllData();
  },
  onUpdatePageSize: (size) => {
    pagination.pageSize = size;
    pagination.page = 1; // yangi o'lchamda boshidan boshlaymiz
    getAllData();
  },
});
const paginationProduct = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20],
    onChange: (page) => (pagination.page = page),
    onUpdatePageSize: (size) => {
        pagination.pageSize = size;
        pagination.page = 1;
    },
});

const tableColumnProduct = computed(() => [
  {
    title: "№",
    key: "id",
    align: "center",
    width: 50,
    render: (_, index) => index + 1,
  },
  {
    title: t("product"),
    key: "product_id",
    render(row) {
      return row.product['title_' + locale.value] || "-";
    },
  },
  {
    title: t("limit"),
    align: "right",
    titleAlign: "left",
    width: 200,
    render(row) {
      const colorClass = row.limit <= 0 ? 'text-red-500' : 'text-green-500';
      return h("span", { class: `font-semibold ${colorClass}` }, '' + row.limit);
    }

  },
]);

const rowProps = () => ({ style: "cursor: pointer;" });

const searchAction = () => getAllData();
const updateBtn = () => getAllData();
const mainAdd = () => (model_act.value.create = true);
const showClose = (action) => (model_act.value[action] = false);
const modalEmit = (action) => getAllData(action);

watch(insert, (v) => v && mainAdd());
watchEffect(() => {
  if (shift.value && r.value) getAllData();
});

onMounted(() => {
  getAllData()
  getProductResidual()
  getAllProduct()
});
const updateTabs = (tab) => {
  if (tab == 'limit') {
    productFilter.value.product_id = null;
    return;
  }
  filterHeader.value.type = tab;
  getAllData();
}

</script>

<template>
  <div class="p-2 space-y-2 bg-white rounded-xl shadow-md overflow-x-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h2 class="text-xl font-bold">{{ t('sklad') }}</h2>
      <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
        <n-input v-model:value="filterHeader.text" @input="searchAction" :placeholder="t('search')" clearable
          class="w-full sm:w-80">
          <template #prefix>
            <n-icon>
              <SearchIcon />
            </n-icon>
          </template>
        </n-input>
        <n-button type="warning" @click="updateBtn">
          <template #icon>
            <n-icon>
              <RefreshIcon />
            </n-icon>
          </template>
          {{ t('update') }} <span class="ml-1 text-xs">Shift+R</span>
        </n-button>
        <n-button type="success" @click="mainAdd">
          <template #icon>
            <n-icon>
              <AddIcon />
            </n-icon>
          </template>
          {{ t('add') }} <span class="ml-1 text-xs">Insert</span>
        </n-button>
      </div>
    </div>
    <n-tabs type="line" animated default-value="in" @update:value="updateTabs">
      <n-tab-pane name="in" :tab="t('kirim')">
        <n-data-table :row-props="rowProps" :loading="loading" :columns="tableColumn" :data="tableData" :bordered="true"
          :single-line="false" size="small" :scroll-x="1100" max-height="calc(100vh - 315px)" />
        <div class="flex justify-end">
          <n-pagination v-model:page="pagination.page" :page-size="pagination.pageSize"
            :item-count="pagination.itemCount" :page-sizes="[10, 15, 20]" @update:page="getAllData" @update:page-size="(size) => {
              pagination.pageSize = size;
              pagination.page = 1;
              getAllData();
            }" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="out" :tab="t('rasxod')">
        <n-data-table :row-props="rowProps" :loading="loading" :columns="tableColumn" :data="tableData" :bordered="true"
          :single-line="false" size="small" :scroll-x="1100" max-height="calc(100vh - 315px)" />
        <div class="flex justify-end">
          <n-pagination v-model:page="pagination.page" :page-size="pagination.pageSize"
            :item-count="pagination.itemCount" :page-sizes="[10, 15, 20]" @update:page="getAllData" @update:page-size="(size) => {
              pagination.pageSize = size;
              pagination.page = 1;
              getAllData();
            }" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="limit" :tab="t('limit')">
        <n-data-table :row-props="rowProps" :pagination="paginationProduct" :loading="loading" :columns="tableColumnProduct"
          :data="productResidual" :bordered="true" :single-line="false" size="small" :scroll-x="700"
          max-height="calc(100vh - 315px)" />
      </n-tab-pane>
    </n-tabs>
    <n-modal transform-origin="center" v-model:show="model_act.create">
      <n-card class="w-full max-w-5xl" :bordered="false" role="dialog" aria-modal="true">
        <ModelForm @close="showClose('create')" @create="modalEmit('create')" type="create" />
      </n-card>
    </n-modal>
  </div>
</template>
