<template>
  <div id="IssueManagement">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="问题统计" name="IssueStatistics">
            <issue-statistics v-if="activeName === 'IssueStatistics'"></issue-statistics>
          </el-tab-pane>
          <el-tab-pane label="添加问题" name="AddIssue">
            <add-issue v-if="activeName === 'AddIssue'"></add-issue>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import IssueStatistics from '../../components/tabNav/issueStatistics/IssueStatistics.vue'
  import AddIssue from '../../components/tabNav/issueStatistics/AddIssue.vue'
  export default {
    data () {
      return {
        activeName: 'IssueStatistics'
      }
    },
    components: {
      IssueStatistics,
      AddIssue
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
