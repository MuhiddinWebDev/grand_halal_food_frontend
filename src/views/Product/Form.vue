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
          <n-form-item :label="t('get price')" path="get_price">
            <n-input-number @keydown="keySave" v-model:value="form_data.get_price" :parse="useParsenumber"
              :format="useFormatnumber" :step="1000" clearable />
          </n-form-item>

          <n-form-item :label="t('unit')" path="unit">
            <n-select style="width: 150px;" :options="globalStore.unitOption" fitlerable @keydown="keySave"
              v-model:value="form_data.unit" :label-field="'title_' + locale" value-field="element" />
          </n-form-item>
        </n-space>
        <n-space>
          <n-form-item :label="t('selling price')" path="price">
            <n-input-number @keydown="keySave" v-model:value="form_data.price" :parse="useParsenumber"
              :format="useFormatnumber" :step="1000" clearable />
          </n-form-item>
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
        <div class="md:col-span-2">
          <n-upload :max="5" accept="image/png, image/jpeg" directory-dnd @update:file-list="updateUpload"
            @remove="removeUpload">
            <n-upload-dragger accept="image/png, image/jpeg">
              <n-text class="text-base">
                {{ $t('upload_image') }}
              </n-text>
              <n-p depth="3" class="mt-2">
                {{ $t('drop_image') }}
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-6  gap-2 mt-2">
        <div v-for="(file, index) in form_data.photos" :key="index" class="flex gap-2 ">
          <n-image v-if="file.name" :src="fileUrl + file.name" width="120" height="80" class="rounded" />
          <n-button type="error">
            <template #icon>
              <n-icon size="30" color="#fff">
                <TrashIcon @click="removeUpload(file)" />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </n-spin>
  </n-form>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "@/stores/global";
import ModelService from "@/services/product.service";
import categoryService from "@/services/category.service";
import brandService from "@/services/brand.service";
import uploadService from "@/services/upload.service";
import { ExitIcon, SaveIcon, TrashIcon } from "@/components/icons/icon";
import { useFormatnumber, useParsenumber } from "@/composible/NumberFormat";
const globalStore = useGlobalStore();
const fileUrl = inject('fileUrl');
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
  get_price: 0,
  is_active: true,
  top: false,
  photos: []
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
const createValidator = (message) => ({
  required: true,
  trigger: "blur",
  validator: (rule, value) => {
    if (!value) return new Error(t(message));
  }
});

const rules = {
  title_uz: createValidator("input require"),
  title_ko: createValidator("input require"),
  title_ru: createValidator("input require"),
  title_en: createValidator("input require"),
  category_id: createValidator("choose require"),
  brand_id: createValidator("choose require"),
};

onMounted(async () => {
  getAllCategory();
  if (props.type === "update" && props.id) {
    try {
      const res = await ModelService.getOne(props.id);
      form_data.value = res;
      if (!res.photos) form_data.value.photos = [];
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
      if (!form_data.value.photos) form_data.value.photos = [];
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

// Faylni serverdan o‘chirish
const deletedFile = async (file) => {
  if (file) {
    try {
      await uploadService.delFile(file);
    } catch (err) {
      console.warn("Faylni o‘chirishda xatolik:", err);
    }
  }
};

// Yangi fayl yuklandi
const updateUpload = async (data) => {
  if (data && data.length > 0) {
    const lastItem = data[data.length - 1];
    if (lastItem && lastItem.file) {
      const sendData = new FormData();
      sendData.append("file", lastItem.file);
      try {
        const res = await uploadService.uploadFile(sendData);
        form_data.value.photos.push({ name: res.file });
      } catch (err) {
        console.error("Yuklashda xatolik:", err);
      }
    }
  }
};


// Fayl o‘chirish
const removeUpload = async (file) => {
  try {
    await uploadService.delFile(file.name);
    form_data.value.photos = form_data.value.photos.filter(f => f.name !== file.name);
  } catch (err) {
    console.warn("Faylni o‘chirishda xatolik:", err);
  }
};

</script>
