<template>
  <div class="page-container">
    <h2 class="secondary-heading">Exchange</h2>
    <section class="card-container" v-if="mainCurrency && quoteCurrency">
      <h2 class="secondary-heading">
        Exchange {{ mainCurrency }} to {{ quoteCurrency }}
      </h2>
      <div class="card-content">
        <amount-input
          :label="'You pay'"
          :name="'payAmount'"
          :placeholder="'Pay Amount'"
          :value="payAmount"
          @input="calculateRecieve($event)"
          :options="availableCurrencies"
          @change="changeCurrency($event, 'mainCurrency')"
          :defaultValue="allCurrencies[0]"
        />
        <amount-input
          :label="'You get'"
          :name="'recieveAmount'"
          :placeholder="'Get Amount'"
          :value="recieveAmount"
          @input="calculatePay($event)"
          :options="availableCurrencies"
          @change="changeCurrency($event, 'quoteCurrency')"
          :defaultValue="allCurrencies[1]"
        />
      </div>
    </section>
    <summary-component
      v-if="currentPair && currentRate"
      :currentPair="currentPair"
      :currentRate="currentRate"
      :mainCurrency="mainCurrency"
      :payAmount="payAmount"
      :quoteCurrency="quoteCurrency"
      :recieveAmount="recieveAmount"
    />
  </div>
</template>
<script>
import AmountInput from "../components/Amount/AmountInput.vue";
import SummaryComponent from "../components/Summary.vue";
export default {
  name: "ExchangePage",
  components: {
    AmountInput,
    SummaryComponent,
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
    calculatePay(val) {
      this.recieveAmount = parseFloat(val);
      const converted = Math.fround(val / this.currentRate);
      const commission = Math.round(converted * this.currentPair.commission);
      const result = parseFloat(converted + commission);
      return isNaN(result)
        ? ((this.payAmount = 0), (this.recieveAmount = 0))
        : (this.payAmount = result);
    },
    calculateRecieve(val) {
      this.payAmount = parseFloat(val);
      const converted = val * this.currentRate;
      const commission = converted * this.currentPair.commission;
      const result = parseFloat(converted - commission);
      return isNaN(result)
        ? ((this.recieveAmount = 0), (this.payAmount = 0))
        : (this.recieveAmount = result);
    },
    async refresh() {
      this.timeLeft = 30;
      try {
        await this.$store.dispatch("requestPairs");
        await this.$store.dispatch("requestRates");
      } catch (error) {
        console.log(error);
      }
      this.calculateRecieve();
    },
  },
  watch: {
    timeLeft() {
      if (this.timeLeft === 0) this.refresh();
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("requestCurrencies");
      await this.$store.dispatch("requestPairs");
      await this.$store.dispatch("requestRates");
    } catch (error) {
      console.log(error);
    } finally {
      this.interval = setInterval(() => {
        this.timeLeft -= 1;
      }, 1000);
    }
    this.mainCurrency = this.allCurrencies[0].code;
    this.quoteCurrency = this.allCurrencies[1].code;
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
