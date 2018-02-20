<template>
  <div id="AccountManagement">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="账号列表" name="AccountManagementList">
            <account-management-list v-if="activeName === 'AccountManagementList'"></account-management-list>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import AccountManagementList from '../../components/tabNav/accountManagement/AccountManagementList.vue'
  export default {
    data () {
      return {
        activeName: 'AccountManagementList'
      }
    },
    components: {
      AccountManagementList
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
