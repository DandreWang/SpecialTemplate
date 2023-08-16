<template>
  <div class="search-group">

    <slot :loading="loading" :search="searchHandler" name="form" />

    <slot name="top" />

    <el-table
      v-loading.lock="loading"
      ref="table"
      :data="tableData"
      :border="border"
      :size="size"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      :fit="fit"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :current-row-key="currentRowKey"
      :row-class-name="rowClassName"
      :row-style="rowStyle"
      :row-ket="rowKey"
      :empty-text="emptyText"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :default-sort="defaultSort"
      :tooltip-effect="tooltipEffect"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :style="tableStyle"
      @select="(selection, row) => emitEventHandler('select', selection, row)"
      @select-all="selection => emitEventHandler('select-all', selection,ref)"
      @selection-change="selection => emitEventHandler('selection-change', selection)"
      @cell-mouse-enter="(row, column, cell, event) => emitEventHandler('cell-mouse-enter', row, column, cell, event)"
      @cell-mouse-leave="(row, column, cell, event) => emitEventHandler('cell-mouse-leave', row, column, cell, event)"
      @cell-click="(row, column, cell, event) => emitEventHandler('cell-click', row, column, cell, event)"
      @cell-dblclick="(row, column, cell, event) => emitEventHandler('cell-dblclick', row, column, cell, event)"
      @row-click="(row, event, column) => emitEventHandler('row-click', row, event, column)"
      @row-dblclick="(row, event) => emitEventHandler('row-dblclick', row, event)"
      @row-contextmenu="(row, event) => emitEventHandler('row-contextmenu', row, event)"
      @header-click="(column, event) => emitEventHandler('header-click', column, event)"
      @sort-change="args => emitEventHandler('sort-change', args)"
      @filter-change="filters => emitEventHandler('filter-change', filters)"
      @current-change="(currentRow, oldCurrentRow) => emitEventHandler('current-change', currentRow, oldCurrentRow)"
      @header-dragend="(newWidth, oldWidth, column, event) => emitEventHandler('header-dragend', newWidth, oldWidth, column, event)"
      @expand-change="(row, expanded) => emitEventHandler('expand-change', row, expanded)" >

      <slot name="prepend" />

      <template v-for="(column, columnIndex) in columns">
        <el-table-column v-if="column.isHtml" v-bind="column" :key="columnIndex">
          <template slot-scope="scope">
            <div v-html="column.isHtml"/>
          </template>
        </el-table-column>
        <el-table-column v-else v-bind="column" :key="columnIndex" :label-class-name="column.isHtml"/>
      </template>

      <slot name="append" />

    </el-table>
    <div
      v-if="showPagination"
      style="margin-top: 10px;">
      <el-pagination
        :current-page="pagination.pageIndex"
        :page-sizes="pageSizes"
        :page-size="pagination.pageSize"
        :layout="paginationLayout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

    <slot name="bottom" />

  </div>
</template>
<script>
import Vue from 'vue'
import props from './props'

