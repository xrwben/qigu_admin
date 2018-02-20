<template>
  <div id="ServicePriceManagement">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="标准版" name="StandardVersion">
            <standard-version v-if="activeName === 'StandardVersion'"></standard-version>
          </el-tab-pane>
          <el-tab-pane label="升级版" name="UpgradeVersion">
            <upgrade-version v-if="activeName === 'UpgradeVersion'"></upgrade-version>
          </el-tab-pane>
          <el-tab-pane label="激励人员人数限制" name="NumberLimit">
            <number-limit v-if="activeName === 'NumberLimit'"></number-limit>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import StandardVersion from '../../components/tabNav/servicePriceManagement/StandardVersion.vue'
  import UpgradeVersion from '../../components/tabNav/servicePriceManagement/UpgradeVersion.vue'
  import NumberLimit from '../../components/tabNav/servicePriceManagement/NumberLimit.vue'
  export default {
    data () {
      return {
        activeName: 'StandardVersion'
      }
    },
    components: {
      StandardVersion,
      UpgradeVersion,
      NumberLimit
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
