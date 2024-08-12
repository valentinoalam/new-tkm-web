const state = {
  transactions: [],
};

const mutations = {
  SET_TRANSACTIONS(state, transactions) {
    state.transactions = transactions;
  },
};

const actions = {
  fetchTransactions({ commit }) {
    // Logic to fetch transactions
    const transactions = []; // Replace with actual API call
    commit('SET_TRANSACTIONS', transactions);
  },
};

const getters = {
  transactions: state => state.transactions,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
