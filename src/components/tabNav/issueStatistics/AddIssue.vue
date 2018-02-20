<template>
  <div id="AddIssue">
    <el-row>
      <el-col :span="24" class="popup">
        <div class="questionType">
          <label>问题类型：</label>
          <label><input type="radio" v-model="type" value="1" />功能介绍</label>
          <label><input type="radio" v-model="type" value="2"/>常见问题</label>
          <label><input type="radio" v-model="type" value="3" />普通问题</label>
        </div>
        <div class="question">
          <label>请输入问题：</label>
          <textarea v-model="question"></textarea>
        </div>
        <div class="answer">
          <label>请输入答案：</label>
          <vue-html5-editor :content="answer" @change="updateData" :height="500"></vue-html5-editor>
        </div>
        <div class="btn">
          <el-button type="primary" @click="addIssue">确定</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        type: '',
        question: '',
        answer: ''
      }
    },
    methods: {
      addIssue () {
        this.axios({
          method: 'post',
          url: '/keygood/admin/question/addOne',
          data: this.toFormData({
            type: this.type,
            name: this.question,
            content: this.answer
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message({
              message: result.data.msg,
              type: 'success'
            })
            this.type = ''
            this.question = ''
            this.answer = ''
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
        this.answer = value
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
