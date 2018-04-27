import Vue from 'vue'
import Router from 'vue-router'
import HelloD3 from '@/view/HelloD3'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloD3',
      component: HelloD3
    }
  ]
})
