<template>
    <div class="container-fluid">
        <div class="mb-3">
            <h5>MaterialStocks</h5>
        </div>
        <div class="mb-3">
            <div class="mb-3">
                <form @submit.prevent>
                    <div class="mb-3">
                        <div class="card">
                            <div class="card-body pb-0">
                                <div class="row">
                                    <div class="col-4">
                                        <div class="row mb-3">
                                            <label class="col-4 col-form-label">原材料コード</label>
                                            <div class="col">
                                                <input class="form-control" v-model="form.code">
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <label class="col-4 col-form-label">原材料名</label>
                                            <div class="col">
                                                <input class="form-control" v-model="form.name">
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <label class="col-4 col-form-label">ロット</label>
                                            <div class="col">
                                                <input class="form-control" v-model="form.lot">
                                            </div>
                                        </div>
                                        <div class="form-check mb-3">
                                            <input class="form-check-input" id="isVolume" type="checkbox" v-model="form.is_volume">
                                            <label class="form-check-label" for="isVolume">在庫なし含む</label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="row mb-3">
                                            <label class="col-4 col-form-label">幅・長さ</label>
                                            <div class="col">
                                                <div class="row g-2">
                                                    <div class="col">
                                                        <input class="form-control" v-model="form.width" placeholder="幅">
                                                    </div>
                                                    <div class="col">
                                                        <input class="form-control" v-model="form.length" placeholder="長さ">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <label class="col-4 col-form-label">倉庫コード</label>
                                            <div class="col">
                                                <input class="form-control" v-model="form.warehouse_code">
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <label class="col-4 col-form-label">出荷可否区分</label>
                                            <div class="col">
                                                <input class="form-control" v-model="form.stock_status_class">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="row mb-3">
                                            <label class="col-4 col-form-label">発注番号</label>
                                            <div class="col">
                                                <input class="form-control" v-model="form.purchase_number">
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <label class="col-4 col-form-label">受入日</label>
                                            <div class="col">
                                                <div class="row g-2">
                                                    <div class="col">
                                                        <Flatpickr class="form-control" v-model="form.received_from" format="Ymd" placeholder="From" />
                                                    </div>
                                                    <div class="col">
                                                        <Flatpickr class="form-control" v-model="form.received_to" format="Ymd" placeholder="To" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="me-2" :disabled="isLoading" @click="onSearch">検索</button>
                    <button class="me-2" :disabled="isLoading" @click="form = {}">検索条件クリア</button>
                    <button class="ms-2 float-end" type="button" :disabled="isLoading" @click="onExport">検索結果ダウンロード</button>
                </form>
            </div>
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th :class="orderBy('code')" @click="sortBy('code')">原材料コード</th>
                        <th :class="orderBy('name')" @click="sortBy('name')">原材料名</th>
                        <th :class="orderBy('lot')" @click="sortBy('lot')">ロット</th>
                        <th :class="orderBy('barcode')" @click="sortBy('barcode')">バーコード</th>
                        <th :class="orderBy('width')" @click="sortBy('width')">幅</th>
                        <th :class="orderBy('length')" @click="sortBy('length')">長さ</th>
                        <th :class="orderBy('warehouse_code')" @click="sortBy('warehouse_code')">倉庫</th>
                        <th :class="orderBy('stock_status_class')" @click="sortBy('stock_status_class')">可否区分</th>
                        <th :class="orderBy('volume')" @click="sortBy('volume')">在庫数量</th>
                        <th :class="orderBy('purchase_number')" @click="sortBy('purchase_number')">可否区分</th>
                        <th :class="orderBy('received')" @click="sortBy('received')">受入日</th>
                        <th :class="orderBy('claim_number')" @click="sortBy('claim_number')">クレーム番号</th>
                        <th :class="orderBy('remarks')" @click="sortBy('remarks')">備考</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) of paginatedData" :key="index">
                        <td class="text-start">{{ row.code }}</td>
                        <td class="text-start">{{ row.name }}</td>
                        <td class="text-start">{{ row.lot }}</td>
                        <td class="text-start">{{ row.barcode }}</td>
                        <td class="text-end">{{ row.width }}</td>
                        <td class="text-end">{{ row.length }}</td>
                        <td class="text-start">{{ row.warehouse_code }}</td>
                        <td class="text-start">{{ row.stock_status_class }}</td>
                        <td class="text-end">{{ getVolume(row.uom_clas, row.volume) }}</td>
                        <td class="text-start">{{ row.purchase_number }}</td>
                        <td class="text-start">{{ row.received }}</td>
                        <td class="text-start">{{ row.claim_number }}</td>
                        <td class="text-start">{{ row.remarks }}</td>
                    </tr>
                </tbody>
            </table>
            <Pagination :page="page" :pageSize="pageSize" @nextPage="nextPage" @prevPage="prevPage" />
        </div>
    </div>
    <Alert :alerts="alerts" @removeAlert="removeAlert" />
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import Alert from '@/components/Alert';
import Flatpickr from '@/components/Flatpickr';
import Pagination from '@/components/Pagination';
import useLoading from '@/hooks/useLoading';
import useAlert from '@/hooks/useAlert';
import useSort from '@/hooks/useSortWithQuery';
import usePagination from '@/hooks/usePaginationWithQuery';
import api from '@/services/api';

const store = useStore();
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();

const form = ref({});

const items = ref([]);
const { orderBy, sortBy, sortedData } = useSort(items);
const { page, pageSize, nextPage, prevPage, paginatedData } = usePagination(sortedData, 10);

const fetchItems = async () => {
    try {
        store.commit('startLoading');
        const response = await api.get(`/api/material/stocks`, { params: form.value });
        items.value = response;
    } catch (err) {
        addAlert(err.response.statusText, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const getVolume = (uomClass, volume) => {
    switch(uomClass) {
        case '1': return Number(volume).toFixed(3);
        case '2': return Number(volume).toFixed(0);
        case '3': return Number(volume).toFixed(0);
        case '4': return Number(volume).toFixed(3);
        case '5': return Number(volume).toFixed(3);
        case '6': return Number(volume).toFixed(0);
        case '7': return Number(volume).toFixed(0);
        default: return volume;
    }
};

const onSearch = () => {
    page.value = 1;
    items.value = [];
    if (form.value.isVolume) {
        if (!confirm('検索に時間がかかる可能性があります。')) return;
    }
    fetchItems();
};

const onExport = () => {
    let csv = '\ufeff';
    if (sortedData.value.length) {
        for (const index in sortedData.value) {
            const row = sortedData.value[index];
            if (Number(index) === 0) csv += Object.keys(row).join('\t');
            else csv += Object.values(row).join('\t');
            csv += '\n';
        }
        const blob = new Blob([csv], { type: 'text/csv' });
        location.href = URL.createObjectURL(blob);
    }
};
</script>