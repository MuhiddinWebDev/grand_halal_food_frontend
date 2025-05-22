<script setup>
import { ref, onMounted, h } from "vue";
import { useMessage, NCard, NSelect, NButton, NIcon } from "naive-ui";
import { RefreshIcon, DeleteIcon } from '@/components/icons/icon';
import { useRouter } from "vue-router";
import OrderService from "@/services/order.service";
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "@/stores/global";
const { t, locale } = useI18n();
const globalStore = useGlobalStore();
const router = useRouter();
const message = useMessage();
const orders = ref([]);
const loading = ref(false);

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
    <div v-for="order in orders" :key="order.id">
      <n-card :title="`${order.client.first_name} ${order.client.last_name}`" size="medium">
        <template #header-extra>
          <n-select v-model:value="order.status" :options="globalStore.orderStatus" :label-field="`label_` + locale"
            size="small" @update:value="val => updateStatus(order.id, val)" />
        </template>

        <p><strong>{{ t('phone') }}:</strong> {{ order.client.phone_number }}</p>
        <p><strong>{{ t('address') }}:</strong> {{ order.address }}</p>
        <p><strong>Joylashuv:</strong> {{ order.lat }}, {{ order.long }}</p>
        <p><strong>Vaqti:</strong> {{ new Date(order.createdAt).toLocaleString() }}</p>

        <div class="mt-2 space-y-1">
          <h4 class="font-semibold">Mahsulotlar:</h4>
          <ul>
            <li v-for="item in order.items" :key="item.id">
              {{ item.product.name }} - {{ item.quantity }} x {{ item.price }} so'm
            </li>
          </ul>
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
</template>
