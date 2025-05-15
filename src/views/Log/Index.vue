<script setup>
import { ref, onMounted, h, computed } from 'vue';
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
    phone: "+998",
    password: "",
})

const length = ref(0)
const formatTelNumber = () => {
    if (length.value < form_data.value.phone.length) {
        let numbers = formatNumber(form_data.value.phone)
        form_data.value.phone = numbers
    }
    length.value = form_data.value.phone.length;
}

const formatNumber = (value) => {
    if (!value) return value
    const phoneNumber = value.replace(/[^\d]/g, "")
    const phoneNumberLength = phoneNumber.length
    if (phoneNumberLength < 4) return `+998${phoneNumber}`
    if (phoneNumberLength < 6) {
        return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}`
    }
    if (phoneNumberLength < 8) {
        return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5)}`
    }
    if (phoneNumberLength < 10) {
        return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)} ${phoneNumber.slice(8)}`
    }
    return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)} ${phoneNumber.slice(8, 10)} ${phoneNumber.slice(10)}`
}
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
                formatTelNumber()
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
                    <input @keydown="keyPhone" v-model="form_data.phone" type="text" @input="formatTelNumber()" required
                        maxlength="19">
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
$colorPurple: #615dfa;
$colorDark: #3e3f5e;

.lang-top {
    position: fixed;
    right: 10px;
    top: 10px;
}

.input-icon {
    position: absolute;
    right: 10px;
    top: 55%;
    transform: translateY(-50%);
    cursor: pointer;
}

.circle {
    position: fixed;
    top: 0;
    left: 0;
    padding: 350px;
    background: #ffffff28;
    z-index: 1;
    pointer-events: none;
    border-radius: 50%;
    opacity: .15;
}

.circle.one {
    top: 50%;
    left: 50%;
    padding: 400px 600px;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #fff;
}

.circle.two {
    top: 80%;
    left: 0%;
    padding: 200px 200px;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #fff;
}

.circle.four {
    right: -300px;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #fff;
    height: 210vh;
    top: -100vh;
}

.circle.three {
    top: -70%;
    left: 50vw;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #fff;
}

.form_body {
    align-items: center;
    background: linear-gradient(135deg, #0c3eb4, #4470d8, #4470d8, #b4707d, #b06774);
    display: flex;
    height: 100vh;
    justify-content: center;
}

.contact-wrapper {
    background: #fff;
    box-shadow: 3px 3px 2px rgba(0, 0, 0, .15);
    border-radius: .75em;
    padding: 2em;
    width: 30em;
}

.login-cta {
    &>h2 {
        color: $colorDark;
        font-size: 1.75rem;
        text-align: center;
    }
}


form {
    margin: 2em 0;

    .form-row {
        display: flex;
        margin: .75em 0;
        position: relative;

        span {
            background: #fff;
            color: #adafca;
            display: inline-block;
            font-weight: 400;
            left: 1em;
            padding: 0 .5em;
            position: absolute;
            pointer-events: none;
            transform: translatey(-50%);
            top: 50%;
            transition: all 300ms ease;
            user-select: none;
        }

        input,
        button {
            border-radius: .5em;
            font-family: inherit;
            padding: 1em .5em;
            width: 100%;
            font-size: 16px;
        }

        input {
            font-weight: bold;
            transition: 100ms ease all;
            width: 100%;

            &[type=text],
            &[type=password] {
                border: .075em solid #ddd;
            }

            &:valid {
                &+span {
                    top: 0;
                    font-size: .90rem;
                }
            }

            &:invalid {
                &+span {
                    top: 50%;
                }
            }

            &:focus {
                &+span {
                    top: 0;
                }
            }

            &:required {
                box-shadow: none;
            }

            &:focus {
                border-color: #7b5dfa;
                outline: none;

                &:invalid {
                    box-shadow: none;
                    top: 50%;
                }

                &:valid {
                    top: 0;
                }
            }
        }

        &>button {
            background: linear-gradient(135deg, #0c3eb4, #4470d8, #4470d8, #b4707d, #b06774);
            // border: .10em solid #0c3eb4;
            border: none;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            transition: all 300ms ease;
            font-weight: bold;
            font-size: 17px;

            &:focus {
                border: .10em solid darken(#7b5dfa, 10);
                outline: none;
            }

            &:hover {
                background-color: darken(#7b5dfa, 5);
            }
        }
    }
}
</style>