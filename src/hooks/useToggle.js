import { ref } from 'vue';

const useToggle = () => {
    const isShow = ref(false);

    const show = () => {
        isShow.value = true;
    };

    const hide = () => {
        isShow.value = false;
    };

    return {
        isShow,
        show,
        hide,
    };
};

export default useToggle;