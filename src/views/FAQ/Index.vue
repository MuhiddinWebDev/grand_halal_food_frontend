<script setup>
import { ref, onMounted, watch, watchEffect, reactive, h, computed } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { AddIcon, RefreshIcon, PenIcon, TrashIcon, SearchIcon } from '@/components/icons/icon';
import ModelForm from './Form.vue';
import ModelService from "@/services/faq.service"
import { useGlobalStore } from "@/stores/global";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const globalStore = useGlobalStore();
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
    read: false,
    update_id: null,
    read_id: null,
});

////// get data started
const getAllData = (action) => {
    loading.value = true;
    ModelService.all(filterHeader.value).then((res) => {
        tableData.value = res;
        loading.value = false;
        if (action) {
            model_act.value[action] = false;
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
        title: t('question') + ' UZB',
        key: "title_uz",
        resizable: true,
        sortOrder: true,
        sorter: "default",
        fixed: 'left'
    },
    {
        title: t('question') + ' KOR',
        key: "title_ka",
        resizable: true,
        sortOrder: true,
        sorter: "default",
        fixed: 'left'
    },
    {
        title: t('question') + ' RUS',
        key: "title_ru",
        resizable: true,
        sortOrder: true,
        sorter: "default",
        fixed: 'left'
    },
    // {
    //     title: t('question') + ' ENG',
    //     key: "title_en",
    //     resizable: true,
    //     sortOrder: true,
    //     sorter: "default",
    //     fixed: 'left'
    // },
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
                h(NButton,
                    {
                        size: "small",
                        type: "warning",
                        onClick: (e) => {
                            e.stopPropagation();
                            dialog.warning({
                                title: t('warning'),
                                content: t('delete_row'),
                                positiveText: "Xa",
                                negativeText: "Yo'q",
                                onPositiveClick: async () => {
                                    ModelService.delete(row.id)
                                        .then((res) => {
                                            const index = tableData.value.findIndex((val) => val.id == row.id);
                                            tableData.value.splice(index, 1);
                                        })
                                        .catch((err) => {
                                            message.error(t('not_delete'));
                                        })
                                },
                                onNegativeClick: () => {
                                    message.warning(t('canceled'));
                                },
                            });
                        },
                        style: {
                            marginLeft: '12px'
                        }
                    },
                    {
                        icon: () => h(NIcon, {
                            component: TrashIcon,
                            size: 22,
                        }),
                    },
                ),
            ];
        },
    }
])
const rowProps = (row) => {
    return {
        style: "cursor: pointer;",
        onClick: () => {
            // emits("select", row.id);
        },
    };
};

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


const mainAdd = () => {
    model_act.value.create = true;

}

const showClose = (action) => {
    model_act.value[action] = false;
}

watch(insert, (v) => {
    mainAdd()
});

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
                        <h2>F.A.Q</h2>
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
                        <n-button type="success" @click="mainAdd">

                            <template #icon>
                                <n-icon>
                                    <AddIcon />
                                </n-icon>
                            </template>
                            {{ t('add') }} <span class="button-key">Insert</span>
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
            <n-modal transform-orign="center" v-model:show="model_act.create">
                <n-card style="width: calc(100vw - 115px)" :bordered="false" role="dialog" aria-modal="true">
                    <ModelForm @close="showClose('create')" @create="modalEmit('create')" type="create" />
                </n-card>
            </n-modal>
            <n-modal transform-orign="center" v-model:show="model_act.update">
                <n-card style="width: calc(100vw - 115px)" :bordered="false" role="dialog" aria-modal="true">
                    <ModelForm type="update" :id="model_act.update_id" @close="showClose('update')"
                        @update="modalEmit('update')" />
                </n-card>
            </n-modal>

        </section>
        <!-- Modal create and Update -->
    </div>
</template>