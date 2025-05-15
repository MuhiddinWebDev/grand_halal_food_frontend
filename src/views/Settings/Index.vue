<script setup>
import { ref, onMounted, watch, watchEffect, reactive, h, computed } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { AddIcon, RefreshIcon, PenIcon, TrashIcon, SearchIcon } from '@/components/icons/icon';
import ModelForm from './Form.vue';
import ModelService from "@/services/mobile_version.service"
import { useI18n } from "vue-i18n";
const emit = defineEmits(["getData"]);
const saveType = ref("empty")
const { t } = useI18n();
const { insert, shift, r } = useMagicKeys();
const dialog = useDialog();
const tableData = ref([]);
const loading = ref(true);
const message = useMessage()
const filterHeader = ref({
    text: ""
});
const model_act = ref({
    create: false,
    update: false,
    update_id: null,
});

////// get data started
const getAllData = (action) => {
    loading.value = true;
    ModelService.all(filterHeader.value).then((res) => {
        tableData.value = res;
        loading.value = false;
        if (action) {
            model_act.value[action] = false;
            saveType.value = action;
        }
    })
}
////// get data finished

/// table action started
const tableColumn = computed(() => [
    {
        title: "№",
        key: "id",
        align: 'center',
        width: 50,
        render(row, index) {
            return index + 1
        }
    },
    {
        title: "Seller IOS",
        key: "seller_ios",
        resizable: true,
        sortOrder: true,
        sorter: "default",
    },
    {
        title: "Seller Android",
        key: "seller_android",
        resizable: true,
        sortOrder: true,
        sorter: "default",
    },
    {
        title: "Client IOS",
        key: "client_ios",
        resizable: true,
        sortOrder: true,
        sorter: "default",
    },
    {
        title: "Client Android",
        key: "client_android",
        resizable: true,
        sortOrder: true,
        sorter: "default",
    },
    {
        title: t('action'),
        key: 'action',
        width: 115,
        align: 'center',
        fixed: 'right',
        render(row, index) {
            return [
                h(NButton,
                    {
                        size: "small",
                        type: "success",
                        onClick: (e) => {
                            e.stopPropagation();
                            model_act.value.update_id = row.id;
                            model_act.value.update = true;
                        },
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
    }
])

/// table action finished

/// started onmounted
onMounted(() => {
    getAllData()
})
/// finisheded onmounted

/// search header start
const searchAction = (text) => {
    filterHeader.value.text = text;
    getAllData()
}
/// search header end

/// create update delete model started
const modalEmit = (action) => {
    getAllData(action);
}

const showClose = (action) => {
    model_act.value[action] = false;
}

const rowProps = (row) => {
    return {
        style: "cursor: pointer;",
        onClick: () => {
            emit('getData', row.id, 'package_id', saveType.value)
        }
    };
}



watchEffect(() => {
    if (shift.value && r.value) {
        getAllData()
    }
})
const updateBtn = () => {
    filterHeader.value.text = ""
    getAllData()
}
/// create update delete model finished

///// pagination start
const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20],
    onChange: (page) => {
        pagination.page = page;
    },
    onUpdatePageSize: (pageSize) => {
        pagination.pageSize = pageSize;
        pagination.page = 1;
    },
});
///// pagination end
</script>

<template>
    <div class="box">
        <div class="box-wrapper">
            <div class="box-container">
                <div class="box-header">
                    <div class="box-header_item">
                        <h2>{{ t('settings') }}</h2>
                    </div>
                    <n-space>
                        <n-input @input="searchAction" v-model:value="filterHeader.text" :placeholder="t('search')"
                            style="min-width: 25em;" clearable>
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
                            {{ t('update') }} <span class="button-key">Shift+R</span>
                        </n-button>
                    </n-space>
                </div>
                <div class="box-content">
                    <div class="box-table">
                        <div class="box-table">
                            <n-data-table :row-props="rowProps" :pagination="pagination" :loading="loading"
                                :columns="tableColumn" :data="tableData" :bordered="true" :single-line="false"
                                size="small" max-height="calc(100vh - 315px)" :scroll-x="1300">
                            </n-data-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal create and Update -->
        <section>
            <n-modal transform-orign="center" v-model:show="model_act.update">
                <n-card style="max-width: 550px; " :bordered="false" role="dialog" aria-modal="true">
                    <ModelForm type="update" :id="model_act.update_id" @close="showClose('update')"
                        @update="modalEmit('update')" />
                </n-card>
            </n-modal>

        </section>
        <!-- Modal create and Update -->
    </div>
</template>