<template>
  <div id="OrderStatistics">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="getDatas">
          <el-tab-pane label="邮件消息" name="EmailMessage">
            <email-message v-if="activeName === 'EmailMessage'"></email-message>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import EmailMessage from '../../components/tabNav/emailPush/EmailMessage.vue'
  export default {
    data () {
      return {
        activeName: 'EmailMessage'
      }
    },
    components: {
      EmailMessage
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
