import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import ApiService from '@/services/ApiService';
import {TokenService} from '@/services/TokenService';

Vue.config.productionTip = false;

ApiService.init(process.env.VUE_APP_ROOT_API);

if (TokenService.getToken()) {
  ApiService.setHeader();
  ApiService.mount401Interceptor();
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
