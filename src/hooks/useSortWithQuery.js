import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useSortWithQuery = (tableData) => {
    const route = useRoute();
    const router = useRouter();
    const sort = ref(null);
    const sortOrder = ref(null);

    const orderBy = (key) => {
        return {
            asc: sort.value === key && sortOrder.value === 'asc',
            desc: sort.value === key && sortOrder.value === 'desc',
        };
    };

    const sortBy = (key) => {
        if (sort.value === key) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
        } else {
            sort.value = key;
            sortOrder.value = 'asc';
        }
    };

    const sortedData = computed(() => {
        return tableData.value.slice().sort((a, b) => {
            const aValue = a[sort.value];
            const bValue = b[sort.value];
            const set = sortOrder.value === 'asc' ? 1 : -1;

            if (aValue === null && bValue !== null) return set *  1;
            if (aValue !== null && bValue === null) return set * -1;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return set * (aValue - bValue);
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return set * aValue.localeCompare(bValue, 'ja', { sensitivity: 'base' });
            }

            const aNumber = Number(aValue);
            const bNumber = Number(bValue);
            if (!isNaN(aNumber) && !isNaN(bNumber)) {
                return set * (aNumber - bNumber);
            }

            if (aValue < bValue) return set * -1;
            if (aValue > bValue) return set *  1;
            return 0;
        });
    });

};

export default useSortWithQuery;