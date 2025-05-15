<template>
    <div class="report">
        <div class="report-data">
            <div class="report-data-header">
                <n-flex justify="space-between">
                    <h2>{{ t('prixod sverka') }}</h2>
                    <n-icon @click="router.go(-1)" style="cursor: pointer;" size="32" color="rgb(16, 22, 58)">
                        <ExitIcon />
                    </n-icon>
                </n-flex>
                <n-space>
                    <n-date-picker v-model:value="filterHeader.range" type="datetimerange" clearable />
                    <n-select v-model:value="filterHeader.battery_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.battery" value-field="id" label-field="name" :placeholder="t('battery')"
                        filterable clearable></n-select>
                    <n-select @update:value="updateRegion" v-model:value="filterHeader.region_id"
                        :style="{ minWidth: '210px' }" :options="selectOption.region" value-field="id"
                        label-field="name" :placeholder="t('region')" filterable clearable></n-select>
                    <n-select v-model:value="filterHeader.store_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.store" value-field="id" label-field="name" :placeholder="t('store')"
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
                                    <th>{{ t('store') }}</th>
                                    <th>{{ t('region') }}</th>
                                    <th>{{ t('battery') }}</th>
                                    <th>{{ t('serial number') }}</th>
                                    <th>{{ t('comment') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in reportData.data" :key="index" class="report-table-row"
                                    @dblclick="tableRowClick(item)">
                                    <td style="width: 40px; text-align: center">{{ index + 1 }}</td>
                                    <td>{{ dayJS(item.prixod?.datetime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</td>
                                    <td>{{ item.prixod?.store }} || {{ usePhoneFormat(item.prixod?.store_phone) }} </td>
                                    <td>{{ item.prixod?.region_name }}</td>
                                    <td>{{ item.prixod?.battery }}</td>
                                    <td>{{ item.serial_number }}</td>
                                    <td>{{ item.prixod?.comment }}</td>
                                </tr>
                                <tr class="sticky-bottom-second">
                                    <th colspan="5" class="text-center">{{ t('total') }}</th>
                                    <th class="text-right">{{ reportData?.data?.length || 0 }}</th>
                                    <th></th>
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
import { ref, onMounted, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ExitIcon, EyeIcon } from "@/components/icons/icon";
import storeService from '@/services/store.service';
import batteryService from '@/services/battery.service';
import reportService from '../../services/report.service';
import regionService from '@/services/region.service';
import { useSummaFormat, usePhoneFormat } from '@/composible/NumberFormat';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const dayJS = inject('dayJS')
const router = useRouter();
const route = useRoute();
const currentDate = new Date();
const beginDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let spinner = ref(false);
let showEmpty = ref(true);
const reportData = ref([]);
const selectOption = ref({
    battery: [],
    user: [],
    store: [],
    region: []

})
const filterHeader = ref({
    range: [beginDate.getTime(), currentDate.getTime()],
    battery_id: null,
    store_id: null,
    region_id: null
})
const getAllOptionStatic = () => {
    batteryService.allOption().then((res) => {
        selectOption.value.battery = res;
    })
    regionService.all().then((res) => {
        selectOption.value.region = res;
    })
}
const getAllStore = () => {
    storeService.all(filterHeader.value).then((res) => {
        selectOption.value.store = res;
    })
}
const showReport = () => {
    spinner.value = true;
    showEmpty.value = true;
    reportService.prixodSverka(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (!res?.data.length == 0) {
            showEmpty.value = false;
        }
    })
}
const updateRegion = (region_id) => {
    filterHeader.value.store_id = null;
    filterHeader.value.region_id = region_id;
    getAllStore()
}
const routeQuery = () => {
    let el = route.query;
    if (Boolean(el?.action)) {
        filterHeader.value.battery_id = el.battery_id ? parseInt(el.battery_id) : null;
        filterHeader.value.region_id = el.region_id? parseInt(el.region_id): null;
        filterHeader.value.store_id = el.store_id ? parseInt(el.store_id) : null;
        filterHeader.value.range = el.range ? [parseInt(el.range[0]), parseInt(el.range[1])] : null;
        showReport()
    }
}
const tableRowClick = (row) => {
    router.push({
        path: '/prixod-table',
        query: {
            id: row.prixod_id,
            action: true
        }
    })
}
onMounted(() => {
    getAllOptionStatic();
    getAllStore()
    routeQuery()
})

</script>