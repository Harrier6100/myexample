import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const usePaginationWithQuery = (tableData, perSize) => {
    const route = useRoute();
    const router = useRouter();
    const page = ref(1);

    const pageSize = computed(() => {
        return Math.ceil(tableData.value.length / perSize);
    });

    const nextPage = () => {
        if (page.value < pageSize.value) page.value++;
    };

    const prevPage = () => {
        if (page.value > 1) page.value--;
    };

    const paginatedData = computed(() => {
        const startIndex = (page.value - 1) * perSize;
        const endIndex = startIndex + perSize;
        return tableData.value.slice(startIndex, endIndex);
    });

    onMounted(() => {
        if (route.query.page) {
            page.value = route.query.page;
        }
    });

    const updatePage = () => {
        router.replace({
            query: {
                ...route.query,
                page: page.value,
            },
        });
    };
    watch(page, updatePage);

    return {
        page,
        pageSize,
        nextPage,
        prevPage,
        paginatedData,
    };
};

export default usePaginationWithQuery;