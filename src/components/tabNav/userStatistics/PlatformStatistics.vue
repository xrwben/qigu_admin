<template>
  <div id="PlatformStatistics">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="企业类型：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="有限公司" value="1"></el-option>
                <el-option label="合伙公司" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" @change="optionChange"></el-date-picker>
              —
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" @change="optionChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input class="search" placeholder="公司名称、所属企业" v-model="form.searchVaule">
              <el-button slot="append" icon="search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属企业" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.company.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册资本（元）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.registeredAssets || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="股东上限" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.shareholderLimit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="viewDetails(scope.row.playformId)">详细</el-button>
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
              <p><span>公司名称：</span><span>{{ detailsInfo.name }}</span></p>
              <p><span>所属企业：</span><span>{{ detailsInfo.company.companyName }}</span></p>
              <p><span>注册资本：</span><span>{{ detailsInfo.registeredAssets || '--' }}</span></p>
              <p><span>持有公司股权：</span><span>{{ detailsInfo.stockOption }} %</span></p>
              <p><span>股东上限：</span><span>{{ detailsInfo.shareholderLimit }}</span></p>
              <p><span>营业执照号码：</span><span>{{ detailsInfo.licenseNum }}</span></p>
              <p><span>日期：</span><span>{{ detailsInfo.createTime | dateFormat }}</span></p>
            </div>
            <div class="idCard">
              <h3>营业执照</h3>
              <img :src="detailsInfo.license"/>
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
          url: '/keygood/admin/platform/findbylike',
          params: {
            type: this.form.state,
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
          url: '/keygood/admin/platform/findOne',
          params: {
            playformId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.detailsInfo = result.data.platform
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
  }
</style>
