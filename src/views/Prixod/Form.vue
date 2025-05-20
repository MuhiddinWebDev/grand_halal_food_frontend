<template>
  <n-form ref="formRef" :model="form_data" :rules="rules">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <p class="text-xl font-semibold">
          {{ t('prixod') }}
        </p>
        <div class="flex gap-2">
          <n-button @click="save" type="success" :disabled="spinner" class="min-w-[120px]">
            <template #icon>
              <n-icon>
                <SaveIcon />
              </n-icon>
            </template>
            {{ t('save') }} <span class="text-xs ml-1">Enter</span>
          </n-button>
          <n-button @click="exitBtn" type="warning" class="min-w-[120px]">
            <template #icon>
              <n-icon>
                <ExitIcon />
              </n-icon>
            </template>
            {{ t('exit') }} <span class="text-xs ml-1">Esc</span>
          </n-button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <n-form-item :label="t('datetime')" path="datetime">
          <n-date-picker :style="{ width: '100%' }" v-model:value="form_data.datetime" :disabled="true" />
        </n-form-item>
        <n-form-item :label="t('comment')" path="comment">
          <n-input @keydown="keySave" v-model:value="form_data.comment" show-count clearable />
        </n-form-item>
        <n-form-item>
          <n-button type="success" @click="addProduct">
            <template #icon>
              <n-icon>
                <AddIcon />
              </n-icon>
            </template>
            Qo'shish
          </n-button>
        </n-form-item>
      </div>
      <n-table :bordered="true" :single-line="false" size="small">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">№</th>
            <th>{{ t('product') }}</th>
            <th>{{ t('price') }}</th>
            <th>{{ t('quantity') }}</th>
            <th>{{ t('total') }}</th>
            <th>{{ t('action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form_data.prixod_table" :key="index">
            <td style="width: 40px; text-align: center;">{{ index + 1 }}</td>
            <td>
              <n-select style="width: 300px;" :options="productOption" fitlerable clearable
                v-model:value="item.product_id" @update:value="chooseProduct($event, index)"
                :label-field="'title_' + locale" value-field="id" />
            </td>
            <td>{{ useFormatnumber(item.price) }}</td>
            <td style="width: 180px;">
              <n-input-number :style="{ width: '100%' }"
                @update:value="val => { item.quantity = val; onQuantityChange(index); }" v-model:value="item.quantity"
                :min="1" :step="10" />
            </td>
            <td>{{ useFormatnumber(item.total) }}</td>
            <td style="width: 60px; text-align: center ;">
              <n-button type="error" size="small" @click="removeItem(index)">
                <template #icon>
                  <n-icon>
                    <DeleteIcon />
                  </n-icon>
                </template>
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
import ModelService from "@/services/prixod.service";
import productService from "@/services/product.service";
import { AddIcon, ExitIcon, SaveIcon, DeleteIcon } from "@/components/icons/icon";
import { useFormatnumber, useParsenumber } from "@/composible/NumberFormat";
import { useMessage } from "naive-ui";
const { t, locale } = useI18n();
const props = defineProps({
  type: String,
  id: [String, Number]
});
const message = useMessage();
const emit = defineEmits(["create", "update", "close"]);

const formRef = ref(null);
const spinner = ref(false);
const inputInstRef = ref(null);
const productOption = ref([]);
const form_data = ref({
  comment: "",
  datetime: new Date().getTime(),
  prixod_table: []
});


const rules = {

};

const getAllProducts = async () => {
  try {
    const res = await productService.all();
    productOption.value = res;
  } catch (error) {
    console.error("Ma'lumot yuklashda xatolik:", error);
  }
}

onMounted(async () => {
  await getAllProducts();
  if (props.type === "update" && props.id) {
    try {
      const res = await ModelService.getOne(props.id);
      form_data.value = res;
    } catch (error) {
      console.error("Ma'lumot yuklashda xatolik:", error);
    }
  }
  setTimeout(() => {
    inputInstRef.value?.focus();
  }, 100);
});


// Save action
const save = async () => {
  try {
    await formRef.value?.validate();
    spinner.value = true;
    if (form_data.value.prixod_table.length == 0) return message.warning("Prixod table bo'sh");
    if (props.type === "create") {
      const res = await ModelService.create(form_data.value);
      emit("create", res);
    } else if (props.type === "update") {
      const res = await ModelService.update(props.id, form_data.value);
      emit("update", res);
    }
  } catch (e) {
    console.warn("Form not valid or failed", e);
  } finally {
    spinner.value = false;
  }
};

const exitBtn = () => emit("close");

// Klaviaturada Enter bosilsa saqlash
const keySave = (e) => {
  if (e.code === "Enter") save();
};

const addProduct = () => form_data.value.prixod_table.push({
  product_id: null,
  price: 0,
  quantity: 1,
  total: 0
});
const onQuantityChange = (index) => {
  const item = form_data.value.prixod_table[index];
  item.total = (item.price || 0) * (item.quantity || 0);
};

const removeItem = (index) => form_data.value.prixod_table.splice(index, 1);

const chooseProduct = async (product_id, index) => {
  try {
    const product = productOption.value.find(item => item.id == product_id);
    if (!product) return;
    const row = form_data.value.prixod_table[index];
    row.price = product.price;
    row.total = product.price * (row.quantity || 0);
  } catch (error) {
    console.error("Ma'lumot yuklashda xatolik:", error);
  }
};

watch(
  () => form_data.value.prixod_table,
  () => {
    form_data.value.prixod_table.forEach((item, index) => {
      item.total = item.price * item.quantity;
    });
  }
);
</script>
