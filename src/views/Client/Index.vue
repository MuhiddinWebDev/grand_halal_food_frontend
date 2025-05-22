<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect, h, inject } from "vue";
import { useRouter } from "vue-router";
import { useMagicKeys } from "@vueuse/core";
import { useMessage, useDialog, NIcon, NImage, NSwitch, NAvatar, NButton } from "naive-ui";
import { RefreshIcon, PenIcon, DeleteIcon, SearchIcon } from '@/components/icons/icon';
import { useGlobalStore } from "@/stores/global";
import { useI18n } from "vue-i18n";
import ModelService from "@/services/clients.service";
import { usePhoneFormat } from "@/composible/NumberFormat";

const { t, locale } = useI18n();
const { insert, shift, r } = useMagicKeys();
const dayJS =inject('dayJS')
const router = useRouter();
const dialog = useDialog();
const message = useMessage();
const globalStore = useGlobalStore();
const fileUrl = inject("fileUrl");

const tableData = ref([]);
const loading = ref(false);
const activeLoading = ref(false);
const filterHeader = ref({ text: "" });

const model_act = ref({
    create: false,
    update: false,
    update_id: null,
});

const getAllData = (action) => {
    loading.value = true;
    ModelService.all(filterHeader.value).then((res) => {
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
        title: t("fullname"),
        key: "fullname",
        render(row) {
            return h("div", { class: "flex items-center" }, [
                row.image
                    ? h(NImage, {
                        src: fileUrl + row.image,
                        height: 35,
                        width: 50,
                        style: { borderRadius: "35px", marginRight: "8px" },
                        lazy: true,
                        previewDisabled: true,
                    })
                    : h(NAvatar, {
                        size: "small",
                        style: { marginRight: "8px" },
                    }),
                h("span", { class: "font-semibold" }, row.fullname),
            ]);
        },
    },
    {
        title: t("phone"),
        key: "phone",
        render: (row) => usePhoneFormat(row.phone_number),
    },
    {
        title: t("login") + " / " + t("datetime"),
        key: "login",
        render: (row) => dayJS(row.datetime).format("YYYY-MM-DD HH:mm:ss"),
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

const rowProps = (row) => ({
    style: "cursor: pointer;",
});

const rowTableClass = (row) => (!row.status ? "bg-red-50" : "");

const searchAction = () => getAllData();
const updateBtn = () => {
    filterHeader.value.text = "";
    getAllData();
};
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
            <h2 class="text-xl font-bold">{{ t('client') }}</h2>
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
            </div>
        </div>

        <!-- Table -->
        <n-data-table :row-props="rowProps" :pagination="pagination" :loading="loading" :columns="tableColumn"
            :data="tableData" :bordered="true" :single-line="false" size="small" :scroll-x="1300"
            max-height="calc(100vh - 315px)" :row-class-name="rowTableClass" />
    </div>
</template>