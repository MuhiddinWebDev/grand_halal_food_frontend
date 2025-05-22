<template>
  <n-form ref="formRef" :model="form_data" :rules="rules">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <p class="text-xl font-semibold">
          {{ t('product') }}
          {{ props.type == 'create' ? t('add').toLowerCase() : t('change').toLowerCase() }}
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <n-form-item :label="t('name') + ' UZB'" path="title_uz">
          <n-input ref="inputInstRef" @keydown="keySave" v-model:value="form_data.title_uz" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('name') + ' KOR'" path="title_ko">
          <n-input @keydown="keySave" v-model:value="form_data.title_ko" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('name') + ' RUS'" path="title_ru">
          <n-input @keydown="keySave" v-model:value="form_data.title_ru" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('name') + ' ENG'" path="title_en">
          <n-input @keydown="keySave" v-model:value="form_data.title_en" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('category')" path="category_id">
          <n-select :options="categoryOption" fitlerable clearable @keydown="keySave"
            v-model:value="form_data.category_id" @update:value="changeCategory" :label-field="'title_' + locale"
            value-field="id" />
        </n-form-item>
        <n-form-item :label="t('brand')" path="brand_id">
          <n-select :options="brandOption" fitlerable clearable @keydown="keySave" v-model:value="form_data.brand_id"
            :label-field="'title_' + locale" value-field="id" />
        </n-form-item>
        <n-space>
          <n-form-item :label="t('price')" path="price">
            <n-input-number @keydown="keySave" v-model:value="form_data.price" :parse="useParsenumber"
              :format="useFormatnumber" :step="1000" clearable />
          </n-form-item>
          <n-form-item :label="t('unit')" path="unit">
            <n-select style="width: 150px;" :options="globalStore.unitOption" fitlerable clearable @keydown="keySave"
              v-model:value="form_data.unit" @update:value="changeCategory" :label-field="'title_' + locale"
              value-field="element" />
          </n-form-item>
        </n-space>

        <n-space>
          <n-form-item :label="t('active')" path="is_active">
            <n-switch @keydown="keySave" v-model:value="form_data.is_active" />
          </n-form-item>
          <n-form-item :label="t('top')" path="top">
            <n-switch @keydown="keySave" v-model:value="form_data.top" />
          </n-form-item>
        </n-space>
        <n-form-item :label="t('discount')" path="discount">
          <n-input-number @keydown="keySave" v-model:value="form_data.discount" :parse="useParsenumber"
            :format="useFormatnumber" :step="1000" clearable />
        </n-form-item>
        <n-form-item></n-form-item>
        <n-form-item :label="t('comment') + ' UZB'" path="description_uz">
          <n-input type="textarea" @keydown="keySave" v-model:value="form_data.description_uz" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('comment') + ' KOR'" path="description_ko">
          <n-input type="textarea" @keydown="keySave" v-model:value="form_data.description_ko" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('comment') + ' RUS'" path="description_ru">
          <n-input type="textarea" @keydown="keySave" v-model:value="form_data.description_ru" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('comment') + ' ENG'" path="description_en">
          <n-input type="textarea" @keydown="keySave" v-model:value="form_data.description_en" show-count clearable />
        </n-form-item>
      </div>
    </n-spin>
  </n-form>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "@/stores/global";
import ModelService from "@/services/product.service";
import categoryService from "@/services/category.service";
import brandService from "@/services/brand.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";
import { useFormatnumber, useParsenumber } from "@/composible/NumberFormat";
const globalStore = useGlobalStore();
const { t, locale } = useI18n();
const props = defineProps({
  type: String,
  id: [String, Number]
});

const emit = defineEmits(["create", "update", "close"]);

const formRef = ref(null);
const spinner = ref(false);
const inputInstRef = ref(null);
const categoryOption = ref([]);
const brandOption = ref([]);

const form_data = ref({
  title_uz: "",
  title_ru: "",
  title_ko: "",
  title_en: "",
  category_id: null,
  brand_id: null,
  unit: "piece",
  price: 0,
  discount: 0,
  description_uz: '',
  description_ru: '',
  description_ko: '',
  description_en: '',
  is_active: true,
  top: false,
  product_images: []
});
const getAllCategory = () => {
  categoryService.all().then(res => {
    categoryOption.value = res;
  })
}
const getAllBrand = () => {
  brandService.getBrandsByCategory(form_data.value.category_id).then(res => {
    brandOption.value = res;
  })
}
const createValidator = (field) => ({
  required: true,
  trigger: "blur",
  validator: (rule, value) => {
    if (!value) return new Error(t(field === 'image' ? 'require_image' : 'require_name'));
  }
});

const rules = {
  title_uz: createValidator("title_uz"),
  title_ko: createValidator("title_ko"),
  title_ru: createValidator("title_ru"),
  title_en: createValidator("title_en"),
  category_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) return new Error(t('require_category'));
    }
  },
};

onMounted(async () => {
  getAllCategory();
  if (props.type === "update" && props.id) {
    try {
      const res = await ModelService.getOne(props.id);
      form_data.value = res;
      getAllBrand();
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

    if (props.type === "create") {
      const res = await ModelService.create(form_data.value);
      emit("create", res);
    } else if (props.type === "update") {
      if (!form_data.value.product_images) form_data.value.product_images = [];
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

const changeCategory = (category_id) => {
  if (category_id) {
    form_data.value.brand_id = null;
    form_data.value.category_id = category_id;
    getAllBrand();
  }
}

// Klaviaturada Enter bosilsa saqlash
const keySave = (e) => {
  if (e.code === "Enter") save();
};
</script>
