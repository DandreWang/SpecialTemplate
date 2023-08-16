const app = {
  state: {
    loading: {},
    authValid: false
  },
  getters: {
    loading: ({ loading }) => loading,
    singleLoading: ({ loading }) => key => loading[key],
    authValid: ({ authValid }) => authValid
  },
  mutations: {
    SET_LOADING(state, opt) {
      let obj = { main: opt }
      if (typeof opt === 'object') {
        const { key, flg } = opt
        obj = {
          main: flg,
          [key]: flg
        }
      }
      state.loading = {
        ...state.loading,
        ...obj
      }
    },
    SET_AUTHVALID(state, opt) {
      state.authValid = opt
    }
  },
  actions: {
    SetLoading({ commit }, opt) {
      commit('SET_LOADING', opt)
    },
    SetAuthValid({ commit }, opt) {
      commit('SET_AUTHVALID', opt)
    }
  }
}

export default app
