<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect, h } from "vue";
import { useRouter } from "vue-router";
import { useMagicKeys } from "@vueuse/core";
import { useMessage, useDialog, NIcon, NButton } from "naive-ui";
import { AddIcon, RefreshIcon, DeleteIcon, SearchIcon } from '@/components/icons/icon';
import { useI18n } from "vue-i18n";
import ModelForm from "./Form.vue";
import ModelService from "@/services/stock_entries.service";

const { t } = useI18n();
const { insert, shift, r } = useMagicKeys();
const router = useRouter();
const dialog = useDialog();
const message = useMessage();

const tableData = ref([]);
const loading = ref(false);
const filterHeader = ref({ text: "" });

const model_act = ref({
  create: false,
  update: false,
  update_id: null,
});

const getAllData = (action) => {
  loading.value = true;
  ModelService.all().then((res) => {
    tableData.value = res;
    loading.value = false;
    if (action) model_act.value[action] = false;
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
    title: t("type"),
    key: "type",
    align: "center",
    render(row) {
      return row.type === "in" ? t("kirim") : t("chiqim");
    },
  },
  {
    title: t("comment"),
    key: "note",
  },
  {
    title: t("datetime"),
    key: "createdAt",
    render(row) {
      console.log(row.createdAt);
      return new Date(row.createdAt).toLocaleString();
    },
  },
  {
    title: t("action"),
    key: "action",
    align: "center",
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
  onChange: (page) => (pagination.page = page),
  onUpdatePageSize: (size) => {
    pagination.pageSize = size;
    pagination.page = 1;
  },
});

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

onMounted(() => getAllData());
</script>

<template>
  <div class="p-2 space-y-2">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h2 class="text-xl font-bold">{{ t('prixod') }}</h2>
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

    <n-data-table :row-props="rowProps" :pagination="pagination" :loading="loading" :columns="tableColumn"
      :data="tableData" :bordered="true" :single-line="false" size="small" :scroll-x="1100"
      max-height="calc(100vh - 315px)" />

    <n-modal transform-origin="center" v-model:show="model_act.create">
      <n-card class="w-full max-w-5xl" :bordered="false" role="dialog" aria-modal="true">
        <ModelForm @close="showClose('create')" @create="modalEmit('create')" type="create" />
      </n-card>
    </n-modal>
  </div>
</template>
