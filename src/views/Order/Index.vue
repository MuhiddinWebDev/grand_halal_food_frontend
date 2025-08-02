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
const activeTab = ref('waiting');
const clientOption = ref([]);
const statusOption = ref([]);
const bigStatusOption = ref({});
const filterHeader = ref({
  range: [
    dayJS().subtract(6, 'day').startOf('day').valueOf(),
    dayJS().endOf('day').valueOf()
  ],
  status: "waiting",
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
    const response = await clientsService.all();
    clientOption.value = response.map(client => {
      // Har bir maydonni tekshirish va kerakli qiymatni olish
      const name = client.fullname ? client.fullname.trim() : '';
      const phone = client.phone_number ? client.phone_number.trim() : '';
      const email = client.mail ? client.mail.trim() : '';

      // Mavjud bo'lsa, label yaratish
      const labelParts = [];
      if (name) labelParts.push(name);
      if (phone) labelParts.push(`📞 ${phone}`);
      if (email) labelParts.push(`✉️ ${email}`);

      const label = labelParts.length > 0 ? labelParts.join(' | ') : '';

      return {
        ...client,
        label
      };
    });
  } catch (e) {
    console.error("Client fetch error:", e);
  }
};

const getAllStatusOption = async () => {
  try {
    let data = await ModelService.statusOption();
    bigStatusOption.value = data;
    statusOption.value = data[locale.value];

    // activeTab ni birinchi elementga sozlash
    if (statusOption.value?.length > 0) {
      activeTab.value = statusOption.value[0].label;
      updateTabs(activeTab.value);
    }
  } catch (e) {
    console.error(e);
  }
};

const updateStatus = async (id, status) => {
  try {
    await ModelService.updateStatus(id, { status });
    message.success(t('updated status'));
    getOrders();
  } catch (e) {
    message.error("Xatolik yuz berdi");
  }
};

const updatePaid = async (id) => {
  try {
    await ModelService.updatePaid(id);
    getOrders();
  } catch (e) {
    message.error("Xatolik yuz berdi");
  }
}
const updateTabs = (label) => {
  let status = statusOption.value.find((item) => item.label == label);
  filterHeader.value.status = status.value;
  activeTab.value = label;
  getOrders();
}
const deleteOrders = (order_id) => {
  console.log(order_id)
  ModelService.delete(order_id).then(res => {
    console.log(res)
    getOrders()
  })
}
onMounted(() => {
  getAllClients();
  getOrders();
  getAllStatusOption();
});

watch(
  () => locale.value,
  (newLocale) => {
    statusOption.value = bigStatusOption.value[newLocale];
  },
  { immediate: true }
);

</script>

