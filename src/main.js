import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib';
import router from "@/router";
import VueLazyload from "vue-lazyload";
import { firestorePlugin } from "vuefire";
import store from "./store";
import VueOnlineProp from "vue-online-prop"

Vue.config.productionTip = false;

Vue.use(VueOnlineProp)
Vue.use(VueLazyload);
Vue.use(firestorePlugin);
Vue.use(VueTelInputVuetify, {
  vuetify,
});

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
