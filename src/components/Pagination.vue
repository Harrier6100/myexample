<template>
    <div class="pagination float-end">
        <div class="ms-2 me-3">{{ page }} - {{ pageSize }}</div>
        <a class="me-2" href="#" @click="prevPage"><i class="bi bi-chevron-left"></i></a>
        <a class="me-2" href="#" @click="nextPage"><i class="bi bi-chevron-right"></i></a>
    </div>
</template>

<script>
export default {
    props: {
        page: {
            type: [Number, String],
            default: 1,
        },
        pageSize: {
            type: [Number, String],
            default: 0,
        },
    },
    setup(props, { emit }) {
        const nextPage = () => emit('nextPage');
        const prevPage = () => emit('prevPage');
        return {
            nextPage,
            prevPage,
        };
    },
};
</script>