<template>
  <div class="space-y-2 p-2">
    <div class="flex justify-between flex-wrap items-center gap-2">
      <div class="flex gap-2 items-center flex-wrap">
        <h2 class="text-2xl font-bold">{{ t('orders') }}</h2>
        <n-date-picker style="min-width: 300px" v-model:value="filterHeader.range" type="daterange"
          @update:value="getOrders">
        </n-date-picker>
        <div>
          <n-select :options="clientOption" v-model:value="filterHeader.client_id" @update:value="getOrders"
            placeholder="Mijozni tanlang" filterable clearable label-field="label" 
            value-field="id"
            />

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
      <n-tab-pane v-for="(status, index) in statusOption" :key="index" :name="status.label" :tab="status.label">
        <div class="grid gap-2 
                grid-cols-[repeat(auto-fill,minmax(320px,1fr))] 
                md:grid-cols-[repeat(auto-fill,minmax(620px,1fr))]">
          <div v-for="(order, index) in orders" :key="order.id"
            class="rounded-xl border-2 p-4 mb-6 transition-all duration-200 shadow-sm hover:shadow-md"
            :class="order.paid ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50 hover:bg-red-100'">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-lg font-semibold text-gray-800">
                {{ t('order') }} #{{ index + 1 }} {{ order.client?.first_name || '' }} {{ order.client?.last_name || ''
                }}
              </h2>
              <n-select style="max-width: 200px;" v-model:value="order.status" :options="statusOption"
                label-field="label" size="small" @update:value="val => updateStatus(order.id, val)" />
            </div>

            <div class="text-sm space-y-1 text-gray-700">
              <p><strong>{{ t('datetime') }}:</strong> {{ dayJS(order.datetime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              <p>
                <strong>{{ t('phone') }}:</strong>
                <a :href="'tel:' + order.client?.phone_number" class="text-blue-500 underline">
                  {{ order.client?.phone_number }}
                </a>
              </p>
              <p>
                <strong>{{ t('additional phone number') }}:</strong>
                <a :href="'tel:' + order.phone2" class="text-blue-500 underline">
                  {{ order.phone2 }}
                </a>
              </p>
              <p><strong>{{ t('address') }}:</strong> {{ order.address }}</p>
              <p>
                <strong>{{ t('location') }}:</strong>
                <a class="text-blue-500 underline" :href="`https://www.google.com/maps?q=${order.lat},${order.lon}`"
                  target="_blank">
                  📍 Google Map
                </a>
              </p>
              <p><strong>{{ t('comment') }}:</strong> {{ order.comment }}</p>
              <p><strong>{{ t('pay_type') }}:</strong> {{ order.payment_type }}</p>
              <p><strong>{{ t('total') }} {{ t('summa').toLowerCase() }}:</strong> {{ useSummaFormat(order.total_price)
              }}
              </p>
              <p><strong>{{ t('delivery_summa') }}:</strong> {{ useSummaFormat(order.delivery_summa) }}</p>

              <div class="flex items-center gap-2">
                <strong>{{ t('payment image') }}:</strong>
                <n-image v-if="order.payment_image" width="100" :src="fileUrl + order.payment_image" />
                <span v-else class="text-gray-400 italic">{{ t('image not found') }}</span>
              </div>

              <!-- Paid / Unpaid holatini ko'rsatish -->
              <div class="flex items-center gap-3 mt-2">
                <strong class="text-sm">{{ t('payment') }}:</strong>
                <n-switch :value="order.paid" @update:value="val => updatePaid(order.id)">
                  <template #checked>{{ t('paid') }}</template>
                  <template #unchecked>{{ t('unpaid') }}</template>
                </n-switch>
              </div>
            </div>

            <!-- Mahsulotlar jadvali -->
            <div class="mt-4 space-y-1">
              <h3 class="font-semibold text-base">{{ t('products') }}:</h3>
              <n-scrollbar style="max-height: 300px; max-width: 100%;">
                <table class="min-w-full text-sm border border-gray-200 rounded overflow-hidden">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="p-2 text-center w-10">№</th>
                      <th class="p-2 text-left">{{ t('product') }}</th>
                      <th class="p-2 text-right">{{ t('quantity') }}</th>
                      <th class="p-2 text-right">{{ t('price') }}</th>
                      <th class="p-2 text-right">{{ t('total') }} {{ t('summa') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in order.products" :key="item.id" class="hover:bg-gray-50">
                      <td class="p-2 text-center">{{ idx + 1 }}</td>
                      <td class="p-2">{{ item.product?.['title_' + locale] }}</td>
                      <td class="p-2 text-right">{{ item.quantity }} {{ t(item.product?.unit) }}</td>
                      <td class="p-2 text-right">{{ useSummaFormat(item.price) }}</td>
                      <td class="p-2 text-right">{{ useSummaFormat(item.price * item.quantity) }}</td>
                    </tr>
                  </tbody>
                </table>
              </n-scrollbar>
            </div>

            <!-- Delete tugmasi -->
            <div class="flex justify-end mt-4">
              <n-button size="small" type="error" @click="deleteOrders(order.id)">
                <template #icon>
                  <n-icon>
                    <DeleteIcon />
                  </n-icon>
                </template>
                {{ t('delete') }}
              </n-button>
            </div>
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
