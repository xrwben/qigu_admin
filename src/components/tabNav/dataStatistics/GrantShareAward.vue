<template>
  <div id="employeeCertification">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="状态：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="待签字" value="1"></el-option>
                <el-option label="已签字" value="2"></el-option>
                <el-option label="转换中" value="3"></el-option>
                <el-option label="转换完成" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授予日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" @change="optionChange"></el-date-picker>
              —
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" @change="optionChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input class="search" placeholder="所属企业、计划名称" v-model="form.searchVaule">
              <el-button slot="append" icon="search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas">
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授予日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属企业" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span>分红股</span>
          </template>
        </el-table-column>
        <el-table-column label="持有人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.realName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | stockStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="viewDetails(scope.row.bonusSharesId)">详细</el-button>
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
        <el-col :span="16" class="popup" >
          <p class="close"><i class="iconfont icon-guanbi" @click="colse()"></i></p>
          <div class="wrapper">
            <div class="info">
              <p><span>编号：</span><span>{{ bonusShares.number }}</span></p>
              <p><span>类型：</span><span>分红股</span></p>
              <p><span>所属企业：</span><span>{{ company.companyName }}</span></p>
              <p><span>所属计划：</span><span>{{ stimulate.planName }}</span></p>
              <p><span>持有人：</span><span>{{ companyUser.realName }}</span></p>
              <p><span>状态：</span><span>{{ bonusShares.status | state }}</span></p>
              <p><span>年度最大可分红股数：</span><span>{{ bonusShares.stockNum }}</span></p>
              <p><span>授予日期：</span><span>{{ bonusShares.awardedDate | dateFormat }}</span></p>
            </div>
            <div class="idCard">
              <h3>下载文档</h3>
              <a href="javascript:void(0)" @click="downLoad">授予协议</a>
            </div>
            <div class="mature">
              <label>成熟计划详情</label>
              <ul>
                <li>成熟计划名称：{{ mature.matureName }}</li>
                <li>授予股数：{{ bonusShares.stockNum }}</li>
                <li>计划长度：{{ mature.matureLong }}年</li>
                <li>成熟周期：每年成熟一次</li>
              </ul>
            </div>
            <div class="table">
              <table>
                <thead>
                <tr>
                  <th>成熟日期</th>
                  <th>绩效考核合格率</th>
                  <th>年度最大可分红股数</th>
                  <th>年度最大可认购股数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in performances">
                  <td>{{ bonusShares.awardedDate | dateAddYear(index+1) }}</td>
                  <td>{{ item.yield }}%</td>
                  <td>{{ bonusShares.stockNum }}</td>
                  <td>{{ (item.subrate * bonusShares.stockNum / 100).toFixed(0) }}</td>
                </tr>
                </tbody>
              </table>
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
        bonusShares: {},
        company: {},
        companyUser: {},
        mature: {},
        performances: {},
        stimulate: {}
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
          url: '/keygood/admin/bonusshares/findbylike',
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
      // 查看详情
      viewDetails (id) {
        this.showPopup = true
        this.axios({
          method: 'get',
          url: '/keygood/admin/bonusshares/findOne',
          params: {
            bonusSharesId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.bonusShares = result.data.bonusShares
            this.company = result.data.company
            this.companyUser = result.data.companyUser
            this.mature = result.data.mature
            this.performances = result.data.performances
            this.stimulate = result.data.stimulate
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
      // 下载文件
      downLoad (ev) {
        ev.target.setAttribute('href', `/keygood/admin/oss/download?fileName=${this.bonusShares.fileName}&path=${this.bonusShares.awardedAgreement}`)
      },
      colse () {
        this.showPopup = false
      }
    },
    filters: {
      dateAddYear (value, i) {
        let year = new Date(value).getFullYear() || 0
        let month = (new Date(value).getMonth() + 1 || 0) < 10 ? '0' + (new Date(value).getMonth() + 1 || 0) : (new Date(value).getMonth() + 1 || 0)
        let date = (new Date(value).getDate() || 0) < 10 ? '0' + (new Date(value).getDate() || 0) : (new Date(value).getDate() || 0)
        return parseInt(year) + i + '-' + month + '-' + date
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
      border-bottom: 1px solid #ccc;
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
        color: #5090D3;
        margin-right: 35px;
      }
    }
    .mature{
      label{
        font-size: 16px;
        padding: 20px 0px 0px;
        background: #EFF3F8;
        display: inline-block;
      }
      ul{
        padding: 10px 0px;
        li{
          line-height: 25px;
        }
      }
    }
    .table{
      table{
        width: 100%;
        text-align: center;
        table-layout: fixed;
        border: 1px solid #c5c5c5;
        thead{
          tr{
            height: 47px;
            background: #EFF3F6;
            border-bottom: 1px solid #EFF3F6;
            color: #666;
          }
        }
        tbody{
          tr{
            height: 47px;
            border-bottom: 1px solid #EFF3F6;
            color: #333;
            background: #fff;
          }
          tr:last-of-type{
            border-bottom: 0;
          }
        }
      }
    }
  }
</style>
