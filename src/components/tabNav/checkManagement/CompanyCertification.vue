<template>
  <div id="companyCertification">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="证件类型：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="有限责任公司" value="1"></el-option>
                <el-option label="股份有限公司" value="2"></el-option>
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
            <el-input class="search" placeholder="企业名称" v-model="form.searchVaule">
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
        <el-table-column label="企业全称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type | companyType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资本币种" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="viewDetails(scope.row.companyId)">详细</el-button>
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
              <p><span>企业全称：</span><span>{{ detailsInfo.companyName }}</span></p>
              <p><span>企业类型：</span><span>{{ detailsInfo.type | companyType }}</span></p>
              <p><span>企业简称：</span><span>{{ detailsInfo.companyAbbreviation }}</span></p>
              <p><span>资本币种：</span><span>{{ detailsInfo.currency }}</span></p>
              <p><span>认证日期：</span><span>{{ detailsInfo.createTime | dateFormat }}</span></p>
            </div>
            <div class="idCard">
              <h3>营业执照</h3>
              <img :src="detailsInfo.license"/>
            </div>
          </div>
          <div class="foot">
            <el-button size="small" type="primary" @click="checkPass(detailsInfo.companyId)">通过</el-button>
            <el-button size="small" type="warning" @click="checkReject(detailsInfo.companyId)">驳回</el-button>
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
          url: '/keygood/admin/company/findbylike',
          params: {
            type: this.form.state,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            companyName: this.form.searchVaule.trim(),
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            approveStatus: 2
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
          url: '/keygood/admin/company/findOne',
          params: {
            companyId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.detailsInfo = result.data.company
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
          url: '/keygood/admin/company/pass',
          params: {
            companyId: id
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
          url: '/keygood/admin/company/reject',
          params: {
            companyId: id
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
