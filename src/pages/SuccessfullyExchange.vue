<template>
  <div class="page-container">
    <card heading="SUCCESS">
      <template #content>
        <img src="..\..\src\assets\success.png" alt="Exchange was successfull" />
        <button class="btn-exchange dblock" @click="$router.push('/')">
          Home
        </button>
      </template>
    </card>
  </div>
</template>
<script>
import Card from "../components/base/Card.vue";
export default {
  name: "SuccessfullExchange",
  components: {
    Card,
  },
};
</script>
