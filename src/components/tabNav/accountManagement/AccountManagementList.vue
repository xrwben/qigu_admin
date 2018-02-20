<template>
  <div id="accountManagementList">
    <!-- toolbar -->
    <el-row class="" v-show="!showPopup">
      <el-col :span="24">
        <p style="text-align: right;">
          <el-button type="primary" class="addBtn" @click="add">添加</el-button>
        </p>
        <!-- table -->
        <el-table :data="accountDatas" resizable>
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="身份" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.role | accountType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="密码" align="center">
            <template slot-scope="scope">
              <span>******</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="modifyAccount(scope.row)">修改</el-button>
              <el-button type="success" size="small" @click="resetAccount(scope.row.sysUserId)">重置</el-button>
              <el-button type="warning" size="small" :disabled="scope.row.role==1" @click="delAccount(scope.row.sysUserId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 账户新增弹窗 -->
    <div v-if="showPopup">
      <el-row>
        <el-col :span="12" class="popup">
          <p class="close"><i class="iconfont icon-guanbi" @click="close()"></i></p>
          <div class="wrapper">
            <el-form label-width="80px" :model="form">
              <el-form-item label="账号">
                <el-input v-model="form.account"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="密码" v-if="!modifyAndAdd">
                <el-input v-model="form.password"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="foot">
            <el-button type="primary" v-show="!modifyAndAdd" @click="register">新增</el-button>
            <el-button type="primary" v-show="modifyAndAdd" @click="confirmModify">修改</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        accountDatas: [],
        showPopup: false,
        modifyAndAdd: true,
        form: {
          name: '',
          username: '',
          password: '',
          identity: '',
          sysUserId: ''
        }
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 新增用户弹窗
      add () {
        this.showPopup = true
        this.modifyAndAdd = false
        this.form.account = ''
        this.form.name = ''
        this.form.password = ''
      },
      // 关闭按钮
      close () {
        this.showPopup = false
      },
      // 获取全部用户数据
      getDatas () {
        this.axios({
          method: 'get',
          url: '/keygood/admin/sysuser/findlist'
        }).then((result) => {
          if (result.data.code === 0) {
            this.accountDatas = result.data.page
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      // 注册用户确认事件
      register () {
        this.axios({
          method: 'post',
          url: '/keygood/admin/sysuser/save',
          params: {
            username: this.form.account,
            name: this.form.name,
            password: this.form.password
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message({
              message: result.data.msg,
              type: 'success'
            })
            this.showPopup = false
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
      },
      // 删除账户
      delAccount (id) {
        this.$confirm('确认删除该账户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'DELETE',
            url: 'keygood/admin/sysuser/delete',
            params: {
              sysUserId: id
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 重置密码
      resetAccount (id) {
        this.$confirm('确认重置密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'POST',
            url: '/keygood/admin/sysuser/resetPassword',
            params: {
              sysUserId: id
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置密码'
          })
        })
      },
      // 修改账号弹窗
      modifyAccount (info) {
        this.showPopup = true
        this.modifyAndAdd = true
        this.form.account = info.username
        this.form.name = info.name
        this.form.password = ''
        this.form.sysUserId = info.sysUserId
        console.log()
      },
      // 确认修改数据
      confirmModify () {
        this.axios({
          method: 'post',
          url: '/keygood/admin/sysuser/update',
          data: this.toFormData({
            sysUserId: this.form.sysUserId,
            username: this.form.account,
            name: this.form.name
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message({
              message: result.data.msg,
              type: 'success'
            })
            this.showPopup = false
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
  .addBtn{
    margin-bottom: 15px;
  }
  /* 详情弹窗*/
  .popup{
    background: #eef1f6;
    padding: 20px;
    padding-right: 40px;
    .close{
      text-align: right;
      i{
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .wrapper{
    padding-top: 30px;
  }
  .foot{
     margin-top: 35px;
     text-align: center;
     .el-button{
       width: 100px;
     }
   }
</style>
