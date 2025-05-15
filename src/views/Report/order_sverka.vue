<template>
    <div class="report">
        <div class="report-data">
            <div class="report-data-header">
                <n-flex justify="space-between">
                    <h2>{{ t('order sverka') }}</h2>
                    <n-icon @click="router.go(-1)" style="cursor: pointer;" size="32" color="rgb(16, 22, 58)">
                        <ExitIcon />
                    </n-icon>
                </n-flex>
                <n-space>
                    <n-date-picker v-model:value="filterHeader.range" type="datetimerange" />
                    <n-select @update:value="updateRegion" v-model:value="filterHeader.region_id"
                        :style="{ minWidth: '210px' }" :options="selectOption.region" value-field="id"
                        label-field="name" :placeholder="t('region')" filterable clearable></n-select>
                    <n-select v-model:value="filterHeader.store_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.store" value-field="id" label-field="name" :placeholder="t('store')"
                        filterable clearable></n-select>
                    <n-select v-model:value="filterHeader.battery_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.battery" value-field="id" label-field="name" :placeholder="t('battery')"
                        filterable clearable></n-select>
                    <!-- <n-select v-model:value="filterHeader.client_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.client" value-field="id" label-field="fullname"
                        :placeholder="t('client_one')" filterable clearable></n-select> -->
                    <n-select v-model:value="filterHeader.status" :style="{ minWidth: '210px' }"
                        :options="globalData.orderStatus" :label-field="'label_' + locale" :placeholder="t('status')"
                        filterable clearable></n-select>
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
                                    <th style="width: 150px;">{{ t('datetime') }}</th>
                                    <th>{{ t('region') }}</th>
                                    <th>{{ t('store') }}</th>
                                    <th>{{ t('battery') }}</th>
                                    <th>{{ t('serial number') }}</th>
                                    <th style="width: 140px;">{{ t('status') }}</th>
                                    <th>{{ t('comment') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in reportData.data" :key="index" class="report-table-row"
                                    @dblclick="tableRowClick(item)">
                                    <td style="width: 40px; text-align: center">{{ index + 1 }}</td>
                                    <td>{{ dayJS(item.order?.datetime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</td>
                                    <td>{{ item.order?.store?.regions.name }}</td>
                                    <td>{{ item.order?.store?.name }} || {{ usePhoneFormat(item.order?.store?.phone) }}
                                    </td>
                                    <td>{{ item.battery?.name }}</td>
                                    <td>{{ item.serial_number }}</td>
                                    <td style="text-align: center;"> <n-tag :type="statusType(item.order?.status)">
                                            {{ t(item.order?.status) }}
                                        </n-tag>
                                    </td>
                                    <td>{{ item.comment }}</td>
                                </tr>
                                <!-- <tr class="sticky-bottom-second">
                                    <th colspan="4" class="text-center">{{ t('total')}}</th>
                                    <th class="text-right">{{ reportData.total_battery }}</th>
                                    <th class="text-right">{{ reportData.total_client }}</th>
                                </tr> -->
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
import { ref, onMounted, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ExitIcon, EyeIcon } from "@/components/icons/icon";
import clientsService from '@/services/clients.service';
import storeService from '@/services/store.service';
import batteryService from '@/services/battery.service';
import reportService from '../../services/report.service';
import regionService from '@/services/region.service';
import { useGlobalStore } from '@/stores/global';
import { usePhoneFormat } from '@/composible/NumberFormat';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
const dayJS = inject('dayJS')
const route = useRoute();
const router = useRouter();
const globalData = useGlobalStore();
const currentDate = new Date();
const beginDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let spinner = ref(false);
let showEmpty = ref(true);

const selectOption = ref({
    client: [],
    store: [],
    battery: [],
    region: []
});
const reportData = ref({
    data: [],
    total_battery: 0,
    total_client: 0
});
const filterHeader = ref({
    range: [beginDate.getTime(), currentDate.getTime()],
    store_id: null,
    battery_id: null,
    status: null,
    client_id: null,
    region_id: null
})
const getAllOption = () => {
    regionService.all().then((res) => {
        selectOption.value.region = res;
    })
    // clientsService.all().then((res) => {
    //     selectOption.value.client = res;
    // });

    batteryService.allOption().then((res) => {
        selectOption.value.battery = res;
    })
}
const getAllStore = () => {
    storeService.all(filterHeader.value).then((res) => {
        selectOption.value.store = res;
    });
}
const routeQuery = () => {
    let el = route.query;
    if (Boolean(el?.action)) {
        filterHeader.value.battery_id = el.battery_id ? parseInt(el.battery_id) : null;
        filterHeader.value.store_id = el.store_id ? parseInt(el.store_id) : null;
        filterHeader.value.client_id = el.client_id ? parseInt(el.client_id) : null;
        filterHeader.value.range = el.range ? [parseInt(el.range[0]), parseInt(el.range[1])] : null;
        showReport();
    }
}

onMounted(() => {
    getAllOption();
    getAllStore()
    routeQuery()
})
const updateRegion = (region_id) => {
    filterHeader.value.store_id = null;
    filterHeader.value.region_id = region_id;
    getAllStore()
}
const showReport = () => {
    spinner.value = true;
    reportService.orderSverka(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (!res?.data.length == 0) {
            showEmpty.value = false;
        }
    })
}
const tableRowClick = (row) => {
    router.push({
        path: '/order-table',
        query: {
            id: row.order?.id,
            action: true
        },
    })
}
const statusType = (status) => {
    return status == 'finished' ? 'success' : status == 'new' ? 'info' : 'warning'
}
</script>