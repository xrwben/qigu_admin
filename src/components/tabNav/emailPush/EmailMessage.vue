<template>
  <div id="EmailMessage">
    <div v-if="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form>
          <el-col :span="8">
            <el-form-item label="发布时间">
              <el-date-picker type="date" placeholder="选择日期" v-model="startTime" @change="optionChange"></el-date-picker>
              —
              <el-date-picker type="date" placeholder="选择日期" v-model="endTime" @change="optionChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-button type="primary" @click="viewDetails()">推送邮件</el-button>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="发布时间" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消息标题" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.newsName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消息内容" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="viewDetails(scope.row)">查看详情</el-button>
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

    <!-- 活动推送发布弹窗 -->
    <div v-if="showPopup">
      <el-row>
        <el-col :span="12" class="popup">
          <p class="close"><i class="iconfont icon-guanbi" @click="close()"></i></p>
          <div class="wrapper">
            <div class="title">
              <label>消息标题：</label>
              <input type="text" v-model="title" value="">
            </div>
            <div class="content">
              <label>消息内容：</label>
              <textarea v-model="content"></textarea>
            </div>
          </div>
          <div class="btn" v-show="showBtn">
            <el-button type="primary" @click="publish">确定</el-button>
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
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        showPopup: false,
        title: '',
        content: '',
        showBtn: true
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取活动列表数据
      getDatas () {
        this.axios({
          method: 'get',
          url: '/keygood/admin/news/findbylike',
          params: {
            startTime: this.startTime,
            endTime: this.endTime,
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
      // 显示活动详情
      viewDetails (info) {
        this.showPopup = true
        if (info) {
          this.showBtn = false
          this.title = info.newsName
          this.content = info.content
        } else {
          this.title = ''
          this.content = ''
          this.showBtn = true
        }
      },
      // 确认推送邮件
      publish () {
        if (this.title !== '' && this.content !== '') {
          this.axios({
            method: 'post',
            url: '/keygood/admin/news/addOne',
            data: this.toFormData({
              newsName: this.title,
              content: this.content
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message({
                message: result.data.msg,
                type: 'success'
              })
              this.showPopup = false
              this.getDatas()
            } else if (result.data.code === 400) {
              this.$message({
                message: result.data.msg,
                type: 'error'
              })
            } else {
              this.$message({
                message: result.data.msg,
                type: 'error'
              })
            }
          }).catch((error) => {
            console.log(error)
          })
        } else {
          this.$message({
            message: '发布消息不能存在空内容！',
            type: 'warning'
          })
        }
      },
      // 关闭按钮
      close () {
        this.showPopup = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .el-input{
    max-width: 120px
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
    .wrapper{
      margin-top: 15px;
    }
  }
  .title{
    width: 100%;
    height: 40px;
    line-height: 35px;
    align-items: center;
    display: flex;
    label{
      width: 120px;
      display: block;
    }
    input{
      width: 100%;
      height: 30px;
      padding: 3px 10px;
      border: 1px solid #ccc;
      display: block;
    }
  }
  .content{
    width: 100%;
    margin-top: 35px;
    display: flex;
    label{
      width: 120px;
      display: block;
    }
    textarea{
      width: 100%;
      height: 300px;
      padding: 5px;
    }
  }
  .btn{
    margin-top: 35px;
    text-align: center;
    .el-button{
      width: 100px;
    }
  }
</style>
