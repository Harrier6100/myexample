<template>
    <div class="container-fluid">
        <div class="mb-3">
            <h5>物流アップロード</h5>
        </div>
        <div class="mb-3">
            <input type="file" @change="handleFileUpload">
            <div class="form-text text-danger" v-if="error.file">{{ error.file }}</div>
            <button @click="onUpload">アップロード</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const file = ref(null);
const error = ref({});

const Validation = {
    run() {
        return ([
            this.file(),
        ]).every(bool => bool);
    },
    file() {
        error.value.file = '';
        if (!file.value) {
            error.value.file = 'ファイルを選択してください。';
            return false;
        }
        return true;
    },
};

const onUpload = async () => {
    if (Validation.run()) {
        const formData = new FormData();
        formData.append('file', file.value);
        try {
            console.log('Start');
            const response = await axios.post(`http://192.168.10.100:3001/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
        } catch (err) {
            console.log(err);
        } finally {
            console.log('Finally');
        }
    }
};

const handleFileUpload = (e) => {
    file.value = e.target.files[0];
};
</script>