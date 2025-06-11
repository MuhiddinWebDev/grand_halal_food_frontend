<template>
    <div class="p-4 space-y-4 bg-white rounded-xl shadow-md">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 class="text-xl font-bold">{{ t("general offerta") }}</h2>
        </div>

        <!-- Cardlar (mobile: 1ta, desktop: 2ta) -->
        <n-card v-for="item in tableData" :key="item.id">
            <template #header>
                <div class="flex justify-between items-center">
                    <span>#{{ item.id }}</span>
                    <n-button type="success" size="small" @click="openUpdate(item.id)">
                        <template #icon><n-icon :component="PenIcon" /></template>
                    </n-button>
                </div>
            </template>

            <div class="grid md:grid-cols-2 gap-2">
                <div class="rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm space-y-2">
                    <div class="text-base font-semibold text-gray-700 flex items-center gap-2">
                        <span class="text-xl">{{ t('text') }}</span> <span>UZB:</span>
                    </div>
                    <n-code :code="item.text_uz" language="text" word-wrap class="text-sm" />
                </div>
                <div class="rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm space-y-2">
                    <div class="text-base font-semibold text-gray-700 flex items-center gap-2">
                        <span class="text-xl">{{ t('text') }}</span> <span>RUS:</span>
                    </div>
                    <n-code :code="item.text_ru" language="text" word-wrap class="text-sm" />
                </div>
                <div class="rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm space-y-2">
                    <div class="text-base font-semibold text-gray-700 flex items-center gap-2">
                        <span class="text-xl">{{ t('text') }}</span> <span>KOR:</span>
                    </div>
                    <n-code :code="item.text_ko" language="text" word-wrap class="text-sm" />
                </div>
                <div class="rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm space-y-2">
                    <div class="text-base font-semibold text-gray-700 flex items-center gap-2">
                        <span class="text-xl">{{ t('text') }}</span> <span>ENG:</span>
                    </div>
                    <n-code :code="item.text_en" language="text" word-wrap class="text-sm" />
                </div>
            </div>
        </n-card>


        <!-- Create Modal -->
        <n-modal transform-origin="center" v-model:show="model_act.create">
            <n-card :bordered="false" role="dialog" aria-modal="true">
                <ModelForm @close="showClose('create')" @create="modalEmit('create')" type="create" />
            </n-card>
        </n-modal>

        <!-- Update Modal -->
        <n-modal transform-origin="center" v-model:show="model_act.update">
            <n-card :bordered="false" role="dialog" aria-modal="true">
                <ModelForm type="update" :id="model_act.update_id" @close="showClose('update')"
                    @update="modalEmit('update')" />
            </n-card>
        </n-modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { NCard, NButton, NIcon } from "naive-ui";
import { PenIcon } from "@/components/icons/icon";
import { useI18n } from "vue-i18n";
import ModelForm from "./Form.vue";
import ModelService from "@/services/offerta.service";

const { t } = useI18n();

const tableData = ref([]);
const loading = ref(false);

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

const showClose = (action) => (model_act.value[action] = false);
const modalEmit = (action) => getAllData(action);
const openUpdate = (id) => {
    model_act.value.update_id = id;
    model_act.value.update = true;
};

onMounted(() => {
    getAllData();
});
</script>
