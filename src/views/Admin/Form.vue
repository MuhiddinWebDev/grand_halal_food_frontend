<template>
  <div class="p-1">
    <n-form ref="formRef" :model="form_data" :rules="rules">
      <n-spin :show="spinner">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p class="text-lg font-semibold">
              {{ $t('admin_one') }} {{ props.type === 'create' ? $t('add').toLowerCase() : $t('change').toLowerCase() }}
            </p>
            <div class="flex flex-col sm:flex-row gap-2">
              <n-button @click="save" type="success" :disabled="spinner" class="min-w-[120px]">
                <template #icon><n-icon><SaveIcon /></n-icon></template>
                {{ $t('save') }} <span class="ml-1 text-xs">Enter</span>
              </n-button>
              <n-button @click="exitBtn" type="warning" class="min-w-[120px]">
                <template #icon><n-icon><ExitIcon /></n-icon></template>
                {{ $t('exit') }} <span class="ml-1 text-xs">Esc</span>
              </n-button>
            </div>
          </div>

          <!-- Upload -->
          <div class="space-y-4">
            <n-upload :max="1" accept="image/png, image/jpeg" list-type="image" directory-dnd @update:file-list="updateUpload" @remove="removeUpload">
              <n-upload-dragger>
                <n-text class="text-base">{{ $t('upload_image') }}</n-text>
                <n-p class="text-sm mt-2">{{ $t('drop_image') }}</n-p>
              </n-upload-dragger>
            </n-upload>
            <n-image v-if="form_data.image" :src="fileUrl + form_data.image" width="120" height="120" class="rounded" />
          </div>

          <!-- Form Inputs -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <n-form-item :label="$t('fullname')" path="fullname">
              <n-input v-model:value="form_data.fullname" maxlength="50" show-count clearable />
            </n-form-item>

            <n-form-item :label="$t('phone')" path="phone">
              <n-input @keydown="keySave" :allow-input="phoneFormat" v-model:value="form_data.phone" maxlength="12" minlength="12" show-count clearable />
            </n-form-item>

            <n-form-item :label="$t('password')" path="password">
              <n-input type="password" show-password-on="mousedown" v-model:value="form_data.password" minlength="3" show-count clearable />
            </n-form-item>

            <n-form-item :label="$t('role')" path="role">
              <n-select :options="globalStore.roleOption" value-field="key" :label-field="'name_' + locale" v-model:value="form_data.role" filterable />
            </n-form-item>
          </div>
        </div>
      </n-spin>
    </n-form>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useMessage } from "naive-ui";
import { useGlobalStore } from "@/stores/global";
import { useI18n } from "vue-i18n";
import ModelService from "@/services/users.service";
import UploadService from "@/services/upload.service";
import { SaveIcon, ExitIcon } from "@/components/icons/icon";

const { locale, t } = useI18n();
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close"]);

const formRef = ref(null);
const spinner = ref(false);
const message = useMessage();
const fileUrl = inject("fileUrl");
const globalStore = useGlobalStore();

const form_data = ref({
  phone: "998",
  image: "",
  fullname: "",
  status: true,
  role: "Admin",
  password: "123456",
  lang: locale,
});

const rules = {
  phone: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value.length < 12) return new Error(t("require_phone"));
    },
  },
  fullname: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) return new Error(t("require_fullname"));
    },
  },
  password: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value && value.length < 6) return new Error(t("require_password"));
    },
  },
};

onMounted(() => {
  if (props.type === "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
    });
  }
});

const save = async () => {
  try {
    await formRef.value?.validate();
    spinner.value = true;
    const serviceCall =
      props.type === "create"
        ? ModelService.create(form_data.value)
        : ModelService.update(props.id, form_data.value);
    serviceCall
      .then((res) => emit(props.type, res))
      .catch(() => (spinner.value = false));
  } catch {}
};

const exitBtn = () => emit("close");
const deletedFile = (file) => file && UploadService.delFile(file);
const updateUpload = (data) => {
  if (data.length > 0) {
    const sendData = new FormData();
    sendData.append("file", data[0].file);
    UploadService.uploadFile(sendData).then((res) => {
      deletedFile(form_data.value.image);
      form_data.value.image = res.file;
    });
  }
};
const removeUpload = () => {
  deletedFile(form_data.value.image);
  form_data.value.image = "";
};
const phoneFormat = (val) => {
  const valid = !val || /^\d+$/.test(val);
  if (!valid) message.warning("Iltimos raqam kiriting");
  return valid;
};
const keySave = (e) => e.key === "Enter" && save();
</script>