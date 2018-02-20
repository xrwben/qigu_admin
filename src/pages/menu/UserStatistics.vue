<template>
  <div id="UserStatistics">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="企业统计" name="EnterpriseStatistics">
            <enterprise-statistics v-if="activeName === 'EnterpriseStatistics'"></enterprise-statistics>
          </el-tab-pane>
          <el-tab-pane label="人员统计" name="PersonnelStatistics">
            <personnel-statistics v-if="activeName === 'PersonnelStatistics'"></personnel-statistics>
          </el-tab-pane>
          <el-tab-pane label="持股平台统计" name="PlatformStatistics">
            <platform-statistics v-if="activeName === 'PlatformStatistics'"></platform-statistics>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import EnterpriseStatistics from '../../components/tabNav/userStatistics/EnterpriseStatistics.vue'
  import PersonnelStatistics from '../../components/tabNav/userStatistics/PersonnelStatistics.vue'
  import PlatformStatistics from '../../components/tabNav/userStatistics/PlatformStatistics.vue'
  export default {
    data () {
      return {
        activeName: 'EnterpriseStatistics'
      }
    },
    components: {
      EnterpriseStatistics,
      PersonnelStatistics,
      PlatformStatistics
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
