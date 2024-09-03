import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'flatpickr/dist/flatpickr.min.css';
import '@/assets/index.css';

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');