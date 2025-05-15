<template>
    <div class="report">
        <div class="report-data">
            <div class="report-data-header">
                <n-flex justify="space-between">
                    <h2>{{ t('service report') }}</h2>
                    <n-icon @click="router.go(-1)" style="cursor: pointer;" size="32" color="rgb(16, 22, 58)">
                        <ExitIcon />
                    </n-icon>
                </n-flex>
                <n-space>
                    <n-date-picker v-model:value="filterHeader.range" type="datetimerange" />
                    <n-select @update:value="updateRegion" v-model:value="filterHeader.region_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.region" value-field="id" label-field="name"
                        :placeholder="t('region')" filterable clearable></n-select>
                    <n-select v-model:value="filterHeader.store_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.store" value-field="id" label-field="name" :placeholder="t('store')"
                        filterable clearable></n-select>
                    <n-select v-model:value="filterHeader.battery_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.battery" value-field="id" label-field="name" :placeholder="t('battery')"
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
                                    <th>{{ t('region') }}</th>
                                    <th>{{ t('store') }}</th>
                                    <th>{{ t('battery') }}</th>
                                    <th>{{ t('service count') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in reportData.data" :key="index" class="report-table-row"
                                    @dblclick="tableRowClick(item)">
                                    <td style="width: 40px; text-align: center">{{ index + 1 }}</td>
                                    <td>{{ item.stores?.regions?.name }}</td>
                                    <td>
                                        <div style="cursor: pointer;">
                                            <n-tooltip placement="bottom-start" trigger="hover">
                                                <template #trigger>
                                                    {{ item.store_name }}
                                                </template>
                                                {{ item.store_name }}
                                                <n-divider :style="{ margin: '4px 0px' }"></n-divider>
                                                {{ usePhoneFormat(item.store_phone) }}
                                            </n-tooltip>
                                        </div>
                                    </td>
                                    <td>{{ item.battery_name }}</td>
                                    <td class="text-right">{{ item.service_count }}</td>
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
import regionService from '@/services/region.service';
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
    region: [],
})
const filterHeader = ref({
    range: [beginDate.getTime(), currentDate.getTime()],
    store_id: null,
    battery_id: null,
    region_id: null,
})
const getAllOption = () => {

    batteryService.allOption().then((res) => {
        selectOption.value.battery = res
    });
    regionService.all().then((res) => {
        selectOption.value.region = res;
    })
}
const getAllStore = () => {
    storeService.all(filterHeader.value).then((res) => {
        selectOption.value.store = res;
    });
}
onMounted(() => {
    getAllOption();
    getAllStore();
})
const showReport = () => {
    spinner.value = true;
    reportService.serviceReport(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (!res?.data.length == 0) {
            showEmpty.value = false;
        }
    })
}
const updateRegion = (region_id) =>{
    filterHeader.value.store_id = null;
    filterHeader.value.region_id = region_id;
    getAllStore()
}
const tableRowClick = (row) => {
    router.push({
        path: '/sverka-service',
        query: {
            store_id: row.store_id,
            battery_id: row.battery_id,
            region_id: row.stores?.region_id,
            range: filterHeader.value.range,
            action: true
        }
    })
}
</script>