export default {
  name: 'SearchTablePagination',
  props,
  data() {
    const _this = this
    const { baseParams } = this
    return {
      Vue,
      pagination: {
        pageIndex: 1,
        pageSize: (() => {
          const { pageSizes } = _this
          return pageSizes.length > 0 ? pageSizes[0] : 20
        })()
      },
      params: { ...baseParams },
      total: 0,
      loading: false,
      tableData: [],
      cacheLocalData: []
    }
  },
  watch: {
    data: function(value) {
      this.loadLocalData(value)
    }
  },
  mounted() {
    // event: expand changed to `expand-change` in Element v2.x
    this.$refs['table'].$on('expand', (row, expanded) => this.emitEventHandler('expand', row, expanded))
    const { type, autoLoad, data, formOptions, params } = this
    if (type === 'remote' && autoLoad) {
      if (formOptions) {
        this.handleReload(params)
      } else {
        this.fetchHandler(params)
      }
    } else if (type === 'local') {
      this.loadLocalData(data)
    }
  },
  methods: {
    // 更改基础参数
    handleSetBaseParams(obj) {
      this.params = { ...this.params, ...obj }
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.dataChangeHandler()
    },
    handleCurrentChange(pageIndex) {
      this.pagination.pageIndex = pageIndex
      this.dataChangeHandler()
    },
    handleReload(params = {}) {
      this.$refs.searchForm.getParams((formParams) => {
        this.fetchHandler(Object.assign(formParams, params))
      })
    },
    searchHandler(resetPageIndex = true) {
      if (resetPageIndex) {
        this.pagination.pageIndex = 1
      }
      this.dataChangeHandler(arguments[0])
    },
    dataChangeHandler() {
      const { type } = this
      if (type === 'local') {
        this.dataFilterHandler(arguments[0])
      } else if (type === 'remote') {
        this.fetchHandler(arguments[0])
      }
    },
    dataFilter(data) {
      const { pageIndex, pageSize } = this.pagination
      return data.filter((v, i) => {
        return i >= (pageIndex - 1) * pageSize && i < pageIndex * pageSize
      })
    },
    dataFilterHandler(formParams) {
      const { cacheLocalData, params } = this
      const mergeParams = Object.assign(params, formParams)
      const validParamKeys = Object.keys(mergeParams).filter(v => {
        return mergeParams[v] !== undefined && mergeParams[v] !== ''
      })
      const searchForm = this.$refs['searchForm']
      let paramFuzzy
      if (searchForm) {
        paramFuzzy = searchForm.getParamFuzzy()
      }

      if (validParamKeys.length > 0) {
        const validData = cacheLocalData.filter(v => {
          const valids = []
          validParamKeys.forEach(vv => {
            if (typeof v[vv] === 'number') {
              valids.push(
                paramFuzzy && paramFuzzy[vv] ? (String(v[vv]).indexOf(String(mergeParams[vv])) !== -1)
                  : (String(v[vv]) === String(mergeParams[vv]))
              )
            } else {
              valids.push(
                paramFuzzy && paramFuzzy[vv] ? (v[vv].indexOf(mergeParams[vv]) !== -1) : (v[vv] === mergeParams[vv])
              )
            }
          })
          return valids.every(vvv => {
            return vvv
          })
        })

        this.tableData = this.dataFilter(validData)
        this.total = validData.length
      } else {
        this.total = cacheLocalData.length
        this.tableData = this.dataFilter(cacheLocalData)
      }
    },
    fetchHandler(formParams = {}) {
      this.loading = true
      let { params } = this
      const { listField, pageIndexKey, pageSizeKey,
        totalField, showPagination,
        url, pagination, http } = this
      params = JSON.parse(JSON.stringify(Object.assign(params, formParams)))
      if (showPagination) {
        params = {
          ...params,
          [pageIndexKey]: pagination.pageIndex,
          [pageSizeKey]: pagination.pageSize
        }
      }
      http.request(url, params, { loadKey: 'tableLoading' }).then(response => {
        let result = response
        if (response && !(response instanceof Array)) {
          if (listField && listField.indexOf('.') !== -1) {
            listField.split('.').forEach(vv => {
              result = result[vv]
            })
          } else {
            result = response[listField]
          }
        }

        if (!result || !(result instanceof Array)) {
          this.loading = false
          throw new Error(`The result of key:${listField} is not Array.`)
        }

        if (this.dataHandler) {
          this.tableData = result.map(this.dataHandler)
        } else {
          this.tableData = result
        }

        let totalValue = response
        if (Object.prototype.toString.call(response) === '[object Array]') {
          totalValue = response.length
        } else if (typeof response === 'object') {
          if (totalField && totalField.indexOf('.') !== -1) {
            totalField.split('.').forEach(vv => {
              totalValue = totalValue[vv]
            })
          } else {
            totalValue = response[totalField]
          }
        } else {
          totalValue = 0
        }
        this.total = totalValue

        this.loading = false
      }).catch(error => {
        console.error('Get remote data failed. ', error)
        this.loading = false
      })
    },
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
      // debugger
    },
    loadLocalData(data) {
      const { autoLoad } = this
      if (!data) {
        this.showPagination = false
        throw new Error(`When the type is 'local', you must set attribute 'data' and 'data' must be a array.`)
      }
      const cacheData = JSON.parse(JSON.stringify(data))
      this.cacheLocalData = cacheData
      if (autoLoad) {
        this.tableData = this.dataFilter(cacheData)
        this.total = cacheData.length
      }
    }
  }
}
</script>
