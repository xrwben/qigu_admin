<template>
  <div id="FileManagement">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="使用场景：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="新建激励计划-决议文件" value="1"></el-option>
                <el-option label="个人-有限" value="2"></el-option>
                <el-option label="个人-股份" value="3"></el-option>
                <el-option label="平台-有限" value="4"></el-option>
                <el-option label="平台-股份" value="5"></el-option>
                <el-option label="授予-个人持股" value="6"></el-option>
                <el-option label="授予-持股平台" value="7"></el-option>
                <el-option label="转换" value="8"></el-option>
                <el-option label="计划预览-体验" value="9"></el-option>
                <el-option label="分红股-打印" value="10"></el-option>
                <el-option label="受限股-打印" value="11"></el-option>
                <el-option label="激励对象批量导入" value="12"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-input class="search" placeholder="文档名称" v-model="form.searchVaule">
              <el-button slot="append" icon="search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="uploadShow()">上传</el-button>
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
        <el-table-column label="文档名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用场景" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.useScene | sceneType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary"><a style="color: #fff;" @click="downLoad($event, scope.row)" href="#">下载</a></el-button>
            <el-button size="small" type="warning" @click="del(scope.row.modleId)">删除</el-button>
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

    <!-- 上传文档弹窗 -->
    <div v-if="showPopup">
      <el-row>
        <el-col :span="12" class="popup">
          <p class="close"><i class="iconfont icon-guanbi" @click="close()"></i></p>
          <div class="wrapper">
            <p>
              使用场景：<label><input type="radio" v-model="file.type" value="1">新建激励计划-决议文件</label>
              <label><input type="radio" v-model="file.type" value="2">个人-有限</label>
              <label><input type="radio" v-model="file.type" value="3">个人-股份</label>
              <label><input type="radio" v-model="file.type" value="4">平台-有限</label>
              <label><input type="radio" v-model="file.type" value="5">平台-股份</label>
              <label><input type="radio" v-model="file.type" value="6">授予-个人持股</label>
              <label><input type="radio" v-model="file.type" value="7">授予-持股平台</label>
              <label><input type="radio" v-model="file.type" value="8">转换</label>
              <label><input type="radio" v-model="file.type" value="9">计划预览-体验</label>
              <label><input type="radio" v-model="file.type" value="10">分红股-打印</label>
              <label><input type="radio" v-model="file.type" value="11">受限股-打印</label>
              <label><input type="radio" v-model="file.type" value="12">激励对象批量导入</label>
            </p>
            <el-upload
              class="uploadFlie"
              action="/keygood/admin/oss/upload"
              :show-file-list="false"
              :on-success="handleSuccess">
              <el-button type="primary">{{ file.btnTxt }}</el-button>
              <label>{{ file.fileName }}</label>
            </el-upload>
          </div>
          <div class="btn">
            <el-button type="primary" @click="uploadFile">确定</el-button>
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
        showPopup: false,
        file: {
          btnTxt: '上传文件',
          type: '',
          fileName: '',
          filePath: ''
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
          url: '/keygood/admin/modle/findbylike',
          params: {
            useScene: this.form.state,
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
      // 下载文档
      downLoad (ev, info) {
        if (info.path.indexOf('html') < 0) {
          ev.target.setAttribute('href', `/keygood/admin/modle/downloadOther?path=${info.path}&fileName=${info.name}`)
        } else {
          ev.target.setAttribute('href', `/keygood/admin/modle/download?path=${info.path}&fileName=${info.name}`)
        }
      },
      // 删除文件
      del (id) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'post',
            url: '/keygood/admin/modle/delete',
            params: {
              modleId: id
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
      },
      uploadShow () {
        this.showPopup = true
        this.file.type = ''
        this.file.fileName = ''
        this.file.filePath = ''
        this.file.btnTxt = '上传文件'
      },
      close () {
        this.showPopup = false
      },
      // 文件上传回显
      handleSuccess (response) {
        this.file.fileName = response.fileName
        this.file.filePath = response.filePath
        this.file.btnTxt = '上传完成'
      },
      // 确定上传文件
      uploadFile () {
        if (!this.file.filePath) {
          this.$message({
            message: '请选择文件！',
            type: 'warning'
          })
        } else {
          this.axios({
            method: 'post',
            url: '/keygood/admin/modle/addOne',
            data: this.toFormData({
              useScene: this.file.type,
              fileName: this.file.fileName,
              path: this.file.filePath
            })
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
    .wrapper{
      margin-top: 15px;
      p{
        line-height: 35px;
        label{
          margin: 0 10px;
          display: inline-block;
        }
      }
    }
  }
  .uploadFlie{
    position: relative;
    margin-top: 35px;
    label{
      width: 60%;
      height: 30px;
      line-height: 30px;
      border: 1px solid #ccc;
      background: #fff;
      position: absolute;
      left: 100px;
      top: 3px;
      text-align: left;
      padding-left: 10px;
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
