<template>
  <div id="DataStatistics">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="激励计划统计" name="EncouragePlane">
            <encourage-plane v-if="activeName === 'EncouragePlane'"></encourage-plane>
          </el-tab-pane>
          <el-tab-pane label="授予分红股统计" name="PersonnelStatistics">
            <grant-share-award v-if="activeName === 'PersonnelStatistics'"></grant-share-award>
          </el-tab-pane>
          <el-tab-pane label="授予受限股统计" name="PlatformStatistics">
            <grant-restricted v-if="activeName === 'PlatformStatistics'"></grant-restricted>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import EncouragePlane from '../../components/tabNav/dataStatistics/EncouragePlane.vue'
  import GrantShareAward from '../../components/tabNav/dataStatistics/GrantShareAward.vue'
  import GrantRestricted from '../../components/tabNav/dataStatistics/GrantRestricted.vue'
  export default {
    data () {
      return {
        activeName: 'EncouragePlane'
      }
    },
    components: {
      EncouragePlane,
      GrantShareAward,
      GrantRestricted
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
