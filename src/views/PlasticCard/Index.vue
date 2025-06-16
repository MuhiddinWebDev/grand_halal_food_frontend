<script setup>
import { ref, computed, onMounted, watchEffect, h } from "vue";
import { useMagicKeys } from "@vueuse/core";
import {  NIcon, NButton } from "naive-ui";
import { RefreshIcon, PenIcon, } from '@/components/icons/icon';
import { useI18n } from "vue-i18n";
import ModelForm from "./Form.vue";
import ModelService from "@/services/plastic_card.service";

const { t } = useI18n();
const { shift, r } = useMagicKeys();


const tableData = ref([]);
const loading = ref(false);

const model_act = ref({
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
        title: t("plastic card"),
        key: "number",
    },
    {
        title: t("name") + ' UZB',
        key: "name_uz",
    },
    {
        title: t("name") + ' KOR',
        key: "name_ko",
    },
    {
        title: t("name") + ' RUS',
        key: "name_ru",
    },
    {
        title: t("name") + ' ENG',
        key: "name_en",
    },
    {
        title: t("action"),
        key: "action",
        align: "center",
        fixed: "right",
        width: 160,
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

const updateBtn = () => {
    getAllData();
};
const showClose = (action) => (model_act.value[action] = false);
const modalEmit = (action) => getAllData(action);

watchEffect(() => {
    if (shift.value && r.value) getAllData();
});

onMounted(() => getAllData());
</script>
<template>
    <div class="p-2 space-y-2 bg-white rounded-xl shadow-md overflow-x-auto">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 class="text-xl font-bold">{{ t('plastic card') }}</h2>
            <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
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

        <n-data-table :loading="loading" :columns="tableColumn" :data="tableData" :bordered="true" :single-line="false"
            size="small" :scroll-x="1300" max-height="calc(100vh - 315px)" />
        <n-modal transform-origin="center" v-model:show="model_act.update">
            <n-card class="w-full max-w-3xl" :bordered="false" role="dialog" aria-modal="true">
                <ModelForm type="update" :id="model_act.update_id" @close="showClose('update')"
                    @update="modalEmit('update')" />
            </n-card>
        </n-modal>
    </div>
</template>