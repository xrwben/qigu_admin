<template>
  <div id="EnterpriseStatistics">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="实名认证：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="未激活" value="1"></el-option>
                <el-option label="未认证" value="2"></el-option>
                <el-option label="认证中" value="3"></el-option>
                <el-option label="已通过" value="4"></el-option>
                <el-option label="已驳回" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" @change="optionChange"></el-date-picker>
              —
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" @change="optionChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input class="search" placeholder="姓名、所属企业" v-model="form.searchVaule">
              <el-button slot="append" icon="search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="注册日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="认证日期" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.approveTime">{{ scope.row.approveTime | dateFormat }}</span>
            <span v-if="!scope.row.approveTime">--</span>
          </template>
        </el-table-column>
        <el-table-column label="企业名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.company.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.realName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实名认证" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | empAuthenticationState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="viewDetails(scope.row.companyUserId)">详细</el-button>
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
      <el-row class="popup">
        <p class="close"><i class="iconfont icon-guanbi" @click="colse()"></i></p>
        <el-col :span="12">
          <div class="wrapper left">
            <div class="info">
              <div><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1354236714,4185217991&fm=27&gp=0.jpg"/></div>
              <p><span>姓名：</span><span>{{ detailsInfo.realName }}</span></p>
              <p><span>实名认证：</span><span>{{ detailsInfo.status | empAuthenticationState }}</span></p>
              <p><span>手机绑定：</span><span>{{ detailsInfo.phone || '--' }}</span></p>
              <p><span>邮箱绑定：</span><span>{{ detailsInfo.email }}</span></p>
              <p><span>所属企业：</span><span>{{ detailsInfo.company.companyName }}</span></p>
              <p>
                <span>注册日期：</span>
                <span v-if="detailsInfo.createTime">{{ detailsInfo.createTime | dateFormat }}</span>
                <span v-if="!detailsInfo.createTime">--</span>
              </p>
              <p><span>员工id：</span><span>{{ detailsInfo.empno || '--' }}</span></p>
              <p><span>部门：</span><span>{{ detailsInfo.department || '--' }}</span></p>
              <p><span>职位：</span><span>{{ detailsInfo.post || '--' }}</span></p>
              <p><span>权限：</span><span>{{ detailsInfo.role || '--' }}</span></p>
            </div>
          </div>
        </el-col>
        <el-col :span="12" v-if="detailsInfo.status === 4">
          <div class="wrapper right">
            <div class="idCard">
              <h3>实名认证</h3>
              <p><span>真实姓名：</span><span>{{ detailsInfo.realName }}</span></p>
              <p>
                <span>证件类型：</span>
                <span v-if="detailsInfo.papersType">{{ detailsInfo.papersType | idCardType }}</span>
                <span v-if="!detailsInfo.papersType">--</span>
              </p>
              <p><span>证件号码：</span><span>{{ detailsInfo.papersNum || '--' }}</span></p>
              <p><span>所属企业：</span><span>{{ detailsInfo.company.companyName }}</span></p>
              <p>
                <span>认证日期：</span>
                <span v-if="detailsInfo.approveTime">{{ detailsInfo.approveTime | dateFormat }}</span>
                <span v-if="!detailsInfo.approveTime">--</span>
              </p>
              <div>
                <p>身份证正反面</p>
                <img :src="detailsInfo.frontPicture"/>
                <img :src="detailsInfo.versoPicture"/>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="popup" v-if="detailsInfo.status === 4">
        <el-col :span="24">
          <div class="wrapper">
            <div>
              <h3>我的资产</h3>
              <el-tabs v-model="activeName">
                <el-tab-pane label="当前分红股" name="CurrentShareStock">
                  <current-share-stock :companyUserId="companyUserId" v-if="activeName === 'CurrentShareStock'"></current-share-stock>
                </el-tab-pane>
                <el-tab-pane label="当前受限股" name="CurrentRestrictedStock">
                  <current-restricted-stock :companyUserId="companyUserId" v-if="activeName === 'CurrentRestrictedStock'"></current-restricted-stock>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  import CurrentShareStock from './CurrentShareStock.vue'
  import CurrentRestrictedStock from './CurrentRestrictedStock.vue'
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
        detailsInfo: {},
        activeName: 'CurrentShareStock'
      }
    },
    components: {
      CurrentShareStock,
      CurrentRestrictedStock
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取成为中介顾问列表数据
      getDatas () {
        this.axios({
          method: 'get',
          url: '/keygood/admin/companyuser/findbylike',
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
      // 点击编号跳转
      viewDetails (id) {
        this.showPopup = true
        this.companyUserId = id
        this.axios({
          method: 'get',
          url: '/keygood/admin/companyuser/findOne',
          params: {
            companyUserId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.detailsInfo = result.data.companyUser
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
    /*text-align: center;*/
  }

  /* 详情弹窗*/
  .popup{
    background: #eef1f6;
    padding: 20px;
    margin-bottom: 5px;
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
      div{
        text-align: center;
        border-bottom: 1px solid #ddd;
        img{
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-top: 10px;
        }
      }
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
      border-top: 1px solid #ccc;
      margin-top: 10px;
      padding-bottom: 10px;
      h3{
        text-align: center;
        font-weight: 400;
        line-height: 45px;
      }
      img{
        width: 100%;
        max-width: 260px;
        height: 200px;
      }
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
  }
  .left{
    padding-right: 10px;
    border-right: 5px solid #fff;
  }
  .right{
    padding-left: 10px;
  }
</style>
