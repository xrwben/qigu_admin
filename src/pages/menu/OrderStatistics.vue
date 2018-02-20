<template>
  <div id="OrderStatistics">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="订单统计" name="OrderStatistics">
            <order-statistics v-if="activeName === 'OrderStatistics'"></order-statistics>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import OrderStatistics from '../../components/tabNav/orderStatistics/OrderStatistics.vue'
  export default {
    data () {
      return {
        activeName: 'OrderStatistics'
      }
    },
    components: {
      OrderStatistics
    },
    methods: {
      getDatas (tab) {
        console.log(tab.index)
      }
    }
  }
</script>

<style>

</style>
