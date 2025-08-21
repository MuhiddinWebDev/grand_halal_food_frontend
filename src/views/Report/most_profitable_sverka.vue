<template>
    <div class="p-4">
        <div class="bg-white rounded-lg shadow-md">
            <div class="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                <h2 class="text-xl font-bold">{{ t('most profitable sverka') }}</h2>
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
                            <!-- Header row -->
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-slate-500">#{{ index + 1 }}</span>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                        #{{ item.order_id }}
                                    </span>
                                </div>
                                <div class="text-xs text-slate-500">
                                    {{ dayJS(item.datetime).format('DD-MM-YYYY HH:mm') }}
                                </div>
                            </div>

                            <!-- Product -->
                            <div class="mt-1">
                                <div class="text-slate-500 text-xs">{{ t('product') }}</div>
                                <div class="font-medium truncate" :title="item.product?.['title_' + locale]">
                                    {{ item.product?.['title_' + locale] || '—' }}
                                </div>
                            </div>

                            <!-- Numbers grid -->
                            <div class="mt-2 grid grid-cols-2 gap-2">
                                <div>
                                    <div class="text-slate-500 text-[11px]">{{ t('selling price') }}</div>
                                    <div class="font-semibold">{{ useSummaFormat(item.price || 0) }}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-slate-500 text-[11px]">{{ t('get price') }}</div>
                                    <div class="font-semibold">{{ useSummaFormat(item.get_price || 0) }}</div>
                                </div>

                                <div>
                                    <div class="text-slate-500 text-[11px]">{{ t('discount') }}</div>
                                    <div class="font-semibold">{{ useSummaFormat(item.discount_summa || 0) }}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-slate-500 text-[11px]">{{ t('profit') }}</div>
                                    <div class="font-semibold">
                                        {{ useSummaFormat((item.price || 0) - (item.get_price || 0) -
                                        (item.discount_summa || 0)) }}
                                    </div>
                                </div>

                                <div>
                                    <div class="text-slate-500 text-[11px]">{{ t('delivery_summa') }}</div>
                                    <div class="font-semibold">{{ useSummaFormat(item.delivery_summa || 0) }}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-slate-500 text-[11px]">
                                        {{ t('total') }} {{ t('summa').toLocaleLowerCase() }}
                                    </div>
                                    <div class="font-semibold">
                                        {{
                                            useSummaFormat(
                                                ((item.price || 0) - (item.get_price || 0) - (item.discount_summa || 0)) +
                                        (item.delivery_summa || 0)
                                        )
                                        }}
                                    </div>
                                </div>
                            </div>

                            <!-- Admin -->
                            <div class="mt-2 flex items-center justify-between">
                                <div class="text-[11px] text-slate-500">{{ t('admin_one') }}</div>
                                <div class="text-xs font-medium text-slate-700 text-right truncate max-w-[65%]">
                                    {{ item.user?.fullname || '—' }} <span v-if="item.user?.phone">| {{ item.user?.phone
                                        }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Mobile totals -->
                        <div class="rounded-lg border p-3 bg-gray-50 sticky bottom-5">
                            <div class="flex justify-between text-sm">
                                <span>{{ t('total') }}</span>
                                <span class="font-semibold">{{ reportData.data?.length || 0 }}</span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{{ t('discount') }}</span>
                                <span class="font-semibold">{{ useSummaFormat(reportData.total_discount_summa || 0)
                                    }}</span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{{ t('profit') }}</span>
                                <span class="font-semibold">{{ useSummaFormat(reportData.total_profit_summa || 0)
                                    }}</span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{{ t('delivery_summa') }}</span>
                                <span class="font-semibold">{{ useSummaFormat(reportData.total_delivery_summa || 0)
                                    }}</span>
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
                                class="min-w-[1100px] w-full bg-white shadow-md rounded-lg overflow-hidden border table-auto">
                                <thead>
                                    <tr class="bg-gray-200 text-left border">
                                        <th class="px-4 py-2 text-sm w-10">#</th>
                                        <th class="px-4 py-2 text-sm">{{ t('datetime') }}</th>
                                        <th class="px-4 py-2 text-sm w-[130px]">
                                            {{ t('order') }} {{ t('count').toLocaleLowerCase() }}
                                        </th>
                                        <th class="px-4 py-2 text-sm">{{ t('product') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('selling price') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('get price') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('discount') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('profit') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('delivery_summa') }}</th>
                                        <th class="px-4 py-2 text-sm">
                                            {{ t('total') }} {{ t('summa').toLocaleLowerCase() }}
                                        </th>
                                        <th class="px-4 py-2 text-sm">{{ t('admin_one') }}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="(item, index) in reportData.data" :key="index"
                                        class="border hover:bg-gray-50 cursor-pointer" @dblclick="tableRowClick(item)">
                                        <td class="px-4 py-2 border">{{ index + 1 }}</td>
                                        <td class="px-4 py-2 border">{{ dayJS(item.datetime).format('DD-MM-YYYY HH:mm')
                                            }}</td>
                                        <td class="px-4 py-2 border">#{{ item.order_id }}</td>
                                        <td class="px-4 py-2 border max-w-[360px] truncate"
                                            :title="item.product?.['title_' + locale]">
                                            {{ item.product?.['title_' + locale] }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">{{ useSummaFormat(item.price) }}</td>
                                        <td class="px-4 py-2 text-right border">{{ useSummaFormat(item.get_price) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">{{ useSummaFormat(item.discount_summa)
                                            }}</td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(item.price - item.get_price - item.discount_summa) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">{{ useSummaFormat(item.delivery_summa)
                                            }}</td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat((item.price - item.get_price - item.discount_summa) +
                                            item.delivery_summa) }}
                                        </td>
                                        <td class="px-4 py-2 text-center border">
                                            {{ item.user?.fullname || '—' }} <span v-if="item.user?.phone">|| {{
                                                item.user?.phone
                                                }}</span>
                                        </td>
                                    </tr>

                                    <tr v-if="!reportData.data?.length && !spinner">
                                        <td colspan="11" class="px-4 py-6 text-center text-slate-500">
                                            <n-empty />
                                        </td>
                                    </tr>

                                    <!-- Totals -->
                                    <tr class="bg-gray-100">
                                        <td colspan="2" class="px-4 py-2 text-center font-semibold border">{{ t('total')
                                            }}</td>
                                        <td class="px-4 py-2 text-right border">{{ reportData.data?.length || 0 }}</td>
                                        <td colspan="4" class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(reportData.total_discount_summa || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(reportData.total_profit_summa || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(reportData.total_delivery_summa || 0) }}
                                        </td>
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat((reportData.total_profit_summa || 0) +
                                            (reportData.total_delivery_summa || 0)) }}
                                        </td>
                                        <td class="border"></td>
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
import { ref, onMounted, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ExitIcon, EyeIcon } from "@/components/icons/icon";
import reportService from '../../services/report.service';
import productService from '@/services/product.service';
import { useI18n } from 'vue-i18n';
import { useSummaFormat } from '@/composible/NumberFormat';
const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const dayJS = inject('dayJS');
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
const showQuery = () => {
    let el = route.query;
    if (Boolean(el?.action)) {
        filterHeader.value.product_id = el.product_id ? parseInt(el.product_id) : null;
        filterHeader.value.range = el.range ? [parseInt(el.range[0]), parseInt(el.range[1])] : null;
        showReport()
    }
}
onMounted(() => {
    showQuery()
    getOption();
});

const showReport = () => {
    spinner.value = true;
    showEmpty.value = true;
    reportService.mostSoldSverka(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (res.data && res.data.length > 0) {
            showEmpty.value = false;
        }
    });
};

</script>
