<template>
    <div class="container-fluid">
        <div class="mb-3">
            <h6>PhysicalPropertyNames</h6>
        </div>
        <div class="mb-3">
            <form @submit.prevent>
                <div class="mb-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="mb-3">
                                <label>物性コード</label>
                                <div class="input-group">
                                    <template v-for="(n, index) in 5" :key="index">
                                        <input class="form-control" v-model="form.codes[index]" @change="onChangeCode(index)">
                                    </template>
                                </div>
                                <div class="form-text text-danger" v-if="error.code">{{ error.code }}</div>
                            </div>
                            <div class="mb-3">
                                <label>名前</label>
                                <input class="form-control" v-model="form.name">
                                <div class="form-text text-danger" v-if="error.name">{{ error.name }}</div>
                            </div>
                            <div class="mb-3">
                                <label>単位</label>
                                <input class="form-control" v-model="form.uom">
                            </div>
                            <div class="mb-3">
                                <label>ｎ数</label>
                                <input class="form-control" type="number" v-model="form.numberSize">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <table class="table table-bordered mb-0">
                        <thead>
                            <tr>
                                <th class="text-center">言語</th>
                                <th class="text-center">名前</th>
                                <th class="text-center">単位</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(propertyName, index) in form.propertyNames" :key="index">
                                <td width="10%" class="p-1"><input class="form-control" v-model="propertyName.language" readonly></td>
                                <td width="50%" class="p-1"><input class="form-control" v-model="propertyName.name"></td>
                                <td width="40%" class="p-1"><input class="form-control" v-model="propertyName.uom"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mb-3">
                    <div class="mb-3">
                        <label>備考</label>
                        <textarea class="form-control" v-model="form.remarks"></textarea>
                    </div>
                </div>
                <button class="me-2 float-end" @click="onSave" :disabled="isLoading">保存</button>
                <button class="me-2 float-end" type="button" @click="onGoback" :disabled="isLoading">戻る</button>
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
import useLoading from '@/hooks/useLoading';
import useAlert from '@/hooks/useAlert';
import api from '@/services/api';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();

const id = route.params.id;
const form = ref({
    code: '',
    codes: new Array(5),
    name: '',
    uom: '',
    numberSize: 0,
    propertyNames: Array.from(['JP','US'], (language) => {
        return {
            language: language,
            name: '',
            uom: '',
        };
    }),
    remarks: '',
});
const error = ref({});

onMounted(() => {
    if (id) fetchItem(id);
});

const fetchItem = async (id) => {
    try {
        store.commit('startLoading');
        const response = await api.get(`/api/physical/property/names/${id}`);
        form.value.code = response.code;
        form.value.codes = response.code.split('_');
        form.value.name = response.name;
        form.value.uom = response.uom;
        form.value.numberSize = response.numberSize;
        form.value.propertyNames = response.propertyNames;
        form.value.remarks = response.remarks;
    } catch (err) {
        addAlert(`ID:${id}は存在しません。`, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const onChangeCode = (index) => {
    form.value.codes[index] = form.value.codes[index].toUpperCase();
    if (form.value.codes.every(code => !code)) form.value.code = '';
    else form.value.code = form.value.codes.join('_');
};

const createItem = async () => {
    try {
        store.commit('startLoading');
        const response = await api.post(`/api/physical/property/names`, form.value);
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
        const response = await api.put(`/api/physical/property/names/${id}`, form.value);
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
            error.value.code = '物性コードを入力してください。';
            return false;
        }
        return true;
    },
    name() {
        error.value.name = '';
        if (form.value.name === '') {
            error.value.name = '物性名を入力してください。';
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
        name: 'PhysicalPropertyNameList',
        query: store.getters.getQuery,
    });
};
</script>