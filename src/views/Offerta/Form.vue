<template>
  <n-form ref="formRef" :model="form_data" :rules="rules">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <p class="text-xl font-semibold">
          {{ t('general offerta') }} {{ t('change').toLowerCase() }}
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
        <n-form-item :label="t('text') + ' UZB'" path="text_uz">
          <n-input type="textarea" style="width: 100%;" v-model:value="form_data.text_uz"
            :autosize="{ minRows: 12, minCols: 50 }" />
        </n-form-item>
        <n-form-item :label="t('text') + ' RUS'" path="text_ru">
          <n-input type="textarea" style="width: 100%;" v-model:value="form_data.text_ru"
            :autosize="{ minRows: 12, minCols: 50 }" />
        </n-form-item>
        <n-form-item :label="t('text') + ' KOR'" path="text_ko">
          <n-input type="textarea" style="width: 100%;" v-model:value="form_data.text_ko"
            :autosize="{ minRows: 12, minCols: 50 }" />
        </n-form-item>
        <n-form-item :label="t('text') + ' ENG'" path="text_en">
          <n-input type="textarea" style="width: 100%;" v-model:value="form_data.text_en"
            :autosize="{ minRows: 12, minCols: 50 }" />
        </n-form-item>
      </div>
    </n-spin>
  </n-form>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import ModelService from "@/services/offerta.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";

const { t } = useI18n();
const props = defineProps({
  type: String,
  id: [String, Number]
});

const emit = defineEmits(["update", "close"]);

const formRef = ref(null);
const spinner = ref(false);

const form_data = ref({
  text_uz: "",
  text_ru: "",
  text_ko: "",
  text_en: "",
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

</script>
