<template>
    <div class="report">
        <div class="report-data">
            <div class="report-data-header">
                <n-flex justify="space-between">
                    <h2>{{ t('sms service report') }}</h2>
                    <n-icon @click="router.go(-1)" style="cursor: pointer;" size="32" color="rgb(16, 22, 58)">
                        <ExitIcon />
                    </n-icon>
                </n-flex>
                <n-space>
                    <n-date-picker v-model:value="filterHeader.range" type="datetimerange" />
                   
                    <n-select v-model:value="filterHeader.user_id" :style="{ minWidth: '210px' }"
                        :options="selectOption.user" value-field="id" label-field="fullname"
                        :placeholder="t('admin_one')" filterable clearable>
                    </n-select>
                    <n-select v-model:value="filterHeader.sms_type" :style="{ minWidth: '310px' }"
                        :options="global.sms_type" :label-field="'label_' + locale"
                        :placeholder="t('sms service') + ' ' + t('type').toLocaleLowerCase()" filterable clearable>
                    </n-select>
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
                                    <th>{{ t('admin_one') }}</th>
                                    <th>{{ t('sms service') + ' ' + t('type').toLocaleLowerCase() }}</th>
                                    <th>{{ t('count') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in reportData.data" :key="index" class="report-table-row"
                                    @dblclick="tableRowClick(item)">
                                    <td style="width: 40px; text-align: center">{{ index + 1 }}</td>
                                    <td>
                                        <div style="cursor: pointer;">
                                            <n-tooltip placement="bottom-start" trigger="hover">
                                                <template #trigger>
                                                    {{ item.user?.fullname }}
                                                </template>
                                                {{ item.user?.fullname }}
                                                <n-divider :style="{ margin: '4px 0px' }"></n-divider>
                                                {{ usePhoneFormat(item.item.user?.phone) }}
                                            </n-tooltip>
                                        </div>
                                    </td>
                                    <td>{{ t(item.sms_type) }}</td>
                                    <td class="text-right">{{ item.count }}</td>

                                </tr>
                                <tr class="sticky-bottom-second">
                                    <th colspan="3" class="text-center">{{ t('total') }}</th>
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
import usersService from '@/services/users.service';
import { usePhoneFormat } from '@/composible/NumberFormat';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '@/stores/global';
const global = useGlobalStore();
const { t, locale } = useI18n()
const router = useRouter();
const currentDate = new Date();
const beginDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let spinner = ref(false);
let showEmpty = ref(true);
const reportData = ref([]);
const selectOption = ref({
    user: [],
})
const filterHeader = ref({
    range: [beginDate.getTime(), currentDate.getTime()],
    user_id: null,
})
const getAllOption = () => {
    usersService.all().then((res) => {
        selectOption.value.user = res;
    })
}

onMounted(() => {
    getAllOption()
})
const showReport = () => {
    spinner.value = true;
    reportService.smsServiceReport(filterHeader.value).then((res) => {
        reportData.value = res;
        spinner.value = false;
        if (!res?.data.length == 0) {
            showEmpty.value = false;
        }
    })
}
const tableRowClick = (row) => {
    router.push({
        path: '/sverka-sms',
        query: {
            user_id: row.user_id,
            range: filterHeader.value.range,
            action: true
        }
    })
}
</script>