import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false;

Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: 'mdi'
})

new Vue({
  router,
  store,
  vuetify,
  created() {
    const userString = localStorage.getItem('auth')
    if (userString) {
      const userData = JSON.parse(userString);
      this.$store.commit('Login/SET_AUTH_USER', userData);
    }
    const regEventsString = localStorage.getItem('events_registered');
    if (regEventsString) {
      const regEvents = JSON.parse(regEventsString);
      this.$store.commit('Events/GET_REGISTERED_EVENTS_LIST', regEvents);
    }

    this.$store.dispatch('Destinations/get_destinations');
    this.$store.dispatch('Destinations/get_categories');
  },
  render: h => h(App)
}).$mount("#app");
