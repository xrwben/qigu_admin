<template>
  <div id="Home">
    <el-row class="wrapper">
      <!-- header -->
      <el-col :span="24" class="header">
        <el-col :span="16">
          <div class="logo">
            <img src="../assets/logo.png">
          </div>
        </el-col>
        <el-col :span="8" class="userInfo">
          <div class="info">
            <img src="http://up.qqjia.com/z/face01/face06/facejunyong/junyong04.jpg">
            <span>{{ userInfo.name }}</span>
            <el-dropdown @command="clickMenuItem">
              <span class="el-dropdown-link">
                <i class="iconfont icon-xiala1"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="editPassword">
                  <i class="iconfont icon-xiugaimima homeIcon"></i>修改密码
                </el-dropdown-item>
                <el-dropdown-item command="logOut">
                  <i class="iconfont icon-logout homeIcon"></i>退出系统
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-col>
      <!-- body -->
      <el-col :span="24" class="bodyCon">
        <div class="siderMenu">
          <el-menu :default-active="$route.path" router>
            <div v-for="(item, index) in routerData">
              <el-menu-item :index="item.path" v-if="item.role.indexOf(role) > -1">{{ item.name }}</el-menu-item>
              <!--<el-menu-item :index="item.path">{{ item.name }}</el-menu-item>-->
            </div>
          </el-menu>
        </div>
        <div class="main">
          <el-row>
            <el-row :span="24" class="container">
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </el-row>
          </el-row>
        </div>
      </el-col>

      <!-- 修改密码 -->
      <div class="modifyPopup" v-if="isShowModify">
        <el-form class="modifyPassword" :model="ruleForm">
          <h3>修改密码</h3>
          <el-form-item>
            <el-input type="password" v-model.trim="ruleForm.oldPassword" placeholder="请输入旧密码" autofocus></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" v-model.trim="ruleForm.newPassword" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" v-model.trim="ruleForm.confirmPassword" placeholder="请确认新密码"></el-input>
          </el-form-item>
          <el-form-item class="btn">
            <el-button class="submit" @click.prevent="closePopup">取消</el-button>
            <el-button class="submit" type="primary" @click.prevent="submitForm()">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        routerData: [],
        userInfo: JSON.parse(sessionStorage.getItem('loginInfo')),
        role: JSON.parse(sessionStorage.getItem('loginInfo')).role,
        isShowModify: false,
        ruleForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }
    },
    created () {
      if (!sessionStorage.getItem('loginInfo')) {
        this.$router.push('/login')
      }
    },
    mounted () {
      this.routerData = this.$router.options.routes[1].children
    },
    methods: {
      clickMenuItem (command) {
        if (command === 'editPassword') {
          this.isShowModify = true
          this.ruleForm.oldPassword = ''
          this.ruleForm.newPassword = ''
          this.ruleForm.confirmPassword = ''
        } else if (command === 'logOut') {
          this.logOut()
        }
      },
      // 退出登录
      logOut () {
        this.$confirm('确认退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'post',
            url: '/keygood/admin/sysuser/logout'
          }).then(result => {
            if (result.data.code === 0) {
              this.$router.push('/login')
              sessionStorage.removeItem('loginInfo')
              this.$message({
                type: 'success',
                message: '退出成功!'
              })
            }
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出！'
          })
        })
      },
      // 修改密码
      submitForm () {
        if (!this.ruleForm.oldPassword || !this.ruleForm.newPassword || !this.ruleForm.confirmPassword) {
          this.$message({
            type: 'warning',
            message: '请填写完整的信息!'
          })
        } else if (this.ruleForm.newPassword.length < 6) {
          this.$message({
            type: 'warning',
            message: '密码必须六位及以上!'
          })
        } else if (this.ruleForm.newPassword !== this.ruleForm.confirmPassword) {
          this.$message({
            type: 'warning',
            message: '确认密码错误!'
          })
        } else {
          this.axios({
            method: 'post',
            url: '/keygood/admin/sysuser/updatePassword',
            data: this.toFormData({
              sysUserId: this.userInfo.sysUserId,
              password: this.ruleForm.oldPassword,
              newPassword: this.ruleForm.newPassword
            })
          }).then(result => {
            if (result.data.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功，请重新登录!'
              })
              this.$router.push('/login')
              sessionStorage.removeItem('loginInfo')
            }
          })
        }
      },
      // 关闭弹窗
      closePopup () {
        this.isShowModify = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" lang="scss" scoped>
  #Home{
    .wrapper{
      width: 100%;
      height: 100%;
      min-width: 1000px;
      position: absolute;
      top: 0;
      bottom: 0;
      .header{
        height: 80px;
        line-height: 80px;
        background: #73b4e4;
        padding: 0 30px;
        .logo{
          height: 80px;
          display:flex;
          align-items:center;
          img{
            width: 120px;
            height: 40px;
          }
        }
        .info{
          height: 80px;
          display:flex;
          align-items:center;
          justify-content: flex-end;
          img{
            width: 40px;
            height: 40px;
            border: 1px solid #e6e6e6;
            border-radius: 50%;
          }
          span{
            padding: 0 30px 0 10px;
          }
          i{
            cursor: pointer;
          }
        }
      }
      .bodyCon{
        position: absolute;
        top: 80px;
        bottom: 0px;
        overflow: hidden;
        display: flex;
        .siderMenu{
          width: 150px;
          text-align: center;
          .el-menu{
            height: 100%;
            padding-top: 20px;
            div{
              /*height: 5%;*/
              .el-menu-item{
                height: 45px;
                line-height: 45px;
              }
            }
          }
        }
        .main{
          flex: 1.0;
          padding: 20px;
          overflow-y: auto;
        }
      }

      .modifyPopup{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 101;
        .modifyPassword{
          width: 350px;
          background: #fff;
          border-radius: 4px;
          padding: 0 50px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          h3{
            line-height: 80px;
            text-align: center;
          }
          .btn{
            text-align: center;
          }
        }
      }
    }
  }
  .homeIcon{
    padding-right: 5px;
  }
</style>
