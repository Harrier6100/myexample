import { ref } from 'vue';

const useStackItem = () => {
    const items = ref([]);

    const addItem = (item) => {
        items.value.push(item);
    };

    const pushItem = (item, index) => {
        items.value.splice(index + 1, 0, item);
    };

    const moveItem = (index, newIndex) => {
        if (newIndex < 0) return;
        const item = items.value.splice(index, 1)[0];
        items.value.splice(newIndex, 0, item);
    };

    const removeItem = (index) => {
        items.value.splice(index, 1);
    };

    return {
        items,
        addItem,
        pushItem,
        moveItem,
        removeItem,
    };
};

export default useStackItem;