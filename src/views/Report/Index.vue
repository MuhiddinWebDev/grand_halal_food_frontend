<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from 'naive-ui';
import { ReportIcon, SverkaIcon } from '@/components/icons/icon';
import { useI18n } from "vue-i18n"
const { t } = useI18n();
const router = useRouter();
const notification = useNotification();
const report_table = computed(() => [
    {
        title: t('prixod'),
        report: t('prixod report'),
        sverka: t('prixod sverka'),
        r_path: '/report-kirim',
        s_path: '/sverka-kirim',
    },
      {
        title: t('rasxod'),
        report: t('rasxod report'),
        sverka: t('rasxod sverka'),
        r_path: '/report-kirim',
        s_path: '/sverka-kirim',
    },
    {
        title: t('warehouse stock'),
        report: t('stock report'),
        sverka: t('warehouse sverka'),
        r_path: '/report-warehouse',
        r_path: '/sverka-warehouse',
    },
    {
        title: t('orders'),
        report: t('order report'),
        sverka: t('order sverka'),
        r_path: '/report-orders',
        r_path: '/sverka-orders',
    },
    {
        title: t('most sold products'),
        report: t('most sold report'),
        sverka: t('most sold sverka'),
        r_path: '/report-most-sold',
        r_path: '/sverka-most-sold',
    },
    {
        title: t('most profitable products'),
        report: t('most profitable report'),
        sverka: t('most profitable sverka'),
        r_path: '/report-most-profit',
        r_path: '/sverka-most-profit',
    },
    
]);

const nextToReport = (path) => {
    notification.warning({
        title: "Ogohlantirish",
        content: "Texnik ishlar olib borilmoqda",
        keepAliveOnHover: true,
        duration: 1000
    })
    // router.push({ path: path })
}
</script>
<template>
    <div class="p-2 sm:p-4">
        <n-grid cols="1 s:2 m:2 l:3 xl:4" responsive="screen" :x-gap="8" :y-gap="8">
            <n-grid-item v-for="(item, index) in report_table" :key="index">
                <div
                    class=" rounded-xl p-4 bg-[#E7F4EC] dark:bg-[#103D26] shadow hover:shadow-lg transition-all cursor-pointer">
                    <div class="mb-2">
                        <h2 class="text-lg font-bold text-center text-[#115D33] dark:text-white">
                            {{ item.title }}
                        </h2>
                    </div>
                    <n-divider :style="{ margin: '4px 0px' }"></n-divider>
                    <div class="space-y-2 mt-2">
                        <div class=" bg-[#C7EAD5] dark:bg-[#115D33] p-2 rounded hover:bg-[#A8DFC1]"
                            @click="nextToReport(item.r_path)">
                            <div class="flex items-center gap-2">
                                <n-icon size="22" color="#fff">
                                    <ReportIcon/>
                                </n-icon>
                                <h3 class="font-semibold text-[#115D33] dark:text-white">
                                    {{ item.report }}
                                </h3>
                            </div>
                        </div>
                        <div v-if="item.sverka" class="bg-[#B2E5C9] dark:bg-[#0F4A2A] p-2 rounded hover:bg-[#92D9B3]"
                            @click="nextToReport(item.s_path)">
                            <div class="flex items-center gap-2">
                                <n-icon size="22" color="#fff">
                                    <sverka-icon/>
                                </n-icon>
                                <h3 class="font-semibold text-[#115D33] dark:text-white">
                                    {{ item.sverka }}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </n-grid-item>
        </n-grid>
    </div>

</template>