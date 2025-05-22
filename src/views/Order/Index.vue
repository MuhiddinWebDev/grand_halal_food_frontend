<script setup>
import { ref, onMounted, inject } from "vue";
import { useMessage, NCard, NSelect, NButton, NIcon } from "naive-ui";
import { RefreshIcon, DeleteIcon } from '@/components/icons/icon';
import { useRouter } from "vue-router";
import OrderService from "@/services/order.service";
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

const getOrders = async () => {
  loading.value = true;
  try {
    orders.value = await OrderService.all();
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (id, status) => {
  try {
    await OrderService.updateStatus(id, { status });
    message.success("Status yangilandi");
  } catch (e) {
    message.error("Xatolik yuz berdi");
  }
};

onMounted(() => getOrders());
</script>

<template>
  <div class="space-y-4 p-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Buyurtmalar</h2>
      <n-button type="warning" @click="getOrders">
        <template #icon>
          <n-icon>
            <RefreshIcon />
          </n-icon>
        </template>
        {{ t('update') }}
      </n-button>
    </div>
    <div v-if="loading">Yuklanmoqda...</div>
    <div class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="order in orders" :key="order.id">
        <n-card :title="`${t('order')} #${order.id} ${order.client.first_name} ${order.client.last_name}`"
          size="medium">
          <template #header-extra>
            <n-select v-model:value="order.status" :options="globalStore.orderStatus" :label-field="`label_` + locale"
              size="small" @update:value="val => updateStatus(order.id, val)" />
          </template>
          <p><strong>{{ t('datetime') }}:</strong> {{ dayJS(order.datetime).format('YYYY-MM-DD HH:mm:ss') }}</p>
          <p><strong>{{ t('phone') }}:</strong> <a :href="'tel:' + order.client.phone_number" class="text-blue-500">{{
            order.client.phone_number }}</a></p>
          <p><strong>{{ t('additional phone number') }}:</strong> <a :href="'tel:' + order.phone2"
              class="text-blue-500">{{
                order.phone2 }}</a></p>
          <p><strong>{{ t('address') }}:</strong> {{ order.address }}</p>
          <p>
            <strong>{{ t('location') }}:</strong>
            <a class="text-blue-500" href="https://www.google.com/maps?q={{order.lat}},{{order.lon}}" target="_blank"
              style="text-decoration: none;">
              📍 Google Map
            </a>
          </p>
          <div class="mt-2 space-y-1">
            <h2 class="font-semibold text-lg text-bold-700">{{ t('products') }}:</h2>
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
                  <td class="text-right">{{ item.quantity }}</td>
                  <td class="text-right">{{ useSummaFormat(item.price) }}</td>
                  <td class="text-right">{{ useSummaFormat(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
            </n-table>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <n-button size="small" type="info" @click="router.push(`/orders/${order.id}`)">
              Batafsil
            </n-button>
            <n-button size="small" type="error" @click="OrderService.delete(order.id).then(getOrders)">
              <template #icon><n-icon>
                  <DeleteIcon />
                </n-icon></template>
              O'chirish
            </n-button>
          </div>
        </n-card>
      </div>
    </div>
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
