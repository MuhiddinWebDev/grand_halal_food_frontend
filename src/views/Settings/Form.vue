<script setup>
import { ref, onMounted } from "vue";
import ModelService from "@/services/mobile_version.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
//// variables
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref(null);
const spinner = ref(false);
const inputInstRef = ref(null);
const form_data = ref({
  seller_ios: 0,
  seller_android: 0,
  client_ios: 0,
  client_android: 0,
});


const rules = {
  seller_ios: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) {
        return new Error(t('input require'));
      }
    },
  },
  seller_android: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) {
        return new Error(t('input require'));
      }
    },
  },
  client_ios: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) {
        return new Error(t('input require'));
      }
    },
  },
  client_android: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) {
        return new Error(t('input require'));
      }
    },
  },
};




onMounted(() => {
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
    });
  }

});

setTimeout(() => {
  inputInstRef.value?.focus()
}, 100)

const save = async () => {
  try {
    const result = await formRef.value?.validate();
    spinner.value = true;
    if (props.type == "update") {
      ModelService.update(form_data.value).then((res) => {
        emit("update", res);
      }).catch(() => {
        spinner.value = false;
      });
    }
  } catch (e) { }
};
const exitBtn = () => {
  emit("close");
};

const keySave = (e) => { if (e.code == 'Enter') save() };

</script>

<template>
  <div class="modal">
    <n-form :style="{ height: '100%' }" ref="formRef" :model="form_data" :rules="rules">
      <n-spin :show="spinner">
        <div class="modal-wrapper">
          <div class="modal-header">
            <n-flex justify="space-between">
              <div class="modal-title">
                <p>{{ t('settings') }} {{ t('change').toLowerCase() }}</p>
              </div>
              <n-space>
                <n-button @click="save" style="min-width: 120px" type="success" :disabled="spinner">
                  <template #icon>
                    <n-icon>
                      <SaveIcon />
                    </n-icon>
                  </template>
                  {{ t('save') }} <span class="button-key">Enter</span>
                </n-button>
                <n-button @click="exitBtn" style="min-width: 120px" type="warning">
                  <template #icon>
                    <n-icon>
                      <ExitIcon />
                    </n-icon>
                  </template>
                  {{ t('exit') }} <span class="button-key">Esc</span>
                </n-button>
              </n-space>
            </n-flex>
          </div>
          <div class="modal-container">
            <n-form-item label="Seller IOS" path="seller_ios">
              <n-input-number :style="{ width: '100%' }" ref="inputInstRef" @keydown="keySave"
                v-model:value="form_data.seller_ios" :min="0" />
            </n-form-item>
            <n-form-item label="Seller android" path="seller_android">
              <n-input-number :style="{ width: '100%' }" @keydown="keySave" v-model:value="form_data.seller_android" :min="0" />
            </n-form-item>
            <n-form-item label="Client IOS" path="client_ios">
              <n-input-number :style="{ width: '100%' }" @keydown="keySave" v-model:value="form_data.client_ios" :min="0" />
            </n-form-item>
            <n-form-item label="Client android" path="client_android">
              <n-input-number :style="{ width: '100%' }" @keydown="keySave" v-model:value="form_data.client_android" :min="0" />
            </n-form-item>
          </div>
        </div>
      </n-spin>
    </n-form>
  </div>
</template>
