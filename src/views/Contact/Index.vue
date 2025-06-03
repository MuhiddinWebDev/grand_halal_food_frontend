<script setup>
import { ref, computed, onMounted, h, } from "vue";
import { NIcon, NButton, NTag } from "naive-ui";
import { PenIcon, } from '@/components/icons/icon';
import { useI18n } from "vue-i18n";
import ModelForm from "./Form.vue";
import ModelService from "@/services/contact.service";

const { t } = useI18n();

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
        title: t("telegram"),
        key: "telegram",
        render(row) {
            return [
                h(
                    NTag,
                    {
                        size: "small",
                        type: "success",
                        round: true,
                        style: { cursor: "pointer" },
                        onClick: () => {
                            window.open(row.telegram, '_blank');
                        }
                    },
                    { default: () => row.telegram },
                ),
            ];
        }

    },
    {
        title: t("instagram"),
        key: "instagram",
        render(row) {
            return [
                h(
                    NTag,
                    {
                        size: "small",
                        type: "error",
                        round: true,
                        style: { cursor: "pointer" },
                        onClick: () => {
                            window.open(row.instagram, '_blank');
                        }
                    },
                    { default: () => row.instagram },
                ),
            ];
        }
    },
    {
        title: t("tiktok"),
        key: "tiktok",
        render(row) {
            return [
                h(
                    NTag,
                    {
                        size: "small",
                        type: "tertiary",
                        round: true,
                        style: { cursor: "pointer" },
                        onClick: () => {
                            window.open(row.tiktok, '_blank');
                        }
                    },
                    { default: () => row.tiktok },
                ),
            ];
        }
    },
    {
        title: t("phone"),
        key: "phone",
        render(row) {
            return [
                h(
                    NTag,
                    {
                        size: "small",
                        type: "info",
                        round: true,
                        style: { cursor: "pointer" },
                        onClick: () => {
                            window.open(`tel:${row.phone}`, '_self');
                        }
                    },
                    { default: () => row.phone },
                ),
            ];
        }

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
            ];
        },
    },
]);

const showClose = (action) => (model_act.value[action] = false);
const modalEmit = (action) => getAllData(action);


onMounted(() => {
    getAllData();
});
</script>
<template>
    <div class="p-2 space-y-2 bg-white rounded-xl shadow-md overflow-x-auto">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 class="text-xl font-bold">{{ t('contact') }}</h2>
        </div>

        <n-data-table class="mobile-table" :loading="loading" :columns="tableColumn" :data="tableData" :bordered="true"
            :single-line="false" size="small" :scroll-x="1300" />

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
