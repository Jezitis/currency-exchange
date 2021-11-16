<template>
  <div class="amount-block">
    <label class="input__label" :for="name" v-if="label">{{ label }}</label>
    <input
      :id="name"
      :name="name"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
      v-numonly
      class="input__field"
    />
    <dropdown
      :options="options"
      @change="$emit('change', $event, 'mainCurrency')"
      :defaultValue="defaultValue"
    />
  </div>
</template>
<script>
import Dropdown from "../base/Dropdown.vue";

export default {
  name: "AmountInput",
  components: {
    Dropdown,
  },
  props: {
    label: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Type here",
    },
    value: {
      type: Number,
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: Object,
    },
  },
  data() {
    return {};
  },
};
</script>
