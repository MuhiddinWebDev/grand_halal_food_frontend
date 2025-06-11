<template>
  <n-form ref="formRef" :model="form_data" :rules="rules">
    <n-spin :show="spinner">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <p class="text-xl font-semibold">
          {{ t('delivery_summa') }}
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
      <!-- Input Fields -->
      <n-form-item :label="t('datetime')" path="datetime">
        <n-date-picker :style="{ width: '100%' }" v-model:value="form_data.datetime" :disabled="true" type="datetime"></n-date-picker>
      </n-form-item>
      <n-form-item :label="t('price')" path="summa">
        <n-input-number :style="{ width: '100%' }" @keydown="keySave" v-model:value="form_data.summa" show-count clearable :step="1000" :parse="useParsenumber" :format="useFormatnumber" />
      </n-form-item>
      <n-form-item :label="t('title') + ' ENG'" path="title_en">
        <n-input type="textarea" @keydown="keySave" v-model:value="form_data.comment" show-count clearable />
      </n-form-item>
    </n-spin>
  </n-form>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import { useI18n } from "vue-i18n";
import ModelService from "@/services/delivery_summa.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";
import { parse } from "vue/compiler-sfc";
import { useFormatnumber, useParsenumber } from "@/composible/NumberFormat";

const { t } = useI18n();

const props = defineProps({
  type: String,
  id: [String, Number]
});
const emit = defineEmits(["create", "update", "close"]);

// Refs
const formRef = ref(null);
const spinner = ref(false);

// Form data
const form_data = ref({
  summa: 0,
  comment: "",
  datetime: new Date().getTime(),
});


const rules = {
  summa: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) return new Error(t('input require'));
    }
  }
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

// Klaviaturada Enter bosilsa saqlash
const keySave = (e) => {
  if (e.code === "Enter") save();
};
</script>
