<script setup>
import { ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import OrderService from "@/services/order.service";
import { useGlobalStore } from "@/stores/global";
import { useI18n } from "vue-i18n";
import { SaveIcon } from "@/components/icons/icon";
const { t } = useI18n();
const message = useMessage();
const globalStore = useGlobalStore();
const emit = defineEmits(["update", "close"]);
const props = defineProps({ id: Number });

const form_data = ref({
  status: "pending"
});

const loading = ref(false);

const getOrder = async () => {
  try {
    const res = await OrderService.getOne(props.id);
    form_data.value = {
      status: res.status
    };
  } catch (e) {
    message.error("Buyurtma topilmadi");
  }
};

const save = async () => {
  loading.value = true;
  try {
    await OrderService.updateStatus(props.id, { status: form_data.value.status });
    message.success("Status yangilandi");
    emit("update");
  } catch (e) {
    message.error("Xatolik: " + e.message);
  } finally {
    loading.value = false;
  }
};

onMounted(() => getOrder());
</script>

<template>
  <div class="space-y-4">
    <n-select v-model:value="form_data.status" :options="globalStore.orderStatus" placeholder="Holat tanlang" />
    <div class="flex justify-end">
      <n-button type="success" @click="save" :loading="loading">
          <template #icon>
              <n-icon>
                <SaveIcon />
              </n-icon>
          </template>
          {{ t('save') }}
      </n-button>
    </div>
  </div>
</template>
