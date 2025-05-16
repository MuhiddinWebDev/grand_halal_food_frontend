<template>
  <n-form ref="formRef" :model="form_data" :rules="rules">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <p class="text-xl font-semibold">
          {{ t('brand') }}
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

      <n-form-item :label="t('category')" path="category_id">
        <n-select :options="categoryOption" fitlerable clearable @keydown="keySave"
          v-model:value="form_data.category_id" :label-field="'title_' + locale" value-field="id" />
      </n-form-item>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <n-form-item :label="t('title') + ' UZB'" path="title_uz">
          <n-input ref="inputInstRef" @keydown="keySave" v-model:value="form_data.title_uz" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('title') + ' KOR'" path="title_ko">
          <n-input @keydown="keySave" v-model:value="form_data.title_ko" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('title') + ' RUS'" path="title_ru">
          <n-input @keydown="keySave" v-model:value="form_data.title_ru" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('title') + ' ENG'" path="title_en">
          <n-input @keydown="keySave" v-model:value="form_data.title_en" show-count clearable />
        </n-form-item>
      </div>
    </n-spin>
  </n-form>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import ModelService from "@/services/brand.service";
import categoryService from "@/services/offersTable.service";
import uploadService from "@/services/upload.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";

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


const form_data = ref({
  title_uz: "",
  title_ru: "",
  title_ko: "",
  title_en: "",
  category_id: null
});
const getAllCategory = () => {
  categoryService.all().then(res => {
    categoryOption.value = res;
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
  image: createValidator("image"),
};

onMounted(async () => {
  getAllCategory();
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

const deletedFile = async (file) => {
  if (file) {
    try {
      await uploadService.delFile(file);
    } catch (err) {
      console.warn("Faylni o‘chirishda xatolik:", err);
    }
  }
};

const updateUpload = async (data) => {
  if (data.length > 0) {
    const sendData = new FormData();
    sendData.append("file", data[0].file);

    try {
      const res = await uploadService.uploadFile(sendData);
      await deletedFile(form_data.value.image);
      form_data.value.image = res.file;
    } catch (err) {
      console.error("Yuklashda xatolik:", err);
    }
  }
};

// Fayl o‘chirish
const removeUpload = () => {
  deletedFile(form_data.value.image);
  form_data.value.image = "";
};

// Klaviaturada Enter bosilsa saqlash
const keySave = (e) => {
  if (e.code === "Enter") save();
};
</script>
