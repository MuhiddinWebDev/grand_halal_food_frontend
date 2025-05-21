<script setup>
import { ref, onMounted, computed } from "vue";
import reportService from "../../services/report.service";
import { ClientIcon, AdminIcon, BatteryIcon, StoreIcon, RefreshIcon } from '@/components/icons/icon';
import BarChart from "@/components/Charts/bar.vue";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
let chartBatteryData = ref({
    region: [],
    battery: [],
    data1: [],
    data2: []
})
const selectOption = ref({
    region: [],
    battery: []
})
const infoCard = ref({
    client: 0,
    store: 0,
    user: 0,
    battery: 0,
});
const currentDate = new Date();
const beginDate = new Date(currentDate.getFullYear(), 0, 1)
const filterHeader = ref({
    range: [beginDate.getTime(), currentDate.getTime()],
    battery_id: null,
    region_id: null
})

const getReport = () => {
    reportService.homeReport().then((res) => {
        infoCard.value = res;
    })
}




const barDataByRegion = computed(() => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
        },
        xAxis: [
            {
                type: 'category',
                data: chartBatteryData.value.region,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        grid: {
            left: '2%',
            right: '2%',
            bottom: '10%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar', 'stack'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        series: [
            {
                type: 'bar',
                barWidth: '95%',
                data: chartBatteryData.value.data1
            },
        ]
    }
});

const barDataByBattery = computed(() => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
        },
        xAxis: [
            {
                type: 'category',
                data: chartBatteryData.value.battery,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        grid: {
            left: '2%',
            right: '2%',
            bottom: '10%', // Ensure space for rotated labels
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar', 'stack'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        series: [
            {
                name: t('battery'),
                type: 'bar',
                barWidth: '95%',
                data: chartBatteryData.value.data2
            },
        ]
    }
});

const updateDiagramm = () => {
}


onMounted(() => {
    // getReport();
})
</script>

<template>
    <div class="p-6 space-y-6">
        <!-- Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Client Card -->
            <n-card style="background-color: #059669; border-radius: 10px; color: white;" class="rounded-lg shadow-lg">
                <template #footer>
                    <h2 class="text-lg font-semibold mb-2">{{ t('client') }}</h2>
                    <n-divider class="my-2 bg-white opacity-30" />
                    <div class="flex items-center justify-between">
                        <n-icon size="40">
                            <ClientIcon />
                        </n-icon>
                        <h1 class="text-2xl font-bold">
                            <n-number-animation :from="0" :to="infoCard.client" />
                        </h1>
                    </div>
                </template>
            </n-card>


            <!-- Store Card -->
            <n-card style="background-color: #0d9488; border-radius: 10px; color: white;" class="rounded-lg shadow-lg">
                <template #footer>
                    <h2 class="text-lg font-semibold mb-2">{{ t('stores') }}</h2>
                    <n-divider class="my-2 bg-white opacity-30" />
                    <div class="flex items-center justify-between">
                        <n-icon size="40">
                            <StoreIcon />
                        </n-icon>
                        <h1 class="text-2xl font-bold">
                            <n-number-animation :from="0" :to="infoCard.store" />
                        </h1>
                    </div>
                </template>
            </n-card>


            <!-- Admin Card -->
            <n-card style="background-color: #dc2626; border-radius: 10px; color: white;" class="rounded-lg shadow-lg">
                <template #footer>
                    <h2 class="text-lg font-semibold mb-2">{{ t('admin') }}</h2>
                    <n-divider class="my-2 bg-white opacity-30" />
                    <div class="flex items-center justify-between">
                        <n-icon size="40">
                            <AdminIcon />
                        </n-icon>
                        <h1 class="text-2xl font-bold">
                            <n-number-animation :from="0" :to="infoCard.user" />
                        </h1>
                    </div>
                </template>
            </n-card>


            <!-- Battery Card -->
            <n-card style="background-color: #f59e0b; border-radius: 10px; color: white;" class="rounded-lg shadow-lg">
                <template #footer>
                    <h2 class="text-lg font-semibold mb-2">{{ t('batteries') }}</h2>
                    <n-divider class="my-2 bg-white opacity-30" />
                    <div class="flex items-center justify-between">
                        <n-icon size="40">
                            <BatteryIcon />
                        </n-icon>
                        <h1 class="text-2xl font-bold">
                            <n-number-animation :from="0" :to="infoCard.battery" />
                        </h1>
                    </div>
                </template>
            </n-card>

        </div>

        <!-- Charts & Filters -->
        <div class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Filter Row -->
                <div class="col-span-full flex flex-wrap gap-4 items-center">
                    <n-date-picker v-model:value="filterHeader.range" type="daterange" />
                    <n-button @click="updateDiagramm" type="success">
                        <template #icon>
                            <n-icon>
                                <RefreshIcon />
                            </n-icon>
                        </template>
                        {{ t('update') }}
                    </n-button>
                </div>

                <!-- Chart 1 -->
                <div class="w-full">
                    <BarChart :data="barDataByRegion" />
                </div>

                <!-- Chart 2 -->
                <div class="w-full">
                    <BarChart :data="barDataByBattery" />
                </div>
            </div>
        </div>
    </div>
</template>
