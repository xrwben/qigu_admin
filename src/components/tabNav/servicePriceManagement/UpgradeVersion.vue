<template>
  <div id="UpgradeVersion">
    <el-row v-if="!showPopup">
      <el-col :span="24">
        <!-- table -->
        <el-table :data="tableDatas" resizable>
          <el-table-column label="服务名称" align="center">
            <template slot-scope="scope">
              <span>升级版</span>
            </template>
          </el-table-column>
          <el-table-column label="激励人员人数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.startNop }} ~ {{ scope.row.endNop }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开通时长" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.openDuration }}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              <span>￥ {{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="addEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="warning" @click="del(scope.row.priceId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="addBtn" type="primary" @click="addEdit()">新增</el-button>
      </el-col>
    </el-row>

    <!-- 弹出层 -->
    <div v-if="showPopup">
      <el-row>
        <el-col :span="12" class="popup" >
          <p class="close"><i class="iconfont icon-guanbi" @click="close()"></i></p>
          <div class="wrapper">
            <div class="info">
              <div>
                <span class="left">激励人数：</span>
                <span class="right">
                 <input v-model="serviceData.people1"/>
                  <i>~</i>
                  <input v-model="serviceData.people2"/>
                </span>
              </div>
              <div><span class="left">开通时长(年)：</span><span class="right"><input type="number" v-model="serviceData.time" value=""/></span></div>
              <div><span class="left">价格(元)：</span><span class="right"><input v-model="serviceData.price" value=""/></span></div>
            </div>
          </div>
          <div class="foot">
            <el-button type="primary" @click="confirm()">确定</el-button>
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
        showPopup: false,
        tableDatas: [],
        serviceData: {
          people1: '',
          people2: '',
          time: '',
          price: '',
          id: ''
        }
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'get',
          url: '/keygood/admin/price/findbylike',
          params: {
            serviceName: '升级版'
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.tableDatas = result.data.page.list
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
      addEdit (info) {
        this.showPopup = true
        if (info) {
          this.serviceData.people1 = info.startNop
          this.serviceData.people2 = info.endNop
          this.serviceData.time = info.openDuration
          this.serviceData.price = info.price
          this.serviceData.id = info.priceId
        } else {
          this.serviceData.people1 = ''
          this.serviceData.people2 = ''
          this.serviceData.time = ''
          this.serviceData.price = ''
          this.serviceData.id = ''
        }
        console.log(this.serviceData.id)
      },
      confirm () {
        if (!this.serviceData.people1 || !this.serviceData.people2 || !this.serviceData.time || !this.serviceData.price) {
          this.$message({
            message: '请填写完整的数据！',
            type: 'warning'
          })
        } else {
          let url = '/keygood/admin/price/addOne'
          let data = this.toFormData({
            serviceName: '升级版',
            startNop: this.serviceData.people1,
            endNop: this.serviceData.people2,
            openDuration: this.serviceData.time,
            price: this.serviceData.price
          })
          if (this.serviceData.id !== '') {
            url = '/keygood/admin/price/editOne'
            data = this.toFormData({
              serviceName: '升级版',
              startNop: this.serviceData.people1,
              endNop: this.serviceData.people2,
              openDuration: this.serviceData.time,
              price: this.serviceData.price,
              priceId: this.serviceData.id
            })
          }
          this.axios({
            method: 'post',
            url: url,
            data: data
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message({
                message: result.data.msg,
                type: 'success'
              })
              this.getDatas()
              this.showPopup = false
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
      },
      close () {
        this.showPopup = false
      },
      // 删除
      del (id) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'POST',
            url: '/keygood/admin/price/delete',
            params: {
              priceId: id
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
            message: '取消删除！'
          })
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .el-button{
    margin-left: 0;
  }
  .addBtn{
    margin-top: 15px;
  }
  .service{
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #eef1f6;
    display: inline-block;
    margin-right: 5px;
  }
  .el-input{
    max-width: 80px;
    margin-right: 5px;
    text-align: center;
  }
  .el-table__row:hover{
    background: #fff !important;
  }

  /* 详情弹窗*/
  .popup{
    background: #eef1f6;
    padding: 20px;
    .close{
      text-align: right;
      i{
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .wrapper{
    .info{
      border-top: 1px solid #ccc;
      margin-top: 10px;
      padding-top: 20px;
      div{
        height: 36px;
        display: flex;
        line-height: 36px;
        margin: 0px 0 10px;
        span.left{
          display: block;
          width: 200px;
          text-align: center;
        }
        span.right{
          min-width: 300px;
          box-flex: 1.0;
          -webkit-box-flex: 1.0;
          .el-input{
            width: 100%;
            max-width: 100%;
          }
          input{
            width: 100%;
            height: 35px;
            border: 1px solid #ccc;
            border-radius: 5px;
            text-indent: 10px;
          }
        }
      }
      >div:first-of-type{
        span.right{
          input{
            width: 40%;
            display: inline;
          }
          i{
            display: inline;
          }
        }
      }
    }
  }
  .foot{
    margin-top: 35px;
    text-align: center;
  }
</style>
