<template>
    <div class="p-4">
        <div class="bg-white rounded-lg shadow-md">
            <div class="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                <h2 class="text-xl font-bold">{{ t('order sverka') }}</h2>
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

                <!-- Type Select -->
                <div class="w-full sm:w-64">
                    <n-select :options="orderStatusOption" v-model:value="filterHeader.status"
                        :placeholder="t('order') + ' ' + t('status').toLocaleLowerCase()" filterable clearable
                        class="w-full" :label-field="'label_' + locale">
                    </n-select>
                </div>

                <div class="w-full sm:w-64">
                    <n-select :options="paidOption" v-model:value="filterHeader.paid_action" :placeholder="t('paid')"
                        filterable clearable class="w-full">
                    </n-select>
                </div>

                <!-- Button to show report -->
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
                        <div v-for="(item, index) in rows" :key="item.id || index"
                            class="rounded-lg border p-3 shadow-sm bg-white">
                            <!-- Top row: index, datetime, status -->
                            <div class="flex items-center justify-between gap-2">
                                <div class="text-xs text-slate-500">#{{ index + 1 }}</div>
                                <div class="text-xs text-slate-500">
                                    {{ dayJS(item.order?.datetime).format('DD.MM.YYYY HH:mm') }}
                                </div>
                                <div v-if="item.order?.status" class="shrink-0">
                                    <template v-if="findStatus(item.order.status)">
                                        <span :class="[
                                            'text-xs px-2 py-0.5 rounded',
                                            findStatus(item.order.status).color
                                        ]">
                                            {{ findStatus(item.order.status)['label_' + locale] }}
                                        </span>
                                    </template>
                                    <template v-else>
                                        <span class="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                                            {{ item.order.status }}
                                        </span>
                                    </template>
                                </div>
                            </div>

                            <!-- Client mini card -->
                            <div class="mt-2 flex items-start gap-3">
                                <div class="flex-shrink-0 h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center
               text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                                    {{ (item.order?.client?.first_name?.[0] || item.order?.client?.mail?.[0] ||
                                    '—').toUpperCase()
                                    }}
                                </div>
                                <div class="min-w-0">
                                    <div class="font-medium leading-tight truncate">
                                        {{
                                            [item.order?.client?.first_name, item.order?.client?.last_name]
                                                .filter(Boolean).join(' ')
                                            || item.order?.client?.mail
                                        || item.order?.client?.phone_number
                                        || '—'
                                        }}
                                    </div>
                                    <div class="mt-0.5 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                                        <a v-if="item.order?.client?.mail" :href="`mailto:${item.order.client.mail}`"
                                            class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200">
                                            {{ item.order.client.mail }}
                                        </a>
                                        <a v-if="item.order?.client?.phone_number"
                                            :href="`tel:${String(item.order.client.phone_number).replace(/[^\d+]/g, '')}`"
                                            class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200">
                                            {{ item.order.client.phone_number }}
                                        </a>
                                    </div>
                                    <n-ellipsis v-if="item.order?.client?.address"
                                        class="text-[11px] text-slate-500 mt-1" :tooltip="true">
                                        {{ item.order.client.address }}
                                    </n-ellipsis>
                                </div>
                            </div>

                            <!-- Product + totals line -->
                            <div class="mt-3 grid grid-cols-2 gap-2 items-end">
                                <div class="text-sm">
                                    <div class="text-slate-500 text-xs">{{ t('product') }}</div>
                                    <div class="font-medium truncate">
                                        {{ item.product?.['title_' + locale] || '—' }}
                                    </div>
                                </div>
                                <div class="text-right text-sm">
                                    <div class="text-slate-500 text-xs">{{ t('total') }}</div>
                                    <div class="font-semibold">
                                        {{ item.quantity }} × {{ useSummaFormat(item.price) }}
                                        = {{ useSummaFormat((Number(item.quantity) || 0) * (Number(item.price) || 0)) }}
                                    </div>
                                </div>
                            </div>

                            <!-- Paid pill -->
                            <div class="mt-2 flex justify-end">
                                <span :class="[
                                    'text-xs text-white rounded px-2 py-0.5',
                                    item.order?.paid ? 'bg-green-500' : 'bg-red-500'
                                ]">
                                    {{ item.order?.paid ? t('yes') : t('no') }}
                                </span>
                            </div>
                        </div>

                        <!-- Mobile totals card -->
                        <div class="rounded-lg border p-3 bg-gray-50">
                            <div class="flex justify-between text-sm">
                                <span>{{ t('total') }} {{ t('count').toLocaleLowerCase() }}</span>
                                <span class="font-semibold">{{ reportData.total_quantity || 0 }}</span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{{ t('price') }} Σ</span>
                                <span class="font-semibold">{{ useSummaFormat(reportData.total_amount) }}</span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{{ t('total') }} {{ t('price').toLocaleLowerCase() }}</span>
                                <span class="font-semibold">{{ useSummaFormat(reportData.total_summa) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- DESKTOP TABLE (md va katta) -->
                    <div class="hidden md:block">
                        <div class="overflow-x-auto">
                            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden border table-auto">
                                <thead>
                                    <tr class="bg-gray-200 text-left border">
                                        <th class="px-4 py-2 text-sm w-10">#</th>
                                        <th class="px-4 py-2 text-sm">{{ t('datetime') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('client_one') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('product') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('total') }} {{ t('count').toLocaleLowerCase()
                                            }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('price') }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('total') }} {{ t('price').toLocaleLowerCase()
                                            }}</th>
                                        <th class="px-4 py-2 text-sm">{{ t('status') }}</th>
                                        <th class="px-4 py-2 text-sm w-[120px]">{{ t('paid') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in rows" :key="item.id || index"
                                        class="border hover:bg-gray-50 cursor-pointer">
                                        <td class="px-4 py-2 border">{{ index + 1 }}</td>

                                        <td class="px-4 py-2 border">
                                            {{ dayJS(item.order?.datetime).format('DD.MM.YYYY HH:mm') }}
                                        </td>

                                        <!-- Client pretty cell (yoki oddiy matn xohlasangiz o‘zingiznikini qoldiring) -->
                                        <td class="px-4 py-2 border">
                                            <div class="flex items-start gap-3">
                                                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center
                       text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                                                    {{ (item.order?.client?.first_name?.[0] ||
                                                        item.order?.client?.mail?.[0] ||
                                                    '—').toUpperCase() }}
                                                </div>
                                                <div class="min-w-[220px]">
                                                    <div class="font-medium leading-tight">
                                                        {{
                                                            [item.order?.client?.first_name, item.order?.client?.last_name]
                                                                .filter(Boolean).join(' ')
                                                            || item.order?.client?.mail
                                                        || item.order?.client?.phone_number
                                                        || '—'
                                                        }}
                                                    </div>
                                                    <div
                                                        class="mt-0.5 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                                                        <a v-if="item.order?.client?.mail"
                                                            :href="`mailto:${item.order.client.mail}`"
                                                            class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200">
                                                            {{ item.order.client.mail }}
                                                        </a>
                                                        <a v-if="item.order?.client?.phone_number"
                                                            :href="`tel:${String(item.order.client.phone_number).replace(/[^\d+]/g, '')}`"
                                                            class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200">
                                                            {{ item.order.client.phone_number }}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td class="px-4 py-2 border">
                                            {{ item.product?.['title_' + locale] }}
                                        </td>

                                        <td class="px-4 py-2 text-right border">
                                            {{ item.quantity }}
                                        </td>

                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(item.price) }}
                                        </td>

                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat((Number(item.quantity) || 0) * (Number(item.price) || 0))
                                            }}
                                        </td>

                                        <td class="px-4 py-2 border">
                                            <template v-if="item.order?.status">
                                                <template v-if="findStatus(item.order.status)">
                                                    <div :class="[
                                                        'text-center', 'rounded', 'py-1',
                                                        findStatus(item.order.status).color
                                                    ]">
                                                        {{ findStatus(item.order.status)['label_' + locale] }}
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="text-center rounded py-1 bg-gray-200 text-gray-700">
                                                        {{ item.order.status }}
                                                    </div>
                                                </template>
                                            </template>
                                        </td>

                                        <td class="px-4 py-2 border">
                                            <div :class="[
                                                'text-center text-white', 'rounded', 'py-1 px-2',
                                                item.order?.paid ? 'bg-green-500' : 'bg-red-500'
                                            ]">
                                                {{ item.order?.paid ? t('yes') : t('no') }}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr v-if="!rows.length && !spinner">
                                        <td colspan="9" class="px-4 py-6 text-center text-slate-500">
                                            <n-empty />
                                        </td>
                                    </tr>

                                    <!-- Totals row -->
                                    <tr class="bg-gray-100">
                                        <!-- Birinchi 4 ustun (#, datetime, client, product) bo‘yicha label -->
                                        <td colspan="4" class="px-4 py-2 text-center font-semibold border">
                                            {{ t('total') }}
                                        </td>
                                        <!-- Jami quantity -->
                                        <td class="px-4 py-2 text-right border">
                                            {{ reportData.total_quantity || 0 }}
                                        </td>
                                        <!-- Unit price-lar yig‘indisi (agar backend total_amount bermasa ham shu) -->
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(reportData.total_amount) }}
                                        </td>
                                        <!-- Jami summa (qty*price) -->
                                        <td class="px-4 py-2 text-right border">
                                            {{ useSummaFormat(reportData.total_summa) }}
                                        </td>
                                        <!-- Status, Paid bo‘sh -->
                                        <td class="border"></td>
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
import { ref, onMounted, inject, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ExitIcon, EyeIcon } from "@/components/icons/icon";
import reportService from '../../services/report.service';
import productService from '@/services/product.service';
import orderService from '@/services/order.service';
import { useI18n } from 'vue-i18n';
import { useSummaFormat } from '@/composible/NumberFormat';
const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const dayJS = inject('dayJS')
const productOptions = ref([]);
const currentDate = new Date();
const beginDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let spinner = ref(false);
let showEmpty = ref(true);
const reportData = ref({
    data: [],
    total_quantity: 0,
    total_amount: 0,
    total_summa: 0
});
const rows = computed(() => reportData.value?.data || []);

const orderStatusOption = ref([]);
const paidOption = ref([
    {
        value: 'yes',
        label: t('yes')
    },
    {
        value: 'no',
        label: t('no')
    }
]);
const filterHeader = ref({
    range: [beginDate.getTime(), currentDate.getTime()],
    product_id: null,
    status: null,
    paid_action: null
});
const getOption = async () => {
    try {
        productOptions.value = await productService.all();
        orderStatusOption.value = await orderService.statusOption();
    } catch (e) {
        console.log(e)
    }
}
const findStatus = (status) => {
    return orderStatusOption.value.find(el => el.value === status);
};
const showQuery = () => {
    let el = route.query;
    if (Boolean(el?.action)) {
        filterHeader.value.product_id = el.product_id ? parseInt(el.product_id) : null;
        filterHeader.value.paid_action = el.paid_action;
        filterHeader.value.status = el.status;
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
    reportService.orderSverka(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (res.data && res.data.length > 0) {
            showEmpty.value = false;
        }
    });
};

</script>
