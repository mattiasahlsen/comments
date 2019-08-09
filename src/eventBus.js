import Vue from 'vue'
const eventBus = new Vue()
window.onresize = () => eventBus.$emit('resize')

export default eventBus
