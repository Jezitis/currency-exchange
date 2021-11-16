<template>
  <section class="card-container">
    <h2 class="secondary-heading">{{ heading }}</h2>
    <div class="card-content">
      <slot :name="'content'"></slot>
    </div>
  </section>
</template>
<script>
export default {
  name: "BaseCard",
  props: {
    heading: {
      type: String,
      default: "Card heading",
    },
  },
  data() {
    return {};
  },
};
</script>
