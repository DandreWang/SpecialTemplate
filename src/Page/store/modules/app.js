const app = {
  state: {
    loading: {},
    baseInfo: null
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
    SET_BASEINFO(state, opt) {
      state.baseInfo = JSON.parse(JSON.stringify(opt))
    }
  },
  actions: {
    SetLoading({ commit }, opt) {
      commit('SET_LOADING', opt)
    },
    SetBaseInfo({ commit }, opt) {
      commit('SET_BASEINFO', opt)
    }
  }
}

export default app
