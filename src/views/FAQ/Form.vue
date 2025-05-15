<script setup>
import { ref, onMounted } from "vue";
import ModelService from "@/services/faq.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";
import { useGlobalStore } from "@/stores/global";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const globalStore = useGlobalStore();
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref(null);
const spinner = ref(false);

const form_data = ref({
  title_uz: "",
  title_ru: "",
  title_en: "",
  title_ka: "",
  text_uz: "",
  text_ka: "",
  text_ru: "",
  text_en: "",
});

const rules = {
  title_uz: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) {
        return new Error(t('input require'));
      }
    },
  },
  title_ru: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) {
        return new Error(t('input require'));
      }
    },
  },
  // title_en: {
  //   required: true,
  //   trigger: "blur",
  //   validator: (rule, value) => {
  //     if (!value) {
  //       return new Error(t('input require'));
  //     }
  //   },
  // },
  title_ka: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) {
        return new Error(t('input require'));
      }
    },
  },
  text_uz: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) {
        return new Error(t('input require'));
      }
    },
  },
  text_ru: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (!value) {
        return new Error(t('input require'));
      }
    },
  },
  // text_en: {
  //   required: true,
  //   trigger: "blur",
  //   validator: (rule, value) => {
  //     if (!value) {
  //       return new Error(t('input require'));
  //     }
  //   },
  // },
  text_ka: {
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



const save = async () => {
  try {
    const result = await formRef.value?.validate();
    spinner.value = true;
    if (props.type == "create") {
      ModelService.create(form_data.value).then((res) => {
        emit("create", res);

      }).catch(() => {
        spinner.value = false;
      });
    } else if (props.type == "update") {
      ModelService.update(props.id, form_data.value).then((res) => {
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
</script>

<template>
  <div class="modal">
    <n-form :style="{ height: '100%' }" ref="formRef" :model="form_data" :rules="rules">
      <n-spin :show="spinner">
        <div class="modal-wrapper">
          <div class="modal-header">
            <n-flex justify="space-between">
              <div class="modal-title">
                <p>F.A.Q {{ props.type == 'create' ? $t('add').toLowerCase() :
                  $t('update').toLowerCase() }}</p>
              </div>
              <n-space>
                <n-button @click="save" style="min-width: 120px" type="success" :disabled="spinner">
                  <template #icon>
                    <n-icon>
                      <SaveIcon />
                    </n-icon>
                  </template>
                  {{ $t('save') }} <span class="button-key">Enter</span>
                </n-button>
                <n-button @click="exitBtn" style="min-width: 120px" type="warning">
                  <template #icon>
                    <n-icon>
                      <ExitIcon />
                    </n-icon>
                  </template>
                  {{ $t('exit') }} <span class="button-key">Esc</span>
                </n-button>
              </n-space>
            </n-flex>
          </div>
          <div class="modal-container">
            <n-grid :cols="3" :x-gap="12" :y-gap="0">
              <n-grid-item>
                <n-form-item :label="$t('question') + ' UZB'" path="title_uu">
                  <n-input v-model:value="form_data.title_uz" :maxlength="256" show-count clearable />
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item :label="$t('question') + ' KOR'" path="title_ka">
                  <n-input v-model:value="form_data.title_ka" :maxlength="256" show-count clearable />
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item :label="$t('question') + ' RUS'" path="title_ru">
                  <n-input v-model:value="form_data.title_ru" :maxlength="256" show-count clearable />
                </n-form-item>
              </n-grid-item>
              <!-- <n-grid-item>
                <n-form-item :label="$t('question') + ' ENG'" path="title_en">
                  <n-input v-model:value="form_data.title_en" :maxlength="256" show-count clearable />
                </n-form-item>
              </n-grid-item> -->
              <n-grid-item>
                <div class="modal-container-row_item">
                  <label for="">{{ $t('answer') + ' UZB' }}</label>
                  <QuillEditor contentType="html" theme="snow" v-model:content="form_data.text_uz" />
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="modal-container-row_item">
                  <label for="">{{ $t('answer') + ' KOR' }}</label>
                  <QuillEditor contentType="html" theme="snow" v-model:content="form_data.text_ka" />
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="modal-container-row_item">
                  <label for="">{{ $t('answer') + ' RUS' }}</label>
                  <QuillEditor contentType="html" theme="snow" v-model:content="form_data.text_ru" />
                </div>
              </n-grid-item>
              <!-- <n-grid-item>
                <div class="modal-container-row_item">
                  <label for="">{{ $t('answer') + ' ENG' }}</label>
                  <QuillEditor contentType="html" theme="snow" v-model:content="form_data.text_en" />
                </div>
              </n-grid-item> -->
            </n-grid>
          </div>
        </div>
      </n-spin>
    </n-form>
  </div>
</template>
