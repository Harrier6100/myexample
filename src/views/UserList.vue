<template>
    <div class="container-fluid">
        <div class="mb-3">
            <h6>Users</h6>
        </div>
        <div class="mb-3">
            <div class="row mb-3">
                <div class="col-auto me-auto">
                    <input class="form-control" v-model="filterValue" placeholder="検索">
                </div>
                <div class="col-auto">
                    <button class="btn btn-outline-primary" type="button" @click="addItem">新規追加</button>
                </div>
            </div>
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th :class="orderBy('code')" @click="sortBy('code')">ID</th>
                        <th :class="orderBy('name')" @click="sortBy('name')">名前</th>
                        <th :class="orderBy('expiryDate')" @click="sortBy('expiryDate')">有効期限</th>
                        <th :class="orderBy('createdAt')" @click="sortBy('createdAt')">作成日時</th>
                        <th :class="orderBy('createdBy')" @click="sortBy('createdBy')">作成者</th>
                        <th :class="orderBy('updatedAt')" @click="sortBy('updatedAt')">更新日時</th>
                        <th :class="orderBy('updatedBy')" @click="sortBy('updatedBy')">更新者</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) of paginatedData" :key="index">
                        <td class="text-start">{{ row.code }}</td>
                        <td class="text-start">{{ row.name }}</td>
                        <td class="text-start">{{ row.expiryDate ? formatDate(row.expiryDate) : '' }}</td>
                        <td class="text-start">{{ formatAt(row.createdAt) }}</td>
                        <td class="text-start">{{ row.createdBy }}</td>
                        <td class="text-start">{{ formatAt(row.updatedAt) }}</td>
                        <td class="text-start">{{ row.updatedBy }}</td>
                        <td class="text-center">
                            <a href="javascript:" class="mx-2" @click="updateItem(row._id)" :disabled="isLoading">編集</a>
                            <a href="javascript:" class="mx-2" @click="removeItem(row._id)" :disabled="isLoading">削除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination v-bind="{ page, pageSize }" @nextPage="nextPage" @prevPage="prevPage" />
        </div>
    </div>
    <Alert :alerts="alerts" @removeAlert="removeAlert" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Alert from '@/components/Alert';
import Pagination from '@/components/Pagination';
import useLoading from '@/hooks/useLoading';
import useAlert from '@/hooks/useAlert';
import useDateFormat from '@/hooks/useDateFormat';
import useFilter from '@/hooks/useFilterWithQuery';
import useSort from '@/hooks/useSortWithQuery';
import usePagination from '@/hooks/usePaginationWithQuery';
import { apiGet, apiDelete } from '@/services/api';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();
const { formatAt, formatDate } = useDateFormat();

const items = ref([]);
const { filterValue, filteredData } = useFilter(items);
const { orderBy, sortBy, sortedData } = useSort(filteredData);
const { page, pageSize, nextPage, prevPage, paginatedData } = usePagination(sortedData, 10);

onMounted(() => {
    fetchUsers();
});

const fetchUsers = async () => {
    try {
        store.commit('startLoading');
        const response = await apiGet(`api/users`);
        items.value = response;
    } catch (err) {
        addAlert(err, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const addItem = () => {
    store.commit('setQuery', route.query);
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
            addAlert(`削除しました。(ID:${response._id})`, 'success');
        } catch (err) {
            addAlert(err, 'error');
        } finally {
            store.commit('stopLoading');
        }
    }
};
</script>