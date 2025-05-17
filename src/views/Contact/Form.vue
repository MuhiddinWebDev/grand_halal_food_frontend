<template>
  <n-form ref="formRef" :model="form_data" :rules="rules">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <p class="text-xl font-semibold">
          {{ t('contact') }} {{ t('change').toLowerCase() }}
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
      <n-form-item :label="t('telegram')" path="telegram">
        <n-input @keydown="keySave" v-model:value="form_data.telegram" show-count clearable />
      </n-form-item>
      <n-form-item :label="t('tiktok')" path="tiktok">
        <n-input @keydown="keySave" v-model:value="form_data.tiktok" show-count clearable />
      </n-form-item>
      <n-form-item :label="t('instagram')" path="instagram">
        <n-input @keydown="keySave" v-model:value="form_data.instagram" show-count clearable />
      </n-form-item>
      <n-form-item :label="t('phone')" path="phone">
        <n-input @keydown="keySave" v-model:value="form_data.phone" show-count clearable />
      </n-form-item>
    </n-spin>
  </n-form>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import ModelService from "@/services/contact.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";

const { t, locale } = useI18n();
const props = defineProps({
  type: String,
  id: [String, Number]
});

const emit = defineEmits(["update", "close"]);

const formRef = ref(null);
const spinner = ref(false);
const inputInstRef = ref(null);

const form_data = ref({
  telegram: "",
  instagram: "",
  tiktok: "",
  phone: "",
});


const rules = {
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
    spinner.value = true;
    if (props.type === "update") {
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
</script>
