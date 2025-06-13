<template>
  <n-form ref="formRef" :model="{}" :rules="{}">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-xl font-semibold">{{ t('products') }} {{ t('add').toLowerCase() }}</p>
        <n-button type="primary" @click="addProductForm">
          <template #icon>
            <n-icon>
              <AddIcon />
            </n-icon>
          </template>
          {{ t('add') }}
        </n-button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-1  md:grid-cols-1 lg:grid-cols-2 gap-4 ">
        <div v-for="(product, index) in productList" :key="index" class="border rounded-md p-4 mb-6">
          <p class="font-semibold mb-2">{{ t('product') }} #{{ index + 1 }}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <n-form-item :label="t('name') + ' UZB'">
              <n-input v-model:value="product.title_uz" clearable />
            </n-form-item>
            <n-form-item :label="t('name') + ' KOR'">
              <n-input v-model:value="product.title_ko" clearable />
            </n-form-item>
            <n-form-item :label="t('name') + ' RUS'">
              <n-input v-model:value="product.title_ru" clearable />
            </n-form-item>
            <n-form-item :label="t('name') + ' ENG'">
              <n-input v-model:value="product.title_en" clearable />
            </n-form-item>
            <n-form-item :label="t('category')">
              <n-select :options="categoryOption" v-model:value="product.category_id" :label-field="'title_' + locale"
                value-field="id" @update:value="() => loadBrands(index)" />
            </n-form-item>
            <!-- <n-form-item :label="t('brand')"> -->
            <n-form-item>
              <!-- <n-select :options="product.brandOption" v-model:value="product.brand_id" :label-field="'title_' + locale"
                value-field="id" /> -->
            </n-form-item>

            <n-space>
              <n-form-item :label="t('get price')" path="get_price">
                <n-input-number v-model:value="product.get_price" :parse="useParsenumber" :format="useFormatnumber"
                  :step="1000" clearable />
              </n-form-item>
              <n-form-item :label="t('unit')" path="unit">
                <n-select style="width: 150px;" :options="globalStore.unitOption" fitlerable
                  v-model:value="product.unit" :label-field="'title_' + locale" value-field="element" />
              </n-form-item>
            </n-space>
            <n-space>
              <n-form-item :label="t('selling price')" path="price">
                <n-input-number v-model:value="product.price" :parse="useParsenumber" :format="useFormatnumber"
                  :step="1000" clearable />
              </n-form-item>
              <n-form-item :label="t('active')" path="is_active">
                <n-switch v-model:value="product.is_active" />
              </n-form-item>
              <n-form-item :label="t('top')" path="top">
                <n-switch v-model:value="product.top" />
              </n-form-item>
            </n-space>
            <n-form-item :label="t('discount')">
              <n-input-number v-model:value="product.discount" :parse="useParsenumber" :format="useFormatnumber"
                :step="1000" clearable />
            </n-form-item>
          </div>
        </div>
      </div>

      <div class="flex justify-end postion-sticky bottom-0 gap-2">
        <n-button type="success" @click="submitAllProducts" :disabled="spinner">
          <template #icon><n-icon>
              <SaveIcon />
            </n-icon></template>
          {{ t('save') }}
        </n-button>
        <n-button type="warning" @click="exitBtn" :disabled="spinner">
          <template #icon><n-icon>
              <ExitIcon />
            </n-icon></template>
          {{ t('exit') }}
        </n-button>
      </div>
    </n-spin>
  </n-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '@/stores/global';
import categoryService from '@/services/category.service';
import brandService from '@/services/brand.service';
import ModelService from '@/services/product.service';
import { SaveIcon, AddIcon, ExitIcon } from '@/components/icons/icon';
import { useParsenumber, useFormatnumber } from '@/composible/NumberFormat';
const emit = defineEmits(["more_create", "close"]);

const { t, locale } = useI18n();
const globalStore = useGlobalStore();

const spinner = ref(false);
const categoryOption = ref([]);
const productList = ref([]);

const addProductForm = () => {
  productList.value.push({
    title_uz: '',
    title_ko: '',
    title_ru: '',
    title_en: '',
    category_id: null,
    brand_id: null,
    unit: 'piece',
    price: 0,
    get_price: 0,
    discount: 0,
    is_active: true,
    top: false,
    brandOption: [],
    photos: []
  });
};

const loadCategories = async () => {
  const res = await categoryService.all();
  categoryOption.value = res;
};

const loadBrands = async (index) => {
  const categoryId = productList.value[index].category_id;
  if (categoryId) {
    const res = await brandService.getBrandsByCategory(categoryId);
    productList.value[index].brandOption = res;
  }
};
const exitBtn = () => emit('close');
const submitAllProducts = async () => {
  spinner.value = true;
  try {
    for (const product of productList.value) {
      await ModelService.create(product);
    }
    productList.value = []; // Tozalash
    addProductForm();
  } catch (err) {
    console.error('Xatolik:', err);
  } finally {
    spinner.value = false;
  }
};

onMounted(() => {
  loadCategories();
  addProductForm();
});
</script>

<style scoped>
.border {
  border: 1px solid #dcdcdc;
}
</style>
