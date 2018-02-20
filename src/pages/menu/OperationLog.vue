<template>
  <div id="OrderStatistics">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="用户操作日志" name="UserLog">
            <user-log v-if="activeName === 'UserLog'"></user-log>
          </el-tab-pane>
          <el-tab-pane label="平台操作日志" name="PlatformLog">
            <platform-log v-if="activeName === 'PlatformLog'"></platform-log>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import UserLog from '../../components/tabNav/operationLog/UserLog.vue'
  import PlatformLog from '../../components/tabNav/operationLog/PlatformLog.vue'
  export default {
    data () {
      return {
        activeName: 'UserLog'
      }
    },
    components: {
      UserLog,
      PlatformLog
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
