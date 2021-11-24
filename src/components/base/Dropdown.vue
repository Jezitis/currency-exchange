<template>
  <div class="dropdown" @blur="show = false">
    <div
      class="dropdown__selected"
      :class="{ open: show }"
      @click="show = !show"
    >
      {{ selected }}
    </div>
    <div class="dropdown__options" :class="{ selectHide: !show }">
      <div
        v-for="(option, index) in options"
        :key="option.code ? option.code : index"
        @click="choose(option)"
      >
        {{ option.code }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  props: {
    options: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: Object,
    },
  },
  data() {
    return {
      selected: this.defaultValue
        ? this.defaultValue.code
        : this.options[0].code,
      show: false,
    };
  },
  methods: {
    choose(option) {
      this.selected = option.code;
      this.show = false;
      this.$emit("change", option.code);
    },
  },
};
</script>
