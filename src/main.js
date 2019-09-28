// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iconfont from './assets/iconfont/iconfont.css'


//全局注册
import Router from 'vue-router'
import axios from 'axios'
// import VueAxios from 'vue-axios'


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers["Content-Type"] ="application/x-www-form-urlencoded";
Vue.config.productionTip = false;
Vue.prototype.axios = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  iconfont
})
