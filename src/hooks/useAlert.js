import { ref } from 'vue';

const useAlert = () => {
    const alerts = ref([]);

    const addAlert = (content, type = 'info') => {
        const id = Date.now();
        alerts.value.push({ id, content, type });
        setTimeout(() => removeAlert(id), 5000);
    };

    const removeAlert = (id) => {
        const index = alerts.value.findIndex(item => item.id === id);
        if (index !== -1) alerts.value.splice(index, 1);
    };

    return {
        alerts,
        addAlert,
        removeAlert,
    };
};

export default useAlert;