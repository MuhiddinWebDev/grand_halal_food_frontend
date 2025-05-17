<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect, h, inject } from "vue";
import { useRouter } from "vue-router";
import { useMagicKeys } from "@vueuse/core";
import { useMessage, useDialog, NIcon, NImage, NSwitch, NAvatar, NButton } from "naive-ui";
import { AddIcon, RefreshIcon, PenIcon, DeleteIcon, SearchIcon } from '@/components/icons/icon';
import { useGlobalStore } from "@/stores/global";
import { useI18n } from "vue-i18n";
import ModelForm from "./Form.vue";
import ModelService from "@/services/contact.service";

const { t, locale } = useI18n();
const { insert, shift, r } = useMagicKeys();
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
        title: t("telegram"),
        key: "telegram",
    },
    {
        title: t("instagram"),
        key: "instagram",
    },
    {
        title: t("tiktok"),
        key: "tiktok",
    },
    {
        title: t("phone"),
        key: "phone",
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


onMounted(() => getAllData());
</script>
<template>
    <div class="p-4 space-y-4">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 class="text-xl font-bold">{{ t('contact') }}</h2>
        </div>

        <n-data-table :loading="loading" :columns="tableColumn" :data="tableData" :bordered="true" :single-line="false"
            size="small" :scroll-x="400" />

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