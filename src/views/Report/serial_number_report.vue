<template>
    <div class="report">
        <div class="report-data">
            <div class="report-data-header">
                <n-flex justify="space-between">
                    <h2>{{ t('serial number report') }}</h2>
                    <n-icon @click="router.go(-1)" style="cursor: pointer;" size="32" color="rgb(16, 22, 58)">
                        <ExitIcon />
                    </n-icon>
                </n-flex>
                <n-space>
                    <!-- <n-date-picker v-model:value="filterHeader.range" type="datetimerange" /> -->
                    <!-- <n-select v-model:value="filterHeader.store_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.store" value-field="id" label-field="name" :placeholder="t('store')"
                        filterable clearable></n-select>
                    <n-select v-model:value="filterHeader.battery_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.battery" value-field="id" label-field="name" :placeholder="t('battery')"
                        filterable clearable></n-select>
                    <n-select v-model:value="filterHeader.client_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.client" value-field="id" label-field="fullname" :placeholder="t('client_one')"
                        filterable clearable></n-select> -->
                    <n-input @update:value="updateSerialNumber" v-model:value="filterHeader.serial_number" clearable
                        :style="{ minWidth: '210px' }" :placeholder="t('serial number')"></n-input>
                    <n-button :disabled="!filterHeader.serial_number" type="success" @click="showReport">
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
                        <h2>{{ t('rasxod') }}</h2>
                        <n-table :bordered="true" :single-line="false" size="small">
                            <thead>
                                <tr class="sticky-top-first">
                                    <th style="width: 40px;">№</th>
                                    <th>{{ t('datetime') }}</th>
                                    <th>{{ t('battery') }}</th>
                                    <th>{{ t('region') }}</th>
                                    <th>{{ t('admin_one') }}</th>
                                    <th>{{ t('comment') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in reportData.rasxod_table" :key="index"
                                    class="report-table-row" @dblclick="tableRowClick(item)">
                                    <td style="width: 40px; text-align: center">{{ index + 1 }}</td>
                                    <td>{{ dayJS(item.rasxod?.datetime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</td>
                                    <td>{{ item.rasxod?.battery_name }}</td>
                                    <td>{{ item.rasxod?.region_name }}</td>
                                    <td>
                                        <div style="cursor: pointer;">
                                            <n-tooltip placement="bottom-start" trigger="hover">
                                                <template #trigger>
                                                    {{ item.rasxod?.user_fullname }}
                                                </template>
                                                {{ item.rasxod?.user_fullname }}
                                                <n-divider :style="{ margin: '4px 0px' }"></n-divider>
                                                {{ usePhoneFormat(item.rasxod?.user_phone) }}
                                            </n-tooltip>
                                        </div>
                                    </td>
                                    <td>{{ item.rasxod?.comment }}</td>
                                </tr>
                            </tbody>
                        </n-table>
                        <n-empty size="huge" class="report-data-empty" v-if="showEmptyRasxod">
                        </n-empty>
                    </n-spin>
                    <n-spin :show="spinner">
                        <h2>{{ t('prixod') }}</h2>
                        <n-table :bordered="true" :single-line="false" size="small">
                            <thead>
                                <tr class="sticky-top-first">
                                    <th style="width: 40px;">№</th>
                                    <th>{{ t('datetime') }}</th>
                                    <th>{{ t('battery') }}</th>
                                    <th>{{ t('store') }}</th>
                                    <th>{{ t('client_one') }}</th>
                                    <th>{{ t('comment') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in reportData.prixod_table" :key="index"
                                    class="report-table-row" @dblclick="tableRowClick(item)">
                                    <td style="width: 40px; text-align: center">{{ index + 1 }}</td>
                                    <td>{{ dayJS(item.prixod?.datetime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</td>
                                    <td>{{ item.prixod?.battery_name }}</td>
                                    <td>{{ item.prixod?.store_name }} || {{ usePhoneFormat(item.prixod?.store_phone) }}</td>
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
                                    <td>{{ item.prixod?.comment }}</td>
                                </tr>
                            </tbody>
                        </n-table>
                        <n-empty size="huge" class="report-data-empty" v-if="showEmptyPrixod">
                        </n-empty>
                    </n-spin>
                </n-space>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
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
const dayJS = inject('dayJS')
const currentDate = new Date();
const beginDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let spinner = ref(false);
let showEmptyRasxod = ref(true);
let showEmptyPrixod = ref(true);
const reportData = ref({});
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
    serial_number: null
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
    showEmptyRasxod.value = true;
    showEmptyPrixod.value = true;

    reportService.serialNumberReport(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (!res.rasxod_table.length == 0) {
            showEmptyRasxod.value = false;
        }
        if (!res.prixod_table.length == 0) {
            showEmptyPrixod.value = false;
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

const updateSerialNumber = () => {
    showEmptyPrixod.value = true;
    showEmptyRasxod.value = true;
    reportData.value.prixod_table = [];
    reportData.value.rasxod_table = [];
}
</script>