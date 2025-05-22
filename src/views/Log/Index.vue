<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useNotification } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useGlobalStore } from "@/stores/global"
import { EyeIcon, EyeOffIcon } from '@/components/icons/icon';
import axios from 'axios';
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const globalStore = useGlobalStore();
const notification = useNotification();
const router = useRouter();
const passwordInput = ref(null);
const showPassword = ref(false);
const form_data = ref({
    phone: "+998907788769",
    password: "987654321!s",
})

const length = ref(0);
const phoneInput = ref(null);

const noteAction = (content) => {
    notification.warning({
        title: t('warning'),
        content: content,
        duration: 2000,
    })
}
const login = async () => {
    let phoneNumber = form_data.value.phone.replace(/[^\d]/g, "");
    if (phoneNumber.length < 12 && form_data.value.password.length < 3) {
        noteAction(t('rule_full'))
    } else if (form_data.value.password.length < 3) {
        noteAction(t('rule_pass'))
    } else if (phoneNumber.length < 12) {
        noteAction(t('rule_num'))
    } else if (phoneNumber.length >= 12 && form_data.value.password.length >= 4) {
        try {
            form_data.value.phone = form_data.value.phone.replace(/[^\d]/g, "");
            axios.post("users/login", form_data.value).then((res) => {
                localStorage.setItem('token', res.token);
                localStorage.setItem('role', res.role);
                globalStore.currentData = res;
                globalStore.currentLang = res.lang || 'uz';
                let currentPage = '/home';
                if (res.role == 'Inspector') currentPage = '/sklad-table';
                router.push({ path: currentPage });
            }).catch((err) => {
                length.value = 0;
            })
        }
        catch (err) {
        }
    }

}
const enterKey = (e) => {
    if (e.key == 'Enter') {
        login()
    }
};
const keyPhone = (e) => {
    let phoneNumber = form_data.value.phone.replace(/[^\d]/g, "");
    if (e.key == 'Enter' && phoneNumber.length >= 12) {
        passwordInput.value.focus();
    }
}
const openPassword = (bool) => {
    showPassword.value = bool;
    !bool ? passwordInput.value.type = 'password' : passwordInput.value.type = 'text';

};
const updateLang = (lang) => {
    localStorage.setItem('lang', lang);
    locale.value = lang;
    globalStore.currentLang = lang;
}
onMounted(() => {
    updateLang(globalStore.currentLang);
})
</script>
<template>
    <div class="form_body">
        <div class="lang-top">
            <n-select style="width: 150px;" v-model:value="globalStore.currentLang" @update:value="updateLang"
                :options="globalStore.langOption" />
        </div>
        <div class="contact-wrapper">
            <header class="login-cta">
                <h2>{{ t('login') }}</h2>
            </header>
            <form>
                <div class="form-row">
                    <input @keydown="keyPhone" v-model="form_data.phone" type="text" 
                        required maxlength="19" ref="phoneInput" :placeholder="locale == 'uz' ? '+998' : '+82'">
                    <span>{{ t('phone') }}</span>
                </div>

                <div class="form-row ">
                    <input ref="passwordInput" v-model="form_data.password" @keydown="enterKey" type="password"
                        required>
                    <span>{{ t('password') }}</span>
                    <div class="input-icon">
                        <n-icon size="22">
                            <EyeIcon @click="openPassword(true)" v-if="!showPassword" />
                            <EyeOffIcon @click="openPassword(false)" v-else />
                        </n-icon>
                    </div>
                </div>

                <div class="form-row"></div>
                <div class="form-row">
                    <button type="button" @click="login">{{ t('enter') }}</button>
                </div>
            </form>
        </div>
        <div class="circle one"></div>
        <div class="circle two"></div>
        <div class="circle three"></div>
        <div class="circle four"></div>
    </div>
</template>

<style scoped lang="scss">
$primaryColor: #115D33;
$colorDark: #2d2d2d;

.lang-top {
    position: fixed;
    right: 10px;
    top: 10px;
    z-index: 10;
}

.input-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
}

.circle {
    position: fixed;
    background: #ffffff28;
    z-index: 1;
    pointer-events: none;
    border-radius: 50%;
    opacity: .15;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #fff;
}

.circle.one {
    top: 50%;
    left: 50%;
    width: 800px;
    height: 800px;
}

.circle.two {
    top: 80%;
    left: 0;
    width: 400px;
    height: 400px;
}

.circle.four {
    right: -300px;
    height: 210vh;
    top: -100vh;
    width: 600px;
}

.circle.three {
    top: -70%;
    left: 50vw;
    width: 600px;
    height: 600px;
}

.form_body {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, $primaryColor, lighten($primaryColor, 10%), lighten($primaryColor, 20%));
    min-height: 100vh;
    padding: 1rem;
    position: relative;
    overflow: hidden;
}

.contact-wrapper {
    background: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 0.75em;
    padding: 2em;
    width: 100%;
    max-width: 400px;
    z-index: 2;
}

.login-cta>h2 {
    color: $colorDark;
    font-size: 1.75rem;
    text-align: center;
}

form {
    margin: 2em 0;

    .form-row {
        display: flex;
        margin: 1em 0;
        position: relative;
        flex-direction: column;

        span {
            background: #fff;
            color: #666;
            display: inline-block;
            font-weight: 400;
            left: 1em;
            padding: 0 .5em;
            position: absolute;
            pointer-events: none;
            transform: translateY(-50%);
            top: 50%;
            transition: all 300ms ease;
            user-select: none;
        }

        input,
        button {
            border-radius: .5em;
            font-family: inherit;
            padding: 1em;
            width: 100%;
            font-size: 16px;
        }

        input {
            font-weight: 500;
            transition: border-color 0.3s;
            border: .075em solid #ddd;

            &:valid+span,
            &:focus+span {
                top: 0;
                font-size: .85rem;
                color: $primaryColor;
            }

            &:focus {
                border-color: $primaryColor;
                outline: none;
            }
        }

        button {
            background: $primaryColor;
            border: none;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 300ms ease;
            font-size: 17px;

            &:focus {
                outline: none;
                box-shadow: 0 0 0 3px lighten($primaryColor, 20%);
            }

            &:hover {
                background-color: darken($primaryColor, 5);
            }
        }
    }
}

@media (max-width: 600px) {
    .contact-wrapper {
        padding: 1.5em 1em;
        width: 100%;
        max-width: 100%;
    }

    .form_body {
        padding: 0.5em;
    }

    .lang-top {
        width: 100%;
        text-align: right;
        right: 0;
        padding: 1em;
    }
}
</style>