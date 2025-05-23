<script setup>
import { ref, onMounted, inject, watch } from "vue";
import { useMessage, NCard, NSelect, NButton, NIcon } from "naive-ui";
import { RefreshIcon, DeleteIcon } from '@/components/icons/icon';
import { useRouter } from "vue-router";
import ModelService from "@/services/order.service";
import clientsService from "@/services/clients.service";
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "@/stores/global";
import { useSummaFormat } from "@/composible/NumberFormat";

const { t, locale } = useI18n();
const globalStore = useGlobalStore();
const router = useRouter();
const message = useMessage();
const orders = ref([]);
const loading = ref(false);
const dayJS = inject('dayJS')
const fileUrl = inject("fileUrl");
const activeTab = ref('pending');
const clientOption = ref([]);
const filterHeader = ref({
  range: [
    dayJS().subtract(6, 'day').startOf('day').valueOf(),
    dayJS().endOf('day').valueOf()
  ],
  status: "pending",
});

const getOrders = async () => {
  loading.value = true;
  try {
    orders.value = await ModelService.all(filterHeader.value);
  } finally {
    loading.value = false;
  }
};
const getAllClients = async () => {
  try {
    clientOption.value = await clientsService.all();
  } catch (e) {

  }
}
const updateStatus = async (id, status) => {
  try {
    await ModelService.updateStatus(id, { status });
    message.success(t('updated status'));
    getOrders();
  } catch (e) {
    message.error("Xatolik yuz berdi");
  }
};
const updateTabs = (label) => {
  let status = globalStore.orderStatus.find((item) => item['label_' + locale.value] == label);
  filterHeader.value.status = status.value;
  activeTab.value = label;
  getOrders();
}
onMounted(() => {
  getAllClients();
  getOrders()
});
watch(
  () => locale.value,
  (newLocale) => {
    // Locale o‘zgarganda birinchi tabni tanlash
    if (globalStore.orderStatus.length > 0) {
      activeTab.value = globalStore.orderStatus[0]['label_' + newLocale];
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="space-y-2 p-2">
    <div class="flex justify-between flex-wrap items-center gap-2">
      <div class="flex gap-2 items-center flex-wrap">
        <h2 class="text-2xl font-bold">Buyurtmalar</h2>
        <n-date-picker style="min-width: 300px" v-model:value="filterHeader.range" type="daterange"
          @update:value="getOrders">
        </n-date-picker>
        <div>
          <n-select :options="clientOption" v-model:value="filterHeader.client_id" @update:value="getOrders"
            :placeholder="t('client_one')" filterable clearable label-field="fullname" value-field="id">
          </n-select>
        </div>
      </div>
      <n-button type="warning" @click="getOrders">
        <template #icon>
          <n-icon>
            <RefreshIcon />
          </n-icon>
        </template>
        {{ t('update') }}
      </n-button>
    </div>
    <n-tabs type="line" animated v-model:value="activeTab" @update:value="updateTabs">
      <n-tab-pane v-for="status in globalStore.orderStatus" :key="status.value" :name="status['label_' + locale]"
        :tab="status['label_' + locale]">
        <div class="grid gap-2 
                grid-cols-[repeat(auto-fill,minmax(320px,1fr))] 
                md:grid-cols-[repeat(auto-fill,minmax(620px,1fr))]">
          <div v-for="order in orders" :key="order.id">
            <n-card :title="`${t('order')} #${order.id} ${order.client.first_name} ${order.client.last_name}`"
              size="medium">
              <template #header-extra>
                <n-select style="min-width: 180px;" v-model:value="order.status" :options="globalStore.orderStatus"
                  :label-field="`label_` + locale" size="small" @update:value="val => updateStatus(order.id, val)" />
              </template>
              <p><strong>{{ t('datetime') }}:</strong> {{ dayJS(order.datetime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              <p><strong>{{ t('phone') }}:</strong>
                <a :href="'tel:' + order.client.phone_number" class="text-blue-500">
                  {{ order.client.phone_number }}
                </a>
              </p>
              <p><strong>{{ t('additional phone number') }}:</strong>
                <a :href="'tel:' + order.phone2" class="text-blue-500">
                  {{ order.phone2 }}
                </a>
              </p>
              <p><strong>{{ t('address') }}:</strong> {{ order.address }}</p>
              <p>
                <strong>{{ t('location') }}:</strong>
                <a class="text-blue-500" :href="`https://www.google.com/maps?q=${order.lat},${order.lon}`"
                  target="_blank" style="text-decoration: none;">
                  📍 Google Map
                </a>
              </p>
              <p><strong>{{ t('comment') }}:</strong> {{ order.comment }}</p>
              <p><strong>{{ t('pay_type') }}:</strong> {{ order.payment_type }}</p>
              <p><strong>{{ t('total') + ' ' + t('summa').toLocaleLowerCase() }}:</strong> {{
                useSummaFormat(order.total_price)
              }}</p>
              <p><strong>{{ t('delivery_summa') }}:</strong> {{ useSummaFormat(order.delivery_summa) }}</p>
              <div class="flex gap-2">
                <strong>{{ t('payment image') }}:</strong>
                <n-image v-if="order.payment_image" width="100" :src="fileUrl + order.payment_image"></n-image>
                <span v-else>{{ t('image not found') }}</span>
              </div>
              <div class="mt-2 space-y-1">
                <h2 class="font-semibold text-lg text-bold-700">{{ t('products') }}:</h2>
                <n-scrollbar style="max-height: 300px; max-width: 800px;" x-scrollable>
                  <n-table size="small" :bordered="true" :single-line="false">
                    <thead>
                      <tr>
                        <th style="width: 50px;text-align: center;">№</th>
                        <th>{{ t('product') }}</th>
                        <th>{{ t('quantity') }}</th>
                        <th>{{ t('price') }}</th>
                        <th>{{ t('total') + ' ' + t('summa') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in order.items" :key="item.id">
                        <td style="width: 50px;text-align: center;">{{ index + 1 }}</td>
                        <td>{{ item.product?.['title_' + locale] }}</td>
                        <td class="text-right">{{ item.quantity }} {{ t(item.product?.unit) }}</td>
                        <td class="text-right">{{ useSummaFormat(item.price) }}</td>
                        <td class="text-right">{{ useSummaFormat(item.price * item.quantity) }}</td>
                      </tr>
                    </tbody>
                  </n-table>
                </n-scrollbar>
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <n-button size="small" type="error" @click="ModelService.delete(order.id).then(getOrders)">
                  <template #icon><n-icon>
                      <DeleteIcon />
                    </n-icon></template>
                  {{ t('delete') }}
                </n-button>
              </div>
            </n-card>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
    <div v-if="!loading && orders.length === 0"
      class="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-2xl border border-dashed border-gray-300 shadow-sm">
      <!-- Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18M3 7h18M5 11h14M7 15h10M9 19h6" />
      </svg>

      <!-- Text -->
      <p class="text-gray-600 text-lg font-medium">{{ t('order not available') }}</p>
    </div>

  </div>
</template>
