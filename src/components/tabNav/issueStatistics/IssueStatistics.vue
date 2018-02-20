<template>
  <div id="IssueStatistics">
    <div v-show="!showDetails && !editQuestion">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="类型：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="功能介绍" value="1"></el-option>
                <el-option label="常见问题" value="2"></el-option>
                <el-option label="普通问题" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-input class="search" placeholder="问题" v-model="form.searchVaule">
              <el-button slot="append" icon="search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="类型" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.type | issueType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="问题" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="答案" align="center" width="450">-->
          <!--<template slot-scope="scope">-->
            <!--<span v-html="scope.row.content ">-->
              <!--<input type="hidden" v-html="scope.row.content" value="scope.row.content">-->
            <!--</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="viewDetails(scope.row)">详细</el-button>
            <el-button size="small" type="success" @click="editAnser(scope.row)">修改</el-button>
            <el-button size="small" type="warning" @click="del(scope.row.questionId)">删除</el-button>
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

    <!-- 查看详情 -->
    <div v-if="showDetails">
      <el-row>
        <el-col :span="24" class="popup">
          <p class="close"><i class="iconfont icon-guanbi" @click="close()"></i></p>
          <div class="detailsContent">
            <h2>{{ detailsContent.name }}</h2>
            <div v-html="detailsContent.content"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 修改问题 -->
    <div v-if="editQuestion">
      <el-row>
        <el-col :span="24" class="popup">
          <div class="questionType">
            <label>问题类型：</label>
            <label><input type="radio" v-model="edit.type" value="1" />功能介绍</label>
            <label><input type="radio" v-model="edit.type" value="2"/>常见问题</label>
            <label><input type="radio" v-model="edit.type" value="3" />普通问题</label>
          </div>
          <div class="question">
            <label>请输入问题：</label>
            <textarea v-model="edit.question"></textarea>
          </div>
          <div class="answer">
            <label>请输入答案：</label>
            <vue-html5-editor :content="edit.answer" @change="updateData" :height="500"></vue-html5-editor>
          </div>
          <div class="btn">
            <el-button @click="close()">取消</el-button>
            <el-button type="primary" @click="confirmEdit()">确定</el-button>
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
          searchVaule: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        showDetails: false, // 是否显示问题详情
        detailsContent: {},
        editQuestion: false, // 是否显示编辑
        edit: {
          questionId: '',
          type: '',
          question: '',
          answer: ''
        }
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
          url: '/keygood/admin/question/findbylike',
          params: {
            type: this.form.state,
            name: this.form.searchVaule.trim(),
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
      viewDetails (info) {
        this.axios({
          method: 'GET',
          url: '/keygood/admin/question/info',
          params: {
            questionId: info.questionId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.detailsContent = result.data.question
            this.showDetails = true
          }
        })
      },
      editAnser (info) {
        this.axios({
          method: 'GET',
          url: '/keygood/admin/question/info',
          params: {
            questionId: info.questionId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.edit.questionId = result.data.question.questionId
            this.edit.type = result.data.question.type
            this.edit.question = result.data.question.name
            this.edit.answer = result.data.question.content
            this.editQuestion = true
          }
        })
      },
      confirmEdit () {
        this.axios({
          method: 'post',
          url: '/keygood/admin/question/editOne',
          data: this.toFormData({
            questionId: this.edit.questionId,
            type: this.edit.type,
            name: this.edit.question,
            content: this.edit.answer
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message({
              message: result.data.msg,
              type: 'success'
            })
            this.close()
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
      // 获取富文本内容
      updateData (value) {
        this.edit.answer = value
      },
      del (id) {
        this.axios({
          method: 'POST',
          url: '/keygood/admin/question/delete',
          params: {
            questionId: id
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
      },
      // 关闭按钮
      close () {
        this.showDetails = false
        this.editQuestion = false
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

  .popup{
    background: #eef1f6;
    border: 1px solid #ccc;
    padding: 20px;
    .close{
      text-align: right;
      i{
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .detailsContent{
    margin-top: 10px;
    h2{
      text-align: center;
      padding-bottom: 10px;
      font-size: 18px;
      font-weight: 400;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    >div{
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }

  /* 修改问题 */
  .popup{
    background: #eef1f6;
    border: 1px solid #ccc;
    padding: 20px;
    .questionType{
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      label{
        margin-right: 20px;
        cursor: pointer;
      }
    }
    .question{
      margin-top: 15px;
      display: flex;
      label{
        width: 120px;
        display: block;
      }
      textarea{
        width: 100%;
        height: 50px;
        border: 1px solid #ddd;
        padding: 5px;
      }
    }
    .answer{
      margin-top: 15px;
      display: flex;
      label{
        width: 120px;
        display: block;
      }
      .vue-html5-editor{
        width: 100%;
      }
    }
  }
  .btn {
    margin-top: 35px;
    text-align: center;
    .el-button {
      width: 100px;
    }
  }
</style>
