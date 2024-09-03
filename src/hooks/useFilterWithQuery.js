import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useFilterWithQuery = (tableData) => {
    const route = useRoute();
    const router = useRouter();
    const filterValue = ref('');

    const filteredData = computed(() => {
        return tableData.value.filter(row => 
            Object.values(row).some(value => 
                value && value.toString().toLowerCase().includes(filterValue.value.toLowerCase())
            )
        )
    });

    onMounted(() => {
        if (route.query.filter) {
            filterValue.value = route.query.filter;
        }
    });

    const updateFilterValue = () => {
        router.replace({
            query: {
                ...route.query,
                filter: filterValue.value,
            },
        });
    };
    watch(filterValue, updateFilterValue);

    return {
        filterValue,
        filteredData,
    };
};

export default useFilterWithQuery;