<template>
    <teleport to="body">
        <div class="base" v-show="open">
            <div class="overlay" v-show="open" @click="onClose"></div>
            <div class="content" v-show="open">
                <form @submit.prevent="onSignin">
                    <div class="mb-3">
                        <div class="mb-3">
                            <input class="form-control" v-model="form.id" @input="Validation.id()" placeholder="ID">
                            <div class="form-text text-danger" v-if="error.id">{{ error.id }}</div>
                        </div>
                        <div class="mb-3">
                            <input class="form-control" type="password" v-model="form.password" @input="Validation.password()" placeholder="パスワード">
                            <div class="form-text text-danger" v-if="error.password">{{ error.password }}</div>
                        </div>
                        <button :disabled="isLoading">サインイン</button>
                    </div>
                    <div class="form-text text-danger">{{ alert }}</div>
                </form>
            </div>
        </div>
    </teleport>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import useLoading from '@/hooks/useLoading';

export default {
    props: {
        open: Boolean,
    },
    emits: ['close'],
    setup(props, { emit }) {
        const store = useStore();
        const { isLoading } = useLoading();

        const form = ref({
            id: '',
            password: '',
        });
        const error = ref({});
        const alert = ref('');

        const Validation = {
            run() {
                return ([
                    this.id(),
                    this.password(),
                ]).every(bool => bool);
            },
            id() {
                error.value.id = '';
                if (form.value.id === '') {
                    error.value.id = 'IDを入力してください。';
                    return false;
                }
                return true;
            },
            password() {
                error.value.password = '';
                if (form.value.password === '') {
                    error.value.password = 'パスワードを入力してください。';
                    return false;
                }
                return true;
            },
        };

        const onSignin = () => {
            alert.value = '';
            if (Validation.run()) {
                store.commit('startLoading');
                store.dispatch('user/signin', form.value)
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
            form.value.id = '';
            form.value.password = '';
            emit('close');
        };

        return {
            isLoading,
            form,
            error,
            alert,
            Validation,
            onSignin,
            onClose,
        };
    },
};
</script>