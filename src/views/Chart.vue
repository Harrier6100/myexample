<template>
    <div class="container-fluid">
        <Flatpickr v-model="form.startDate" placeholder="From" />
        <Flatpickr v-model="form.endDate" placeholder="To" />
        <button @click="onSearch" :disabled="isLoading">表示</button>
        <canvas ref="chartRef"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import useLoading from '@/hooks/useLoading';
import Flatpickr from '@/components/Flatpickr';
import api from '@/services/api';
import moment from 'moment';
import Chart from 'chart.js/auto';

const store = useStore();
const { isLoading } = useLoading();

const form = ref({
    startDate: null,
    endDate: null,
});

const chartRef = ref(null);
const myChart = ref(null);
const labels = ref([]);
const no1UWAZikuCounters = ref([]);
const no1UWBZikuCounters = ref([]);
const no2UWAZikuCounters = ref([]);
const no2UWBZikuCounters = ref([]);
const wdAZikuCounters = ref([]);
const wdBZikuCounters = ref([]);

onMounted(() => {

});

const fetchItems = async () => {
    try {
        store.commit('startLoading');
        const response = await api.get(`api/opdata/as12`, { params: form.value });
        const filteredData = response.filter((_, index) => index % 60 === 0);
        labels.value = filteredData.map((row) => moment(row.id).format('YYYY-MM-DD HH:mm'));
        no1UWAZikuCounters.value = filteredData.map((row) => row.no1_uw_a_ziku_counter);
        no1UWBZikuCounters.value = filteredData.map((row) => row.no1_uw_b_ziku_counter);
        no2UWAZikuCounters.value = filteredData.map((row) => row.no2_uw_a_ziku_counter);
        no2UWBZikuCounters.value = filteredData.map((row) => row.no2_uw_b_ziku_counter);
        wdAZikuCounters.value = filteredData.map((row) => row.wd_a_ziku_counter);
        wdBZikuCounters.value = filteredData.map((row) => row.wd_b_ziku_counter);
        initializeChart();
    } catch (err) {
        console.log(err);
    } finally {
        store.commit('stopLoading');
    }
};

const initializeChart = () => {
    if (myChart.value) {
        myChart.value.destroy();
    }
    myChart.value = new Chart(chartRef.value, {
        type: 'line',
        data: {
            labels: labels.value,
            datasets: [
                {
                    label: 'No1UWA軸カウンター',
                    data: no1UWAZikuCounters.value,
                },
                {
                    label: 'No1UWB軸カウンター',
                    data: no1UWBZikuCounters.value,
                },
                {
                    label: 'No2UWA軸カウンター',
                    data: no2UWAZikuCounters.value,
                },
                {
                    label: 'No2UWB軸カウンター',
                    data: no2UWBZikuCounters.value,
                },
                {
                    label: 'WDA軸カウンター',
                    data: wdAZikuCounters.value,
                },
                {
                    label: 'WDB軸カウンター',
                    data: wdBZikuCounters.value,
                },
            ],
        },
    });
};

const onSearch = () => {
    fetchItems();
};
</script>