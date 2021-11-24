import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currencies: null,
    currencyPairs: null,
    exchangeRates: null,
  },
  mutations: {
    setCurrencies: (state, currencies) => {
      state.currencies = currencies;
    },
    setCurrencyPairs: (state, pairs) => {
      state.currencyPairs = pairs;
    },
    setExchangeRates: (state, rates) => {
      state.exchangeRates = rates;
    },
  },
  actions: {
    requestCurrencies: async ({ commit }) => {
      try {
        const res = await axios.get(
          "assets/currencies.json", { baseURL: window.location.origin }
        );
        const currencies = JSON.stringify(res.data);
        commit("setCurrencies", JSON.parse(currencies));
      } catch (err) {
        console.log(err);
      }
    },
    requestPairs: async ({ state, commit }) => {
      try {
        const currencies = state.currencies;
        const res = await axios.get(
          "assets/commissions.json", { baseURL: window.location.origin }
        );
        const commisions = JSON.parse(JSON.stringify(res.data));
        let currencyPairs = currencies.map((item) => {
          return currencies.map((curr) => {
            return {
              mainCurrency: item.code,
              quoteCurrency: curr.code,
              commission:
                commisions[
                  Math.floor(Math.random() * commisions.length)
                ].value,
            };
          });
        });
        currencyPairs = currencyPairs
          .flat(1)
          .filter((item) => item.mainCurrency !== item.quoteCurrency);
        commit("setCurrencyPairs", currencyPairs);
      } catch (err) {
        console.log(err);
      }
    },
    requestRates: async ({ state, commit }) => {
      try {
        let currencyPairs = state.currencyPairs;
        const rates = currencyPairs.map((item) => {
          return {
            from: item.mainCurrency,
            to: item.quoteCurrency,
            rate: parseFloat((Math.random() * 100).toFixed(2)),
          };
        });
        commit("setExchangeRates", rates);
      } catch (err) {
        console.log(err);
      }
    },
  },
  getters: {
    getCurrencies: state => state.currencies,
    getCurrencyPairs: state => state.currencyPairs,
    getExchangeRates: state => state.exchangeRates,
  },
});
