<template>
  <div id="CouponStatistics">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <!--<el-col :span="5">-->
            <!--<el-form-item label="状态：">-->
              <!--<el-select v-model="form.state" @change="optionChange">-->
                <!--<el-option label="全部" value=""></el-option>-->
                <!--<el-option label="标准版" value="1"></el-option>-->
                <!--<el-option label="升级" value="2"></el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label="使用日期">
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
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="优惠券号码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.couponNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.useTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业全称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠金额" align="center">
          <template slot-scope="scope">
            <span>￥ {{ scope.row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | couponState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="viewDetails(scope.row.couponId)">详细</el-button>
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
              <p><span>订单号：</span><span>{{ order.number }}</span></p>
              <p><span>企业全称：</span><span>{{ company.companyName }}</span></p>
              <p><span>服务名称：</span><span>{{ order.serviceName }}</span></p>
              <p><span>激励人员人数：</span><span>{{ order.stimulateNop }}</span></p>
              <p><span>开通日期：</span><span>{{ order.payTime | dateFormat }}</span></p>
              <p><span>结束日期：</span><span>{{ order.endTime | dateFormat }}</span></p>
              <p><span>开通时长：</span><span>{{ order.openDuration }} 年</span></p>
              <p><span>标准服务金额：</span><span>{{ order.price }} 元</span></p>
              <p><span>支付金额：</span><span>{{ order.realMoney }} 元</span></p>
              <p><span>支付状态：</span><span>{{ order.status | orderStatus }}</span></p>
              <p><span>优惠券号码：</span><span>{{ coupon.couponNum }}</span></p>
              <p><span>优惠金额：</span><span>{{ coupon.money }}</span></p>
              <p><span>时间：</span><span>{{ coupon.useTime | dateFormat }}</span></p>
            </div>
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
          startTime: '',
          endTime: '',
          searchVaule: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        showPopup: false,
        company: {},
        coupon: {},
        order: {}
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
          url: '/keygood/admin/coupon/findusebylike',
          params: {
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
      // 查看详情
      viewDetails (id) {
        this.showPopup = true
        this.axios({
          method: 'get',
          url: '/keygood/admin/coupon/info',
          params: {
            couponId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.company = result.data.company
            this.coupon = result.data.coupon
            this.order = result.data.order
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
      colse () {
        this.showPopup = false
      }
    },
    filters: {
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .isLink{
    cursor: pointer;
    &:hover{
      color: #20a0ff;
    }
  }
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
    /*text-align: center;*/
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
      p{
        height: 35px;
        line-height: 35px;
        span:first-of-type{
          float: left;
        }
        span:last-of-type{
          float: right;
        }
      }
    }
    .idCard{
      h3{
        font-weight: 400;
        line-height: 35px;
      }
      a{
        margin-right: 35px;
      }
    }
  }
</style>
