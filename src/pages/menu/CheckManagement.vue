<template>
  <div id="CheckManagement">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="员工实名认证" name="EmployeeCertification">
            <employee-certification v-if="activeName === 'EmployeeCertification'"></employee-certification>
          </el-tab-pane>
          <el-tab-pane label="公司实名认证" name="CompanyCertification">
            <company-certification v-if="activeName === 'CompanyCertification'"></company-certification>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import EmployeeCertification from '../../components/tabNav/checkManagement/EmployeeCertification.vue'
  import CompanyCertification from '../../components/tabNav/checkManagement/CompanyCertification.vue'
  export default {
    data () {
      return {
        activeName: 'EmployeeCertification'
      }
    },
    components: {
      EmployeeCertification,
      CompanyCertification
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
