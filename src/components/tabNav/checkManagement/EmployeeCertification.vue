<template>
  <div id="employeeCertification">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="证件类型：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="身份证" value="1"></el-option>
                <el-option label="护照" value="2"></el-option>
                <el-option label="台胞证" value="3"></el-option>
                <el-option label="回乡证" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认证日期">
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
        <el-table-column label="认证日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.approveTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属企业" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.company.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.realName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="证件类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.papersType | idCardType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="证件号码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.papersNum }}</span>
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
      <el-row>
        <el-col :span="12" class="popup" >
          <p class="close"><i class="iconfont icon-guanbi" @click="colse()"></i></p>
          <div class="wrapper">
            <div class="info">
              <p><span>真实姓名：</span><span>{{ detailsInfo.realName }}</span></p>
              <p><span>证件类型：</span><span>{{ detailsInfo.papersType | idCardType }}</span></p>
              <p><span>证件号码：</span><span>{{ detailsInfo.papersNum }}</span></p>
              <p><span>所属企业：</span><span v-if="detailsInfo.company">{{ detailsInfo.company.companyName }}</span></p>
              <p><span>认证日期：</span><span>{{ detailsInfo.approveTime | dateFormat }}</span></p>
            </div>
            <div class="idCard">
              <h3>证件正反面</h3>
              <img :src="detailsInfo.frontPicture"/>
              <img :src="detailsInfo.versoPicture"/>
              <!--<img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1354236714,4185217991&fm=27&gp=0.jpg"/>-->
            </div>
          </div>
          <div class="foot">
            <el-button size="small" type="primary" @click="checkPass(detailsInfo.companyUserId)">通过</el-button>
            <el-button size="small" type="warning" @click="checkReject(detailsInfo.companyUserId)">驳回</el-button>
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
        detailsInfo: {}
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
          url: '/keygood/admin/companyuser/findbylike',
          params: {
            papersType: this.form.state,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            keyword: this.form.searchVaule.trim(),
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            status: 3
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
      // 关闭详情层
      colse () {
        this.showPopup = false
      },
      // 审核通过
      checkPass (id) {
        this.axios({
          method: 'post',
          url: '/keygood/admin/companyuser/pass',
          params: {
            companyUserId: id
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
      checkReject (id) {
        this.axios({
          method: 'post',
          url: '/keygood/admin/companyuser/reject',
          params: {
            companyUserId: id
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
      text-align: center;
      border-bottom: 1px solid #ccc;
      h3{
        font-weight: 400;
        line-height: 35px;
      }
      img{
        width: 100%;
        max-width: 300px;
        height: 200px;
      }
    }
    .foot{
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
