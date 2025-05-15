<template>
    <div class="report">
        <div class="report-data">
            <div class="report-data-header">
                <n-flex justify="space-between">
                    <h2>{{ t('refund report') }}</h2>
                    <n-icon @click="router.go(-1)" style="cursor: pointer;" size="32" color="rgb(16, 22, 58)">
                        <ExitIcon />
                    </n-icon>
                </n-flex>
                <n-space>
                    <n-date-picker v-model:value="filterHeader.range" type="datetimerange" />
                    <n-select v-model:value="filterHeader.store_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.store" value-field="id" label-field="name" :placeholder="t('store')"
                        filterable clearable></n-select>
                    <n-select v-model:value="filterHeader.battery_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.battery" value-field="id" label-field="name" :placeholder="t('battery')"
                        filterable clearable></n-select>
                    <n-select v-model:value="filterHeader.client_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.client" value-field="id" label-field="fullname"
                        :placeholder="t('client_one')" filterable clearable></n-select>
                    <n-button type="success" @click="showReport">
                        <template #icon>
                            <n-icon>
                                <EyeIcon />
                            </n-icon>
                        </template>
                        {{ t('see') }}
                    </n-button>
                </n-space>

            </div>
            <div class="report-data-container">
                <n-space vertical>
                    <n-spin :show="spinner">
                        <n-table :bordered="true" :single-line="false" size="small">
                            <thead>
                                <tr class="sticky-top-first">
                                    <th style="width: 40px;">№</th>
                                    <th>{{ t('store') }}</th>
                                    <th>{{ t('battery') }}</th>
                                    <th>{{ t('client_one') }}</th>
                                    <th>{{ t('refund count') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in reportData.data" :key="index" class="report-table-row"
                                    @dblclick="tableRowClick(item)">
                                    <td style="width: 40px; text-align: center">{{ index + 1 }}</td>
                                    <td>
                                        {{ item.store_name }} ||{{ usePhoneFormat(item.store_phone) }}
                                    </td>
                                    <td>{{ item.battery_name }}</td>
                                    <td>
                                        <div style="cursor: pointer;">
                                            <n-tooltip placement="bottom-start" trigger="hover">
                                                <template #trigger>
                                                    {{ item.client_fullname }}
                                                </template>
                                                {{ item.client_fullname }}
                                                <n-divider :style="{ margin: '4px 0px' }"></n-divider>
                                                {{ usePhoneFormat(item.client_phone) }}
                                            </n-tooltip>
                                        </div>
                                    </td>
                                    <td class="text-right">{{ item.refund_count }}</td>

                                </tr>
                                <tr class="sticky-bottom-second">
                                    <th colspan="4" class="text-center">{{ t('total') }}</th>
                                    <th class="text-right">{{ reportData?.total_count || 0 }}</th>
                                </tr>
                            </tbody>
                        </n-table>
                        <n-empty size="huge" class="report-data-empty" v-if="showEmpty">
                        </n-empty>
                    </n-spin>
                </n-space>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ExitIcon, EyeIcon } from "@/components/icons/icon";
import reportService from '../../services/report.service';
import storeService from '@/services/store.service';
import batteryService from '@/services/battery.service';
import clientsService from '@/services/clients.service';
import { usePhoneFormat } from '@/composible/NumberFormat';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
const router = useRouter();
const currentDate = new Date();
const beginDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let spinner = ref(false);
let showEmpty = ref(true);
const reportData = ref([]);
const selectOption = ref({
    store: [],
    battery: [],
    client: [],
})
const filterHeader = ref({
    range: [beginDate.getTime(), currentDate.getTime()],
    store_id: null,
    battery_id: null,
    client_id: null,
})
const getAllOption = () => {
    storeService.all().then((res) => {
        selectOption.value.store = res;
    });
    batteryService.allOption().then((res) => {
        selectOption.value.battery = res
    });
    clientsService.all().then((res) => {
        selectOption.value.client = res;
    })
}

onMounted(() => {
    getAllOption()
})
const showReport = () => {
    spinner.value = true;
    reportService.refundReport(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (!res?.data.length == 0) {
            showEmpty.value = false;
        }
    })
}
const tableRowClick = (row) => {
    router.push({
        path: '/sverka-refund',
        query: {
            store_id: row.store_id,
            battery_id: row.battery_id,
            client_id: row.client_id,
            range: filterHeader.value.range,
            action: true
        }
    })
}
</script>