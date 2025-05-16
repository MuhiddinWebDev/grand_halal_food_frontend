<template>
  <n-form ref="formRef" :model="form_data" :rules="rules">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <p class="text-xl font-semibold">
          {{ t('category') }}
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

      <!-- Image Upload Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div class="md:col-span-2">
          <n-upload :max="1" accept="image/png, image/jpeg" list-type="image" directory-dnd
            @update:file-list="updateUpload" @remove="removeUpload">
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
        <div>
          <n-image v-if="form_data.image" :src="fileUrl + form_data.image" width="120" height="80" class="rounded" />
        </div>
      </div>

      <!-- Input Fields -->
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
import { ref, onMounted, inject } from "vue";
import { useI18n } from "vue-i18n";
import ModelService from "@/services/category.service";
import uploadService from "@/services/upload.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";

const { t } = useI18n();

const props = defineProps({
  type: String,
  id: [String, Number]
});
const emit = defineEmits(["create", "update", "close"]);

// Refs
const formRef = ref(null);
const spinner = ref(false);
const inputInstRef = ref(null);

// Fayl URL - provide/inject orqali global file URL olinyapti
const fileUrl = inject('fileUrl');

// Form data
const form_data = ref({
  title_uz: "",
  title_ru: "",
  title_ko: "",
  title_en: "",
  image: "",
});

// Form rules (validation)
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

// On mounted: agar update bo‘lsa ma’lumotni yuklab olish
onMounted(async () => {
  if (props.type === "update" && props.id) {
    try {
      const res = await ModelService.getOne(props.id);
      form_data.value = res;
    } catch (error) {
      console.error("Ma'lumot yuklashda xatolik:", error);
    }
  }

  // Autofocus input
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
    // validation error or exception
    console.warn("Form not valid or failed", e);
  } finally {
    spinner.value = false;
  }
};

// Modalni yopish
const exitBtn = () => emit("close");

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
