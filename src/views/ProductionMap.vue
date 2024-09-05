<template>
    <div class="container">
        <div class="mb-3">
            <h6>裁断展開図</h6>
        </div>
        <div class="mb-3">
            <div class="mb-3">
                <form @submit.prevent>
                    <div class="mb-3">
                        <lable>ロット</lable>
                        <input class="form-control" v-model="lot">
                        <div class="form-text text-danger" v-if="error">{{ error }}</div>
                    </div>
                    <button @click="onSearch" :disabled="isLoading">検索</button>
                </form>
            </div>
            <div class="mb-3">
                <div v-for="(map, index) of maps" :key="index" class="row">
                    <div v-for="(item, index) of map" :key="index" class="col" :class="{ 'pe-0': index === 0, 'px-0': index !== 0 }">
                        <div class="border p-3" :class="{ 'bg-warning-subtle': item.loss_class === 'F', 'bg-danger-subtle': item.loss_class === 'L' }">
                            <div class="list-unstyled">
                                <li>{{ item.record_number }}</li>
                                <li>{{ item.produced }}</li>
                                <li>{{ item.code }}</li>
                                <li>{{ item.name }}</li>
                                <li>{{ item.width }}mm x {{ item.length }}m</li>
                                <li>{{ item.lot }}</li>
                                <template v-if="item.after_lot">
                                    <li>↓</li>
                                    <li>{{ item.after_lot }}</li>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Alert :alerts="alerts" @removeAlert="removeAlert" />
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import Alert from '@/components/Alert';
import useLoading from '@/hooks/useLoading';
import useAlert from '@/hooks/useAlert';
import api from '@/services/api';
import { BASE_URL } from '@/env/config';

const store = useStore();
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();

const maps = ref([]);
const lot = ref('');
const error = ref('');

const Validation = {
    run() {
        return ([
            this.lot(),
        ]).every(bool => bool);
    },
    lot() {
        error.value = '';
        if (lot.value === '') {
            error.value = 'ロットを入力してください。';
            return false;
        }
        return true;
    },
};

const onSearch = async () => {
    if (Validation.run()) {
        try {
            store.commit('startLoading');
            const response = await api.get(`${BASE_URL}/api/v2/production/maps/${lot.value}`);
            maps.value = response;
        } catch (err) {
            if (err.response) addAlert(err.response.data, 'error');
            else addAlert(err, 'error');
        } finally {
            store.commit('stopLoading');
        }
    }
};

</script>