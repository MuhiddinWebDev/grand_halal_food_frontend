<script setup>
import { ref, onMounted, inject } from "vue";
import ModelService from "@/services/news.service";
import UploadService from "@/services/upload.service";
import { ExitIcon, SaveIcon } from "@/components/icons/icon";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const fileUrl = inject('file')
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref(null);
const spinner = ref(false);

const form_data = ref({
  image: "",
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

const deletedFile = (file) => {
  if(file){
    UploadService.delFile(file);
  }
}

const updateUpload = (data) => {
  if (data.length > 0) {
    const sendData = new FormData();
    sendData.append('file', data[0].file);
    UploadService.uploadFile(sendData).then((res) => {
      deletedFile(form_data.value.image);
      form_data.value.image = res.file;
    })
  }
};
const removeUpload = (data) => {
  deletedFile(form_data.value.image);
  form_data.value.image = ""
}
</script>

<template>
  <div class="modal">
    <n-form :style="{ height: '100%' }" ref="formRef" :model="form_data" :rules="rules">
      <n-spin :show="spinner">
        <div class="modal-wrapper">
          <div class="modal-header">
            <n-flex justify="space-between">
              <div class="modal-title">
                <p>{{ t('news') }} {{ props.type == 'create' ? $t('add').toLowerCase() :
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
            <n-grid :cols="3" :x-gap="12">
              <n-grid-item :span="2">
                <n-upload :max="1" accept="image/png, image/jpeg" list-type="image" directory-dnd
                  @update:file-list="updateUpload" @remove="removeUpload">
                  <n-upload-dragger accept="image/png, image/jpeg">
                    <n-text style="font-size: 16px">
                      {{ $t('upload_image') }}
                    </n-text>
                    <n-p depth="3" style="margin: 8px 0 0 0">
                      {{ $t('drop_image') }}
                    </n-p>
                  </n-upload-dragger>
                </n-upload>
              </n-grid-item>
              <n-grid-item>
                <n-image v-if="form_data.image" :src="fileUrl + form_data.image" width="120" height="120"></n-image>
              </n-grid-item>
            </n-grid>
            <n-grid :cols="3" :x-gap="12" :y-gap="0">
              <n-grid-item>
                <n-form-item :label="$t('title') + ' UZB'" path="title_uu">
                  <n-input v-model:value="form_data.title_uz" :maxlength="256" show-count clearable />
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item :label="$t('title') + ' KOR'" path="title_ka">
                  <n-input v-model:value="form_data.title_ka" :maxlength="256" show-count clearable />
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item :label="$t('title') + ' RUS'" path="title_ru">
                  <n-input v-model:value="form_data.title_ru" :maxlength="256" show-count clearable />
                </n-form-item>
              </n-grid-item>
              <!-- <n-grid-item>
                <n-form-item :label="$t('title') + ' ENG'" path="title_en">
                  <n-input v-model:value="form_data.title_en" :maxlength="256" show-count clearable />
                </n-form-item>
              </n-grid-item> -->
              <n-grid-item>
                <n-form-item :label="$t('comment') + ' UZB'" path="text_uz">
                  <n-input type="textarea" v-model:value="form_data.text_uz"></n-input>
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item :label="$t('comment') + ' KOR'" path="text_ka">
                  <n-input type="textarea" v-model:value="form_data.text_ka"></n-input>
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item :label="$t('comment') + ' RUS'" path="text_ru">
                  <n-input type="textarea" v-model:value="form_data.text_ru"></n-input>
                </n-form-item>
              </n-grid-item>
              <!-- <n-grid-item>
                <n-form-item :label="$t('comment') + ' ENG'" path="text_en">
                  <n-input type="textarea" v-model:value="form_data.text_en"></n-input>
                </n-form-item>
              </n-grid-item> -->
            </n-grid>
          </div>
        </div>
      </n-spin>
    </n-form>
  </div>
</template>
