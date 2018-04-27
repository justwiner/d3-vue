<template>
  <div id="app">
    <comp-title />
    <router-view/>
  </div>
</template>

<script>
import CompTitle from './view/Title'
export default {
  name: 'App',
  components: {
    CompTitle
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0 10%
}
</style>
