<template>
  <n-form ref="formRef" :model="form_data" :rules="rules">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <p class="text-xl font-semibold">
          {{ t('plastic card') }}
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
      <n-form-item :label="t('plastic card')" path="number">
        <n-input v-model:value="form_data.number" show-count clearable />
      </n-form-item>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <n-form-item :label="t('name') + ' UZB'" path="name_uz">
          <n-input v-model:value="form_data.name_uz" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('name') + ' KOR'" path="name_ko">
          <n-input v-model:value="form_data.name_ko" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('name') + ' RUS'" path="name_ru">
          <n-input v-model:value="form_data.name_ru" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('name') + ' ENG'" path="name_en">
          <n-input v-model:value="form_data.name_en" show-count clearable />
        </n-form-item>
      </div>
      <n-divider :style="{ margin: '8px 0' }"></n-divider>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <n-form-item :label="t('comment') + ' UZB'" path="comment_uz">
          <n-input type="textarea" v-model:value="form_data.comment_uz" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('comment') + ' KOR'" path="comment_ko">
          <n-input type="textarea" v-model:value="form_data.comment_ko" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('comment') + ' RUS'" path="comment_ru">
          <n-input type="textarea" v-model:value="form_data.comment_ru" show-count clearable />
        </n-form-item>
        <n-form-item :label="t('comment') + ' ENG'" path="comment_en">
          <n-input type="textarea" v-model:value="form_data.comment_en" show-count clearable />
        </n-form-item>
      </div>
    </n-spin>
  </n-form>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import { useI18n } from "vue-i18n";
import ModelService from "@/services/plastic_card.service";
import uploadService from "@/services/upload.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";

const { t } = useI18n();
const fileUrl = inject('fileUrl');
const props = defineProps({
  type: String,
  id: [String, Number]
});

const emit = defineEmits(["create", "update", "close"]);

const formRef = ref(null);
const spinner = ref(false);

const form_data = ref({
  number: null,
  name_uz: "",
  name_ru: "",
  name_ko: "",
  name_en: "",
  comment_uz: "",
  comment_ru: "",
  comment_ko: "",
  comment_en: "",
});

const createValidator = () => ({
  required: true,
  trigger: "blur",
  validator: (rule, value) => {
    if (!value) return new Error(t('input require'));
  }
});

const rules = {
  number: createValidator(),
  name_uz: createValidator(),
  name_ko: createValidator(),
  name_ru: createValidator(),
  name_en: createValidator(),
};

onMounted(async () => {
  if (props.type === "update" && props.id) {
    try {
      const res = await ModelService.getOne(props.id);
      form_data.value = res;
    } catch (error) {
      console.error("Ma'lumot yuklashda xatolik:", error);
    }
  }
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
