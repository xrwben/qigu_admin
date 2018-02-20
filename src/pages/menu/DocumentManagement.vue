<template>
  <div id="DocumentManagement">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="文档管理" name="FileManagement">
            <file-management v-if="activeName === 'FileManagement'"></file-management>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FileManagement from '../../components/tabNav/documentManagement/FileManagement.vue'
  export default {
    data () {
      return {
        activeName: 'FileManagement'
      }
    },
    components: {
      FileManagement
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
