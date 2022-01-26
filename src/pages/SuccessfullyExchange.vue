<template>
  <div class="page-container">
    <section class="card-container">
      <h2 class="secondary-heading">
        SUCCESS
      </h2>
        <img src="..\..\src\assets\success.png" alt="Exchange was successfull" />
        <button class="btn-exchange dblock" @click="$router.push('/')">
          Home
        </button>
    </section>
  </div>
</template>
<script>
export default {
  name: "SuccessfullExchange",
};
</script>
