<template>
    <div class="p-4">
        <div class="bg-white rounded-lg shadow-md">
            <div class="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                <h2 class="text-xl font-bold">{{ t('most profitable report') }}</h2>
                <n-button @click="router.go(-1)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    <template #icon>
                        <n-icon size="28">
                            <ExitIcon />
                        </n-icon>
                    </template>
                    {{ t('exit') }}
                </n-button>
            </div>

            <div class="flex flex-wrap gap-4 p-2">
                <!-- Date Picker -->
                <div class="w-[400px] sm:w-[300px]">
                    <n-date-picker v-model:value="filterHeader.range" type="datetimerange" clearable
                        class="w-full sm:w-[300px]" />
                </div>

                <!-- Product Select -->
                <div class="w-full sm:w-64">
                    <n-select :options="productOptions" v-model:value="filterHeader.product_id" value-field="id"
                        :label-field="'title_' + locale" :placeholder="t('product')" filterable clearable
                        class="w-full">
                    </n-select>
                </div>

                <div class="w-full sm:w-auto">
                    <n-button type="success" @click="showReport"
                        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto">
                        <template #icon>
                            <n-icon>
                                <EyeIcon />
                            </n-icon>
                        </template>
                        {{ t('see') }}
                    </n-button>
                </div>
            </div>

            <div class="p-4">
                <n-spin :show="spinner" class="w-full">
                    <!-- MOBILE LIST (md dan kichik) -->
                    <div class="md:hidden space-y-3">
                        <div v-for="(item, index) in reportData.data" :key="index"
                            class="rounded-lg border p-3 shadow-sm bg-white active:scale-[0.99] transition cursor-pointer"
                            @click="tableRowClick(item)">
                            <div class="flex items-start justify-between gap-2">
                                <div class="text-xs text-slate-500">#{{ index + 1 }}</div>
                                <!-- Agar xohlasangiz bu yerga badge qo'shishingiz mumkin -->
                            </div>

                            <div class="mt-1">
                                <div class="text-slate-500 text-xs">{{ t('product') }}</div>
                                <div class="font-medium truncate" :title="item.product?.['title_' + locale]">
                                    {{ item.product?.['title_' + locale] || '—' }}
                                </div>
                            </div>

                            <div class="mt-2 grid grid-cols-2 gap-2">
                                <div>
                                    <div class="text-slate-500 text-[11px]">
                                        {{ t('total') }} {{ t('count').toLocaleLowerCase() }}
                                    </div>
                                    <div class="font-semibold">{{ item.product_count || 0 }}</div>
                                </div>

                                <div class="text-right">
                                    <div class="text-slate-500 text-[11px]">{{ t('selling price') }}</div>
                                    <div class="font-semibold">{{ useSummaFormat(item.price || 0) }}</div>
                                </div>

                                <div>
                                    <div class="text-slate-500 text-[11px]">{{ t('get price') }}</div>
                                    <div class="font-semibold">{{ useSummaFormat(item.get_price || 0) }}</div>
                                </div>

                                <div class="text-right">
                                    <div class="text-slate-500 text-[11px]">{{ t('discount') }}</div>
                                    <div class="font-semibold">{{ useSummaFormat(item.discount_summa || 0) }}</div>
                                </div>

                                <div>
                                    <div class="text-slate-500 text-[11px]">{{ t('profit') }}</div>
                                    <div class="font-semibold">{{ useSummaFormat(item.profit_summa || 0) }}</div>
                                </div>

                                <div class="text-right">
                                    <div class="text-slate-500 text-[11px]">{{ t('delivery_summa') }}</div>
                                    <div class="font-semibold">{{ useSummaFormat(item.total_delivery || 0) }}</div>
                                </div>
                            </div>

                            <div class="mt-2 flex justify-end">
                                <span class="text-xs bg-blue-600 text-white rounded px-2 py-0.5">
                                    {{ t('total') }} {{ t('summa').toLocaleLowerCase() }}:
                                    {{ useSummaFormat((item.profit_summa || 0) + (item.total_delivery || 0)) }}
                                </span>
                            </div>
                        </div>

                        <!-- Mobile totals -->
                        <div class="rounded-lg border p-3 bg-gray-50 sticky bottom-5">
                            <div class="flex justify-between text-sm">
                                <span>{{ t('total') }} {{ t('count').toLocaleLowerCase() }}</span>
                                <span class="font-semibold">{{ reportData.total_product_count || 0 }}</span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{{ t('discount') }}</span>
                                <span class="font-semibold">
                                    {{ useSummaFormat(reportData.total_discount_summa || 0) }}
                                </span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{{ t('profit') }}</span>
                                <span class="font-semibold">
                                    {{ useSummaFormat(reportData.total_profit_summa || 0) }}
                                </span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{{ t('delivery_summa') }}</span>
                                <span class="font-semibold">
                                    {{ useSummaFormat(reportData.total_delivery_summa || 0) }}
                                </span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{{ t('total') }} {{ t('summa').toLocaleLowerCase() }}</span>
                                <span class="font-semibold">
                                    {{
                                        useSummaFormat(
                                            (reportData.total_profit_summa || 0) +
                                    (reportData.total_delivery_summa || 0)
                                    )
                                    }}
                                </span>
                            </div>
                        </div>

                        <div v-if="!reportData.data?.length && !spinner" class="rounded-lg border p-6 bg-white">
                            <n-empty />
                        </div>
                    </div>

                    <!-- DESKTOP TABLE (md va katta) -->
                    <div class="hidden md:block">
                        <div class="overflow-x-auto">
                            <table
                                class="min-w-[1000px] w-full bg-white shadow-md rounded-lg overflow-hidden border table-auto">
                                <thead class="bg-gray-100">
                                    <tr class="text-left border-b">
                                        <th class="px-4 py-2 text-sm w-10">#</th>
                                        <th class="px-4 py-2 text-sm">{{ t('product') }}</th>
                                        <th class="px-4 py-2 text-sm">
                                            {{ t('total') }} {{ t('count').toLocaleLowerCase() }}
                                        </th>
                                        <th class="px-4 py-2 text-sm">{{ t('selling price') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('get price') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('discount') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('profit') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('delivery_summa') }}</th>
                                        <th class="px-4 py-2 text-sm">
                                            {{ t('total') }} {{ t('summa').toLocaleLowerCase() }}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="(item, index) in reportData.data" :key="index"
                                        class="border hover:bg-gray-50 cursor-pointer" @dblclick="tableRowClick(item)">
                                        <td class="px-4 py-2 border">{{ index + 1 }}</td>
                                        <td class="px-4 py-2 border max-w-[360px] truncate"
                                            :title="item.product?.['title_' + locale]">
                                            {{ item.product?.['title_' + locale] }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ item.product_count || 0 }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(item.price || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(item.get_price || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(item.discount_summa || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(item.profit_summa || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(item.total_delivery || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat((item.profit_summa || 0) + (item.total_delivery || 0)) }}
                                        </td>
                                    </tr>

                                    <tr v-if="!reportData.data?.length && !spinner">
                                        <td colspan="9" class="px-4 py-6 text-center text-slate-500">
                                            <n-empty />
                                        </td>
                                    </tr>

                                    <!-- Totals -->
                                    <tr class="bg-gray-100 ">
                                        <td colspan="2" class="px-4 py-2 text-center font-semibold border">
                                            {{ t('total') }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ reportData.total_product_count || 0 }}
                                        </td>
                                        <!-- Sells + Get + Discount merged to keep layout compact -->
                                        <td class="px-4 py-2 text-right border" colspan="3">
                                            {{ useSummaFormat(reportData.total_discount_summa || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(reportData.total_profit_summa || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(reportData.total_delivery_summa || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{
                                                useSummaFormat(
                                                    (reportData.total_profit_summa || 0) +
                                            (reportData.total_delivery_summa || 0)
                                            )
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </n-spin>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ExitIcon, EyeIcon } from "@/components/icons/icon";
import reportService from '../../services/report.service';
import productService from '@/services/product.service';
import { useI18n } from 'vue-i18n';
import { useSummaFormat } from '@/composible/NumberFormat';
const { t, locale } = useI18n();
const router = useRouter();
const productOptions = ref([]);
const currentDate = new Date();
const beginDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let spinner = ref(false);
let showEmpty = ref(true);
const reportData = ref({
    data: [],
    total_product_count: 0,
    total_discount_summa: 0,
    total_profit_summa: 0,
    total_delivery_summa: 0
});

const filterHeader = ref({
    range: [beginDate.getTime(), currentDate.getTime()],
    product_id: null,
});
const getOption = async () => {
    try {
        productOptions.value = await productService.all();
    } catch (e) {
        console.log(e)
    }
}
onMounted(() => {
    getOption();
});

const showReport = () => {
    spinner.value = true;
    showEmpty.value = true;
    reportService.mostSoldReport(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (res.data && res.data.length > 0) {
            showEmpty.value = false;
        }
    });
};

const tableRowClick = (row) => {
    router.push({
        path: '/sverka-most-profit',
        query: {
            range: filterHeader.value.range,
            product_id: row.product_id,
            action: true
        },
    });
};
</script>
