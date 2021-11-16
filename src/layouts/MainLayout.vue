<template>
  <div class="main-layout">
    <transition name="fade" mode="out-in">
      <exchanges />
    </transition>
  </div>
</template>
<script>
import Exchanges from "../pages/Exchanges.vue";
export default {
  name: "MainLayout",
  components: {
    Exchanges,
  },
};
</script>
