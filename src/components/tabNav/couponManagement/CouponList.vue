<template>
  <div id="CouponList">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="4">
            <el-form-item label="状态：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="未使用" value="1"></el-option>
                <el-option label="已使用" value="2"></el-option>
                <el-option label="已过期" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="创建日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" @change="optionChange"></el-date-picker>
              —
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" @change="optionChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input class="search" placeholder="企业名称、优惠券号码" v-model="form.searchVaule">
              <el-button slot="append" icon="search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
          <el-col :span="5" style="margin-left: 20px;">
            <el-button type="primary"><a style="color: #fff" href="javascript:void(0)" @click="downLoad">批量导出</a></el-button>
            <el-button type="primary" @click="addCoupon">创建优惠券</el-button>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable @selection-change="selectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="创建日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="截止日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠券号码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.couponNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | couponState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠金额" align="center">
          <template slot-scope="scope">
            <span>￥ {{ scope.row.money }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row class="pagination">
        <el-col :span="24">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <!-- 详情层 -->
    <div v-if="showPopup">
      <el-row>
        <el-col :span="12" class="popup" >
          <p class="close"><i class="iconfont icon-guanbi" @click="colse()"></i></p>
          <div class="wrapper">
            <div class="info">
              <div><span class="left">截止日期：</span><span class="right"><el-date-picker type="date" placeholder="选择日期" v-model="coupon.endTime"></el-date-picker></span></div>
              <div><span class="left">优惠金额：</span><span class="right"><input v-model="coupon.money" value=""/></span></div>
              <div><span class="left">创建数量：</span><span class="right"><input v-model="coupon.num" value=""/></span></div>
            </div>
          </div>
          <div class="foot">
            <el-button type="primary" @click="confrimAddCoupon">确定</el-button>
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
        form: {
          state: '',
          startTime: '',
          endTime: '',
          searchVaule: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        showPopup: false,
        coupon: {
          endTime: '',
          money: '',
          num: ''
        },
        idList: []
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取列表数据
      getDatas () {
        this.axios({
          method: 'get',
          url: '/keygood/admin/coupon/findbylike',
          params: {
            status: this.form.state,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            keyword: this.form.searchVaule.trim(),
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.tableDatas = result.data.page.list
            this.totalSize = result.data.page.totalCount
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
      // 改变每页条数
      sizeChange (val) {
        this.pageSize = val
        this.getDatas()
      },
      currentChange (val) {
        this.currentPage = val
        this.getDatas()
      },
      optionChange () {
        this.getDatas()
      },
      // 创建弹出层
      addCoupon () {
        this.showPopup = true
      },
      // 创建优惠券
      confrimAddCoupon () {
        if (!this.coupon.endTime || !this.coupon.money || !this.coupon.num) {
          this.$message({
            message: '请输入完整信息！',
            type: 'warning'
          })
        } else if (isNaN(this.coupon.money) || isNaN(this.coupon.num)) {
          this.$message({
            message: '请输入数字！',
            type: 'warning'
          })
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/admin/coupon/addOne',
            params: {
              endTime: this.coupon.endTime,
              money: this.coupon.money,
              num: this.coupon.num
            }
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
      colse () {
        this.showPopup = false
      },
      // 批量选择
      selectionChange (val) {
        let arr = []
        val.forEach(row => {
          arr.push(row.couponId)
        })
        this.idList = arr
      },
      // 批量导出
      downLoad (ev) {
        if (this.idList.length === 0) {
          this.$message({
            message: '请选择至少一条数据！',
            type: 'warning'
          })
        } else {
          ev.target.setAttribute('href', `/keygood/admin/coupon/export?couponIds=${this.idList}`)
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .el-select{
    max-width: 120px;
  }
  .el-input{
    max-width: 120px
  }
  .search{
    max-width: 300px
  }
  .pagination{
    margin-top: 15px;
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
          width: 200px;
          text-align: center;
        }
        span.right{
          min-width: 300px;
          box-flex: 1.0;
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
    }
  }
  .foot{
    margin-top: 35px;
    text-align: center;
  }
</style>
