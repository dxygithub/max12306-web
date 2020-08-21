// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'// 引入elementui-css
import common from '../src/assets/js/common'

Vue.use(elementui)
Vue.config.productionTip = false
// 全局公用组件
Vue.prototype.$common = common
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
