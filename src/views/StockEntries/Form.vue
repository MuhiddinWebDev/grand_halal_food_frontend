<template>
  <n-form ref="formRef" :model="form_data">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <p class="text-xl font-semibold">{{ t('prixod') }}</p>
        <div class="flex gap-2">
          <n-button @click="save" type="success" :disabled="spinner">
            <template #icon><n-icon>
                <SaveIcon />
              </n-icon></template>
            {{ t('save') }}
          </n-button>
          <n-button @click="exitBtn" type="warning">
            <template #icon><n-icon>
                <ExitIcon />
              </n-icon></template>
            {{ t('exit') }}
          </n-button>
        </div>
      </div>

      <!-- Form Inputs -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <n-form-item :label="t('datetime')">
          <n-date-picker :value="form_data.datetime" :disabled="true" />
        </n-form-item>
        <n-form-item :label="t('comment')">
          <n-input v-model:value="form_data.comment" clearable />
        </n-form-item>
        <n-form-item>
          <n-button type="success" @click="addProduct">
            <template #icon><n-icon>
                <AddIcon />
              </n-icon></template>
            {{ t('product') + ' ' + t('add').toLocaleLowerCase() }}
          </n-button>
        </n-form-item>
      </div>

      <!-- Table -->
      <n-table :bordered="true" size="small">
        <thead>
          <tr>
            <th>#</th>
            <th>{{ t('product') }}</th>
            <th>{{ t('price') }}</th>
            <th>{{ t('quantity') }}</th>
            <th>{{ t('total') }}</th>
            <th>{{ t('action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form_data.entries" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <n-select style="width: 200px;" :options="productOption" :label-field="'title_' + locale" value-field="id"
                v-model:value="item.product_id" @update:value="chooseProduct($event, index)" />
            </td>
            <td>{{ useFormatnumber(item.price) }}</td>
            <td>
              <n-input-number v-model:value="item.quantity" :min="1" @update:value="val => onQuantityChange(index)" />
            </td>
            <td>{{ useFormatnumber(item.total) }}</td>
            <td>
              <n-button size="small" type="error" @click="removeItem(index)">
                <template #icon><n-icon>
                    <DeleteIcon />
                  </n-icon></template>
              </n-button>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-spin>
  </n-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import StockEntryService from "@/services/stock_entries.service";
import productService from "@/services/product.service";
import { AddIcon, ExitIcon, SaveIcon, DeleteIcon } from "@/components/icons/icon";
import { useFormatnumber } from "@/composible/NumberFormat";
import { useMessage } from "naive-ui";

const { t, locale } = useI18n();
const emit = defineEmits(["create", "close"]);
const message = useMessage();
const formRef = ref(null);
const spinner = ref(false);

const productOption = ref([]);
const form_data = ref({
  comment: "",
  datetime: new Date().getTime(),
  entries: []
});

// Mahsulotlar yuklash
const getAllProducts = async () => {
  try {
    const res = await productService.all();
    productOption.value = res;
  } catch (error) {
    console.error("Product load error:", error);
  }
};

onMounted(getAllProducts);

// Qo‘shish, o‘chirish
const addProduct = () =>
  form_data.value.entries.push({ product_id: null, price: 0, quantity: 1, total: 0 });

const removeItem = (index) => form_data.value.entries.splice(index, 1);

const onQuantityChange = (index) => {
  const item = form_data.value.entries[index];
  item.total = (item.price || 0) * (item.quantity || 0);
};

const chooseProduct = (product_id, index) => {
  const product = productOption.value.find((p) => p.id === product_id);
  if (product) {
    const row = form_data.value.entries[index];
    row.price = product.price;
    row.total = product.price * (row.quantity || 0);
  }
};

// Save qilish
const save = async () => {
  try {
    spinner.value = true;
    if (form_data.value.entries.length === 0) return message.warning("Mahsulot tanlanmagan");

    const payload = form_data.value.entries.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      type: "in",
      note: form_data.value.comment
    }));

    for (const entry of payload) {
      await StockEntryService.create(entry); // APIga birma-bir yuboriladi
    }

    message.success("Saqlash muvaffaqiyatli");
    emit("create", payload);
  } catch (error) {
    console.error("Saqlashda xatolik", error);
    message.error("Saqlashda xatolik");
  } finally {
    spinner.value = false;
  }
};

const exitBtn = () => emit("close");

watch(
  () => form_data.value.entries,
  () => {
    form_data.value.entries.forEach((item) => {
      item.total = item.price * item.quantity;
    });
  }
);
</script>
