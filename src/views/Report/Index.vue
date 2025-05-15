<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n"
const { t } = useI18n();
const router = useRouter();
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
        r_path: '/report-chiqim',
        s_path: '/sverka-chiqim',
    },
    {
        title: t('sklad'),
        report: t('sklad report'),
        sverka: t('sklad sverka'),
        r_path: '/report-sklad',
        s_path: '/sverka-sklad',
    },
    {
        title: t('order'),
        report: t('order report'),
        sverka: t('order sverka'),
        r_path: '/report-order',
        s_path: '/sverka-order',
    },
    {
        title: t('service'),
        report: t('service report'),
        sverka: t('service sverka'),
        r_path: '/report-service',
        s_path: '/sverka-service',
    },
    {
        title: t('refund'),
        report: t('refund report'),
        sverka: t('refund sverka'),
        r_path: '/report-refund',
        s_path: '/sverka-refund',
    },
    {
        title: t('sms service'),
        report: t('sms service report'),
        sverka: t('sms service sverka'),
        r_path: '/report-sms',
        s_path: '/sverka-sms',
    },
    {
        title: t('client battery'),
        report: t('client battery report'),
        sverka: t('client battery sverka'),
        r_path: '/report-client-battery',
        s_path: '/sverka-client-battery',
    },
    {
        title: t('client engagement'),
        report: t('client engagement report'),
        sverka: t('client engagement sverka'),
        r_path: '/report-client-login',
        s_path: '/sverka-client-login',
    },
    {
        title: t('serial number'),
        report: t('serial number report'),
        r_path: '/report-serial-number',
    },
]);
const nextToReport = (path) => {
    router.push({ path: path })
}
</script>
<template>
    <div class="report">
        <n-grid cols="2 s:2 m:3 l:4 xl:4" responsive="screen" :x-gap="8" :y-gap="8">
            <n-grid-item v-for="(item, index) in report_table " :key="index">
                <div class="report-box">
                    <div class="report-box_title">
                        <h2>{{ item.title }}</h2>
                    </div>
                    <n-divider :style="{ margin: '4px 0px' }"></n-divider>
                    <div class="report-box_content">
                        <div class="report-box_item" @click="nextToReport(item.r_path)">
                            <h3>{{ item.report }}</h3>
                        </div>
                        <div v-if="item.sverka" class="report-box_item" @click="nextToReport(item.s_path)">
                            <h3>{{ item.sverka }}</h3>
                        </div>
                    </div>
                </div>
            </n-grid-item>
        </n-grid>
    </div>
</template>