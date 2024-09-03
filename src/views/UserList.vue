<template>
    <div class="container-fluid">
        <div class="mb-3">
            <h6>Users</h6>
        </div>
        <div class="mb-3">
            <input class="form-control" v-model="filterValue" placeholder="検索">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>名前</th>
                        <th>有効期限</th>
                        <th>作成日時</th>
                        <th>作成者</th>
                        <th>更新日時</th>
                        <th>更新者</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) of filteredData" :key="index">
                        <td class="text-start">{{ row.code }}</td>
                        <td class="text-start">{{ row.name }}</td>
                        <td class="text-start">{{ row.expiryDate }}</td>
                        <td class="text-start">{{ row.createdAt }}</td>
                        <td class="text-start">{{ row.createdBy }}</td>
                        <td class="text-start">{{ row.updatedAt }}</td>
                        <td class="text-start">{{ row.updatedBy }}</td>
                        <td class="text-center">
                            <a href="javascript:" class="mx-2" @click="updateItem(row._id)" :disabled="isLoading">編集</a>
                            <a href="javascript:" class="mx-2" @click="removeItem(row._id)" :disabled="isLoading">削除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import useLoading from '@/hooks/useLoading';
import useFilter from '@/hooks/useFilterWithQuery';
import { apiGet, apiDelete } from '@/services/api';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { isLoading } = useLoading();

const items = ref([]);
const { filterValue, filteredData } = useFilter(items);

onMounted(() => {
    fetchUsers();
});

const fetchUsers = async () => {
    try {
        store.commit('startLoading');
        const response = await apiGet(`api/users`);
        items.value = response;
    } catch (err) {
    } finally {
        store.commit('stopLoading');
    }
};

const addItem = () => {
    router.push({
        name: 'UserAdd',
    });
};

const updateItem = (id) => {
    store.commit('setQuery', route.query);
    router.push({
        name: 'UserEdit',
        params: { id: id },
    });
};

const removeItem = async (id) => {
    if (confirm('削除しますか？')) {
        try {
            store.commit('startLoading');
            const response = await apiDelete(`/api/users/${id}`);
            items.value = items.value.filter(row => row._id !== id);
        } catch (err) {
        } finally {
            store.commit('stopLoading');
        }
    }
};
</script>