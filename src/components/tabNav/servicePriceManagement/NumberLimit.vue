<template>
  <div id="cashLimit">
    <el-row>
      <el-col :span="12">
        <div class="limit" v-if="editable">
          <p>当激励人员人数不低于<input type="text" disabled  v-model="cashLimit" value="">时，显示联系客服线下咨询</p>
          <el-button type="primary" @click="showEdit">编辑</el-button>
        </div>
        <div class="limit" v-if="!editable">
          <p>当激励人员人数不低于<input type="text" v-model="cashLimit" value="">时，显示联系客服线下咨询</p>
          <el-button type="success" @click="confirm">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        cashLimit: 0,
        editable: true
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      showEdit () {
        this.editable = false
      },
      getDatas () {
        this.axios({
          method: 'get',
          url: '/keygood/admin/confinenop/findOne'
        }).then((result) => {
          if (result.data.code === 0) {
            this.cashLimit = result.data.confineNop.limitNop
          } else {
            this.$message({
              message: result.data.msg,
              type: 'error'
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      confirm () {
        this.editable = true
        this.axios({
          method: 'post',
          url: '/keygood/admin/confinenop/editOne',
          params: {
            confineNopId: '10000',
            limitNop: this.cashLimit
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message({
              message: result.data.msg,
              type: 'success'
            })
            this.getDatas()
          } else {
            this.$message({
              message: result.data.msg,
              type: 'error'
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .limit{
    width: 100%;
    height: 300px;
    border: 1px solid #eef1f6;
    text-align: center;
    p{
      margin-top: 100px;
      input{
        width: 60px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #eef1f6;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        margin: 0 5px;
      }
    }
    .el-button{
      margin-top: 50px;
    }
  }
</style>
