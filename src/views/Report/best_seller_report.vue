<template>
    <div class="p-4">
        <div class="bg-white rounded-lg shadow-md">
            <div class="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                <h2 class="text-xl font-bold">{{ t('most sold report') }}</h2>
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
                    <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden border">
                        <thead>
                            <tr class="bg-gray-200 text-left border">
                                <th class="px-4 py-2 text-sm w-10">#</th>
                                <th class="px-4 py-2 text-sm">{{ t('product') }}</th>
                                <th class="px-4 py-2 text-sm"> {{ t('total') }} {{ t('count').toLocaleLowerCase() }}
                                </th>
                                <th class="px-4 py-2 text-sm">{{ t('total') }} {{ t('price').toLocaleLowerCase() }}</th>
                                <th class="px-4 py-2 text-sm">{{ t('status') }}</th>
                                <th class="px-4 py-2 text-sm w-[120px]">{{ t('paid') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in reportData.data" :key="index"
                                class="border hover:bg-gray-50 cursor-pointer" @dblclick="tableRowClick(item)">
                                <td class="px-4 py-2 border">{{ index + 1 }}</td>
                                <td class="px-4 py-2 border">{{ item.product?.['title_' + locale] }}</td>
                                <td class="px-4 py-2 text-right border">{{ item.total_quantity }}</td>
                                <td class="px-4 py-2 text-right border">{{ useSummaFormat(item.total_amount) }}</td>
                                <td class="px-4 py-2 border">
                                    <div
                                        :class="['text-center', 'rounded', 'py-1', orderStatusOption.find(el => el.value === item.status).color]">
                                        <p>
                                            {{orderStatusOption.find(el => el.value === item.status)['label_' + locale]
                                            }}
                                        </p>
                                    </div>
                                </td>
                                <td class="px-4 py-2 border">
                                    <div
                                        :class="['text-center text-white', 'rounded', 'py-1 px-2', item.paid_action ? 'bg-green-500' : 'bg-red-500']">
                                        <p>
                                            {{ item.paid_action ? t('yes') : t('no') }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr class="bg-gray-100">
                                <td colspan="2" class="px-4 py-2 text-center font-semibold border">{{ t('total') }}
                                </td>
                                <td class="px-4 py-2 text-right border">{{ reportData.total_quantity || 0 }}</td>
                                <td class="px-4 py-2 text-right border">
                                    {{ useSummaFormat(reportData.total_amount) }}
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>

                    </table>
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
import orderService from '@/services/order.service';
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
    total_quantity: 0,
    total_amount: 0
});
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
        console.log(orderStatusOption.value)
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
    reportService.orderReport(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (res.data && res.data.length > 0) {
            console.log("Enter ")
            showEmpty.value = false;
        }
    });
};

const tableRowClick = (row) => {
    router.push({
        path: '/sverka-orders',
        query: {
            range: filterHeader.value.range,
            product_id: row.product_id,
            type: row.type,
            action: true
        },
    });
};
</script>
