const getters = {
  loading: state => state.app.loading,
  singleLoading: state => key => state.app.loading[key],
  baseInfo: state => state.app.baseInfo
}
export default getters
