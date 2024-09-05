<template>
    <div class="container-fluid">
        <div class="mb-3">
            <h6>Users</h6>
        </div>
        <div class="mb-3">
            <form @submit.prevent>
                <div class="mb-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="mb-3">
                                <label>ID</label>
                                <input class="form-control" v-model="form.code">
                                <div class="form-text text-danger" v-if="error.code">{{ error.code }}</div>
                            </div>
                            <div class="mb-3">
                                <label>名前</label>
                                <input class="form-control" v-model="form.name">
                                <div class="form-text text-danger" v-if="error.name">{{ error.name }}</div>
                            </div>
                            <div class="mb-3">
                                <label>メールアドレス</label>
                                <input class="form-control" v-model="form.email">
                            </div>
                            <div class="mb-3">
                                <label>有効期限</label>
                                <Flatpickr class="form-control" v-model="form.expiryDate" placeholder="YYYY-MM-DD" />
                            </div>
                        </div>
                    </div>
                </div>
                <button class="me-2" @click="onSave" :disabled="isLoading">保存</button>
                <button class="me-2" type="button" @click="onGoback" :disabled="isLoading">戻る</button>
            </form>
        </div>
    </div>
    <Alert :alerts="alerts" @removeAlert="removeAlert" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Alert from '@/components/Alert';
import Flatpickr from '@/components/Flatpickr';
import useLoading from '@/hooks/useLoading';
import useAlert from '@/hooks/useAlert';
import useDateFormat from '@/hooks/useDateFormat';
import api from '@/services/api';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();
const { formatDate } = useDateFormat();

const id = route.params.id;
const form = ref({
    code: '',
    name: '',
    email: '',
    expiryDate: null,
});
const error = ref({});

onMounted(() => {
    if (id) fetchItem(id);
});

const fetchItem = async (id) => {
    try {
        store.commit('startLoading');
        const response = await api.get(`/api/users/${id}`);
        form.value.code = response.code;
        form.value.name = response.name;
        form.value.email = response.email;
        form.value.expiryDate = response.expiryDate ? formatDate(response.expiryDate) : null;
    } catch (err) {
        addAlert(`ID:${id}は存在しません。`, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const createItem = async () => {
    try {
        store.commit('startLoading');
        const response = await api.post(`/api/users`, form.value);
        addAlert(`作成しました。(ID:${response._id})`, 'success');
    } catch (err) {
        if (err.response) addAlert(err.response.data, 'error');
        else addAlert(err.message, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const updateItem = async () => {
    try {
        store.commit('startLoading');
        const response = await api.put(`/api/users/${id}`, form.value);
        addAlert(`更新しました。(ID:${response._id})`, 'success');
    } catch (err) {
        if (err.response) addAlert(err.response.data, 'error');
        else addAlert(err.message, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const Validation = {
    run() {
        return ([
            this.code(),
            this.name(),
        ]).every(bool => bool);
    },
    code() {
        error.value.code = '';
        if (form.value.code === '') {
            error.value.code = 'IDを入力してください。';
            return false;
        }
        return true;
    },
    name() {
        error.value.name = '';
        if (form.value.name === '') {
            error.value.name = '名前を入力してください。';
            return false;
        }
        return true;
    },
};

const onSave = () => {
    if (Validation.run()) {
        if (id) updateItem(id);
        else createItem(id);
    }
};

const onGoback = () => {
    router.push({
        name: 'UserList',
        query: store.getters.getQuery,
    });
};
</script>