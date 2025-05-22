<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect, h, inject } from "vue";
import { useRouter } from "vue-router";
import { useMagicKeys } from "@vueuse/core";
import { useMessage, useDialog, NIcon, NImage, NAvatar, NButton } from "naive-ui";
import { AddIcon, RefreshIcon, PenIcon, DeleteIcon, SearchIcon } from '@/components/icons/icon';
import { useGlobalStore } from "@/stores/global";
import { useI18n } from "vue-i18n";
import ModelForm from "./Form.vue";
import ModelService from "@/services/offersTable.service";

const { t } = useI18n();
const { insert, shift, r } = useMagicKeys();
const router = useRouter();
const dialog = useDialog();
const message = useMessage();
const globalStore = useGlobalStore();
const fileUrl = inject("fileUrl");

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
        title: t("title") + ' UZB',
        key: "title_uz",
        render(row) {
            console.log(row.category)
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
                h("span", { class: "font-semibold" }, row.title_uz),
            ]);
        },
    },
    {
        title: t("title") + ' KOR',
        key: "title_ko",
    },
    {
        title: t("title") + ' RUS',
        key: "title_ru",
    },
    {
        title: t("title") + ' ENG',
        key: "title_en",
    },
    {
        title: t("link") ,
        key: "link",
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
                        type: "success",
                        onClick: (e) => {
                            model_act.value.update_id = row.id;
                            model_act.value.update = true;
                        },
                        style: {
                            marginRight: '8px'
                        }
                    },
                    {
                        icon: () => h(NIcon, {
                            component: PenIcon,
                            size: 22,
                        }),
                    },
                ),
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
                                        .catch((err) => {
                                            globalStore.errorPage = err.data;
                                            router.push({ name: "error page" });
                                        });
                                },
                                onNegativeClick: () => message.success(t("cancel")),
                            });
                        },
                    },
                    {
                        icon: () => h(NIcon, {
                            component: DeleteIcon,
                            size: 22,
                        }),
                    },
                ),
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

const rowProps = (row) => ({
    style: "cursor: pointer;",
});


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
            <h2 class="text-xl font-bold">{{ t('offers') }}</h2>
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
            :data="tableData" :bordered="true" :single-line="false" size="small" :scroll-x="1300"
            max-height="calc(100vh - 315px)" />

        <n-modal transform-origin="center" v-model:show="model_act.create">
            <n-card class="w-full max-w-3xl" :bordered="false" role="dialog" aria-modal="true">
                <ModelForm @close="showClose('create')" @create="modalEmit('create')" type="create" />
            </n-card>
        </n-modal>

        <n-modal transform-origin="center" v-model:show="model_act.update">
            <n-card class="w-full max-w-3xl" :bordered="false" role="dialog" aria-modal="true">
                <ModelForm type="update" :id="model_act.update_id" @close="showClose('update')"
                    @update="modalEmit('update')" />
            </n-card>
        </n-modal>
    </div>
</template>