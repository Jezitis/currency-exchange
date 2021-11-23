<template>
  <div class="page-container">
    <h2 class="secondary-heading">Exchange</h2>
    <card
      :heading="`Exchange ${mainCurrency.name} to ${quoteCurrency.name}`"
      v-if="mainCurrency && quoteCurrency"
    >
      <template #content>
        <amount-input
          :label="'You pay'"
          :name="'payAmount'"
          :placeholder="'Pay Amount'"
          v-model="payAmountExchanged"
          :options="currencyOptions"
          @change="changeCurrency($event, 'mainCurrency')"
        />
        <amount-input
          :label="'You get'"
          :name="'recieveAmount'"
          :placeholder="'Get Amount'"
          v-model="recieveAmountExchanged"
          :options="currencyOptions"
          @change="changeCurrency($event, 'quoteCurrency')"
          :defaultValue="currencyOptions[1]"
        />
      </template>
    </card>
    <card :heading="'Summary'" v-if="mainCurrency && quoteCurrency">
      <template #content>
        <div class="summary">
          <div class="summary-info">
            <p class="summary-info__line">
              You pay: <span> {{ payAmount }} {{ mainCurrency.name }}</span>
            </p>
            <p class="summary-info__line">
              You get: <span>{{ recieveAmount }} {{ quoteCurrency.name }}</span>
            </p>
            <p class="summary-info__line">
              Exchange Rate:
              <span>
                1 {{ mainCurrency.name }} =
                {{ mainCurrency.rate[quoteCurrency.name] }}
                {{ quoteCurrency.name }}
              </span>
            </p>
            <p class="summary-info__line">
              Commision: <span>{{ mainCurrency.commision * 100 }}%</span>
            </p>
          </div>
          <button class="btn-exchange">Exchange</button>
        </div>
      </template>
    </card>
  </div>
</template>
<script>
import { CURRENCIES } from "../data/currencies";
import { COMMISSIONS } from '../data/commissions';
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
      currencyOptions: [
        {
          name: "EUR",
          id: 1,
          commision: 0.1,
          rate: {
            USD: 1.2,
            EUR: 1,
          },
        },
        {
          name: "USD",
          id: 2,
          commision: 0.2,
          rate: {
            USD: 1,
            EUR: 0.8,
          },
        },
      ],
      mainCurrency: null,
      quoteCurrency: null,
      recieveAmount: null,
      payAmount: null,
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
      let result = parseFloat(
        this.recieveAmount * this.quoteCurrency.rate[this.mainCurrency.name] +
          this.recieveAmount * this.quoteCurrency.commision
      ).toFixed(2);
      return isNaN(result)
        ? ((this.payAmount = 0), (this.recieveAmount = 0))
        : (this.payAmount = parseFloat(result));
    },
    calculateRecieve() {
      let result = parseFloat(
        this.payAmount * this.mainCurrency.rate[this.quoteCurrency.name] -
          this.payAmount * this.mainCurrency.commision
      ).toFixed(2);
      return isNaN(result)
        ? ((this.recieveAmount = 0), (this.payAmount = 0))
        : (this.recieveAmount = parseFloat(result));
    },
    getCurrencyPairs() {
      let currencyPairs = CURRENCIES.map((item) => {
        return CURRENCIES.map((curr) => {
          return {
            mainCurrency: item.code,
            quoteCurrency: curr.code,
            commission: COMMISSIONS[Math.floor(Math.random() * COMMISSIONS.length)]
          };
        });
      });
      currencyPairs = currencyPairs
        .flat(1)
        .filter((item) => item.mainCurrency !== item.quoteCurrency);
      return currencyPairs;
    },
    getExchangeRates() {
      let rates = this.getCurrencyPairs().map((item) => {
        return {
          from: item.mainCurrency,
          to: item.quoteCurrency,
          rate: parseFloat((Math.random() * 100).toFixed(2)),
        }
      });
      return rates
    }
  },
  mounted() {
    this.mainCurrency = this.currencyOptions[0];
    this.quoteCurrency = this.currencyOptions[1];
    this.getCurrencyPairs();
    this.getExchangeRates();
  },
};
</script>
