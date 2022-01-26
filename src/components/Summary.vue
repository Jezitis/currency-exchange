<template>
  <section class="card-container" v-if="mainCurrency && quoteCurrency">
    <h2 class="secondary-heading">Summary</h2>
    <div class="card-content">
      <div class="summary">
          <div class="summary-info">
            <p class="summary-info__line">
              You pay: <span> {{ payAmount }} {{ mainCurrency }}</span>
            </p>
            <p class="summary-info__line">
              You get: <span>{{ recieveAmount }} {{ quoteCurrency }}</span>
            </p>
            <p class="summary-info__line">
              Exchange Rate:
              <span>
                1 {{ mainCurrency }} =
                {{ currentRate }}
                {{ quoteCurrency }}
              </span>
            </p>
            <span class="summary-info__line summary-info__line--small"
              >* rates will update every 30 seconds</span
            >
            <p class="summary-info__line">
              Commission: <span>{{ currentPair.commission * 100 }}%</span>
            </p>
          </div>
          <button
            class="btn-exchange"
            @click="$router.push('/success')"
            :disabled="!recieveAmount || !payAmount"
          >
            Exchange
          </button>
        </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'Summary',
  props: {
    mainCurrency: {
      type: String,
      required: true
    },
    quoteCurrency: {
      type: String,
      required: true
    },
    payAmount: {
      type: Number,
      default: 0
    },
    recieveAmount: {
      type: Number,
      default: 0
    },
    currentRate: {
      type: Number,
      default: 0
    },
    currentPair: {
      type: Object,
      required: true
    }
  }
}
</script>