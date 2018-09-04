import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
new Vue({
  render: h => h(App),
  filters:{
    g1(){
      return 1
    },
    
  }
}).$mount('#app')
