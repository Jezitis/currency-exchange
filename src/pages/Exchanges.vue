<template>
  <div class="page-container">
    <h2 class="secondary-heading">Exchange</h2>
    <card
      :heading="`Exchange ${mainCurrency} to ${quoteCurrency}`"
      v-if="mainCurrency && quoteCurrency"
    >
      <template #content>
        <amount-input
          :label="'You pay'"
          :name="'payAmount'"
          :placeholder="'Pay Amount'"
          v-model="payAmountExchanged"
          :options="availableCurrencies"
          @change="changeCurrency($event, 'mainCurrency')"
          :defaultValue="allCurrencies[0]"
        />
        <amount-input
          :label="'You get'"
          :name="'recieveAmount'"
          :placeholder="'Get Amount'"
          v-model="recieveAmountExchanged"
          :options="availableCurrencies"
          @change="changeCurrency($event, 'quoteCurrency')"
          :defaultValue="allCurrencies[1]"
        />
      </template>
    </card>
    <card :heading="'Summary'" v-if="mainCurrency && quoteCurrency">
      <template #content>
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
      </template>
    </card>
  </div>
</template>
<script>
import AmountInput from "../components/Amount/AmountInput.vue";
import Card from "../components/base/Card.vue";
export default {
  name: "ExchangePage",
  components: {
    Card,
    AmountInput,
  },
  data() {
    return {
      mainCurrency: null,
      quoteCurrency: null,
      recieveAmount: null,
      payAmount: null,
      interval: null,
      timeLeft: 30,
    };
  },
  computed: {
    payAmountExchanged: {
      get() {
        return this.payAmount;
      },
      set(val) {
        this.payAmount = parseFloat(val);
        this.calculateRecieve();
      },
    },
    recieveAmountExchanged: {
      get() {
        return this.recieveAmount;
      },
      set(val) {
        this.recieveAmount = parseFloat(val);
        this.calculatePay();
      },
    },
    allCurrencies() {
      return this.$store.getters.getCurrencies;
    },
    availableCurrencies() {
      return this.allCurrencies.filter(
        (item) =>
          item.code != this.mainCurrency && item.code != this.quoteCurrency
      );
    },
    currentPair() {
      return this.$store.getters.getCurrencyPairs.find(
        (item) =>
          item.mainCurrency == this.mainCurrency &&
          item.quoteCurrency == this.quoteCurrency
      );
    },
    currentRate() {
      return this.$store.getters.getExchangeRates.find(
        (item) =>
          item.from == this.mainCurrency && item.to == this.quoteCurrency
      ).rate;
    },
  },
  methods: {
    changeCurrency(currency, dataName) {
      if (dataName === "mainCurrency") {
        this.mainCurrency = currency;
        this.calculatePay();
      }
      if (dataName === "quoteCurrency") {
        this.quoteCurrency = currency;
        this.calculateRecieve();
      }
    },
    calculatePay() {
      const converted = Math.fround(this.recieveAmount / this.currentRate);
      const commission = Math.round(converted * this.currentPair.commission);
      const result = parseFloat(converted + commission);
      return isNaN(result)
        ? ((this.payAmount = 0), (this.recieveAmount = 0))
        : (this.payAmount = result);
    },
    calculateRecieve() {
      const converted = this.payAmount * this.currentRate;
      const commission = converted * this.currentPair.commission;
      const result = parseFloat(converted - commission);
      return isNaN(result)
        ? ((this.recieveAmount = 0), (this.payAmount = 0))
        : (this.recieveAmount = parseFloat(result));
    },
    async refresh() {
      this.timeLeft = 30;
      await this.$store.dispatch("requestPairs");
      await this.$store.dispatch("requestRates");
      this.calculateRecieve();
    },
  },
  watch: {
    timeLeft() {
      if (this.timeLeft === 0) this.refresh();
    },
  },
  async mounted() {
    await this.$store.dispatch("requestCurrencies");
    await this.$store.dispatch("requestPairs");
    await this.$store.dispatch("requestRates");
    this.mainCurrency = this.allCurrencies[0].code;
    this.quoteCurrency = this.allCurrencies[1].code;
    this.interval = setInterval(() => {
      this.timeLeft -= 1;
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
