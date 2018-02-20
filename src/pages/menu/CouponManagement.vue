<template>
  <div id="CouponManagement">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="优惠券使用统计" name="CouponStatistics">
            <coupon-statistics v-if="activeName === 'CouponStatistics'"></coupon-statistics>
          </el-tab-pane>
          <el-tab-pane label="优惠券列表" name="CouponList">
            <coupon-list v-if="activeName === 'CouponList'"></coupon-list>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CouponStatistics from '../../components/tabNav/couponManagement/CouponStatistics.vue'
  import CouponList from '../../components/tabNav/couponManagement/CouponList.vue'
  export default {
    data () {
      return {
        activeName: 'CouponStatistics'
      }
    },
    components: {
      CouponStatistics,
      CouponList
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
