<script setup>
import { ref, onMounted, computed } from "vue";
import reportService from "../../services/report.service";
import { ClientIcon, StoreIcon, OrderIcon, BasketIcon, RefreshIcon } from '@/components/icons/icon';
import ChartTemp from "@/components/Charts/Index.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const { t, locale } = useI18n();
const router = useRouter();
let chartCategoryData = ref({
    product: [],
    category: {
        uz: [],
        ru: [],
        en: [],
        ko: []
    },
    data: []
})

const infoCard = ref({
    client: 0,
    product: 0,
    sklad: 0,
    orders: 0,
});
const currentDate = new Date();
const beginDate = new Date(currentDate.getFullYear(), 0, 1)
const filterHeader = ref({
    range: [beginDate.getTime(), currentDate.getTime()],
    category_id: null,
})

const getReport = () => {
    reportService.homeReport().then((res) => {
        infoCard.value = res;
    })
    reportService.productReportByCategory().then((res) => {
        chartCategoryData.value = res;
    })
}

const pieDataByCategory = computed(() => {
    const categoryTitles = chartCategoryData.value.category[locale.value] || [];
    const productList = chartCategoryData.value.product || [];
    const data = productList.map((item, index) => ({
        name: categoryTitles[index] || `Kategoriya ${index + 1}`,
        value: item.product_count ?? 0
    }));

    return {
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>Mahsulotlar soni: {c} ({d}%)'
        },
        legend: {
            type: 'scroll',
            orient: 'horizontal',  // <--- pastga chiqarish uchun horizontal qilish
            top: 10,            // <--- pastdan joy
            left: 'center',        // <--- o‘rtaga hizalash
            textStyle: {
                fontSize: 14
            },
            itemWidth: 14,
            itemHeight: 10,
            padding: [10, 20, 10, 20]
        },

        series: [
            {
                name: 'Mahsulotlar soni',
                type: 'pie',
                radius: ['40%', '70%'], // donut
                roseType: 'radius', // bo‘lak radiusi son asosida farqlanadi
                minAngle: 3, // juda kichik sonli bo‘laklar ham ko‘rinsin
                padAngle: 2,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {c}',
                    fontSize: 14,
                    lineHeight: 16
                },
                labelLayout: {
                    hideOverlap: true,
                    moveOverlap: 'shiftY'
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10,
                    smooth: true
                },
                data
            }
        ]
    };
});

const updateDiagramm = () => {
}


onMounted(() => {
    getReport();
})
</script>

<template>
    <div class="p-2 space-y-2">
        <!-- Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <n-card @click="router.push({ name: 'client' })"
                class="rounded-lg shadow-lg cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 transition duration-300 ease-in-out">
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

            <n-card @click="router.push({ name: 'product' })"
                class="rounded-lg shadow-lg cursor-pointer bg-teal-600 text-white hover:bg-teal-700 transition duration-300 ease-in-out">
                <template #footer>
                    <h2 class="text-lg font-semibold mb-2">{{ t('products') }}</h2>
                    <n-divider class="my-2 bg-white opacity-30" />
                    <div class="flex items-center justify-between">
                        <n-icon size="40">
                            <BasketIcon />
                        </n-icon>
                        <h1 class="text-2xl font-bold">
                            <n-number-animation :from="0" :to="infoCard.product" />
                        </h1>
                    </div>
                </template>
            </n-card>

            <n-card @click="router.push({ name: 'stock-entries' })"
                class="rounded-lg shadow-lg cursor-pointer bg-red-600 text-white hover:bg-red-700 transition duration-300 ease-in-out">
                <template #footer>
                    <h2 class="text-lg font-semibold mb-2">{{ t('sklad') }}</h2>
                    <n-divider class="my-2 bg-white opacity-30" />
                    <div class="flex items-center justify-between">
                        <n-icon size="40">
                            <StoreIcon />
                        </n-icon>
                        <h1 class="text-2xl font-bold">
                            <n-number-animation :from="0" :to="infoCard.sklad" />
                        </h1>
                    </div>
                </template>
            </n-card>

            <n-card @click="router.push({ name: 'order' })"
                class="rounded-lg shadow-lg cursor-pointer bg-amber-500 text-white hover:bg-amber-600 transition duration-300 ease-in-out">
                <template #footer>
                    <h2 class="text-lg font-semibold mb-2">{{ t('orders') }}</h2>
                    <n-divider class="my-2 bg-white opacity-30" />
                    <div class="flex items-center justify-between">
                        <n-icon size="40">
                            <OrderIcon />
                        </n-icon>
                        <h1 class="text-2xl font-bold">
                            <n-number-animation :from="0" :to="infoCard.orders" />
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
                <div class="w-full">
                    <ChartTemp :data="pieDataByCategory" width="800px" height="800px" />
                </div>
                 <div class="w-full">
                    <ChartTemp :data="pieDataByCategory" width="800px" height="800px" />
                </div>
                 <div class="w-full">
                    <ChartTemp :data="pieDataByCategory" width="800px" height="800px" />
                </div>
                 <div class="w-full">
                    <ChartTemp :data="pieDataByCategory" width="800px" height="800px" />
                </div>
            </div>
        </div>
    </div>
</template>
