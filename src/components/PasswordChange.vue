<template>
    <teleport to="body">
        <div class="base" v-show="open">
            <div class="overlay" v-show="open" @click="onClose"></div>
            <div class="content" v-show="open">
                <div class="mb-3">
                    <div class="mb-3">
                        <input class="form-control" type="password" v-model="form.password" placeholder="新しいパスワード">
                        <div class="form-text text-danger" v-if="error.password">{{ error.password }}</div>
                    </div>
                    <div class="mb-3">
                        <input class="form-control" type="password" v-model="form.passwordConfirm" placeholder="新しいパスワード（再入力）">
                        <div class="form-text text-danger" v-if="error.passwordConfirm">{{ error.passwordConfirm }}</div>
                    </div>
                    <button type="button" @click="onSave" :disabled="isLoading">保存</button>
                </div>
                <div class="form-text text-danger">{{ alert }}</div>
            </div>
        </div>
    </teleport>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import useLoading from '@/hooks/useLoading';
import api from '@/services/api';

export default {
    props: {
        open: Boolean,
    },
    emits: ['close'],
    setup(props, { emit }) {
        const store = useStore();
        const { isLoading } = useLoading();

        const form = ref({
            password: '',
            passwordConfirm: '',
        });
        const error = ref({});
        const alert = ref('');

        const Validation = {
            run() {
                return ([
                    this.password(),
                    this.passwordConfirm(),
                ]).every(bool => bool);
            },
            password() {
                error.value.password = '';
                if (form.value.password === '') {
                    error.value.password = '新しいパスワードを入力してください。';
                    return false;
                }
                return true;
            },
            passwordConfirm() {
                error.value.passwordConfirm = ''
                if (form.value.passwordConfirm === '') {
                    error.value.passwordConfirm = '新しいパスワード（再入力）を入力してください。';
                    return false;
                } else {
                    if (form.value.password !== form.value.passwordConfirm) {
                        error.value.passwordConfirm = '入力されたパスワードが一致しません。';
                        return false;
                    }
                }
                return true;
            },
        };

        const onSave = async () => {
            alert.value = '';
            if (Validation.run()) {
                store.commit('startLoading');
                api.put(`/api/me/password`, form.value)
                .then(() => {
                    onClose();
                })
                .catch(err => {
                    alert.value = err.message;
                })
                .finally(() => {
                    store.commit('stopLoading');
                });
            }
        };

        const onClose = () => {
            form.value.password = '';
            form.value.passwordConfirm = '';
            emit('close');
        };

        return {
            isLoading,
            form,
            error,
            alert,
            Validation,
            onSave,
            onClose,
        };
    },
};
</script>