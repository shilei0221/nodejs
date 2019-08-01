<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-button type="text" @click="openOneLevelDialog()">添加一级分类</el-button>
    <el-tree
      ref="subjectTree"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      class="filter-tree"
      default-expand-all
      node-key="id">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试 -->
          <el-button
            v-if="node.level == 1"
            type="text"
            size="mini"
            @click="() => append(data)">添加二级分类</el-button>
          <el-button
            v-if="node.level == 2 || node.level == 1"
            type="text"
            size="mini"
            @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog :visible.sync="dialogFormVisible" title="添加分类">
        <el-form :model="subject" label-width="120px">
            <el-form-item label="分类标题">
                <el-input v-model="subject.title"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="appendLevel()">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import subject from '@/api/subject'
export default {

  data() {
    return {
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      dialogFormVisible:false,//弹框默认为false 不显示
      subject:{
        title: '',
        parentId: ''
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created () {
    this.getSubjectAll()
  },
  methods: {
    //一级分类的弹框
    openOneLevelDialog(){
       this.dialogFormVisible = true
       //把表单值清空
       this.subject.title = ''
       this.subject.parentId = ''
    },
    //添加二级分类弹框
    append(data){
      //清空二级分类弹框内容
       this.subject.title = ''
      //弹框
      this.dialogFormVisible = true
      //把当前一级分类的id赋值到parentId里面
      this.subject.parentId = data.id
    },
     appendLevel(){
       //添加一级分类
       if(!this.subject.parentId) {
         this.appendLevelOne()
       } else {
         //二级分类
         this.appendLevelTwo()
       }
     },
     //添加二级分类
    appendLevelTwo() {
      subject.saveTwoLevel(this.subject)
        .then(response => {
          //刷新页面
          this.getSubjectAll()
          //关闭弹框
          this.dialogFormVisible = false
          this.$message({
              type: 'success',
              message: '添加成功'
            })
        }).catch((response) => {//点击取消执行catch的代码
          if(response === 'cancel') {
              this.$message({
                type: 'info',
                message: '已取消添加'
              })
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
          }
        })
    },
    //添加一级分类
    appendLevelOne() {
      subject.saveOneLevel(this.subject)
        .then(response => {
          //刷新页面
          this.getSubjectAll()
          //关闭弹框
          this.dialogFormVisible = false
          this.$message({
              type: 'success',
              message: '添加成功'
            })
        }).catch((response) => {//点击取消执行catch的代码
          if(response === 'cancel') {
              this.$message({
                type: 'info',
                message: '已取消添加'
              })
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
          }
        })
    },
   //删除分类的方法
    remove(node, data) {
      //调用后端接口的方法实现删除
      //confirm 确认框
      this.$confirm('此操作将删除分类信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {//点击确定执行then的代码
            //调用api的方法实现删除
            return subject.deleteSubjectId(data.id)
        }).then((response) => {//return表示后面代码还会执行
            //删除成功
            //刷新页面
            //不需要刷新整个页面，使用dom操作直接删除节点
            //this.getSubjectAll()
            this.$refs.subjectTree.remove(node)
            //提示
            this.$message({
              type: 'success',
              message: '删除成功'
            })
        }).catch((response) => {//点击取消执行catch的代码
          if(response === 'cancel') {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
          } else {
            this.$message({
              type: 'error',
              message: $response.message
            })
          }
        })
    },
    //查询所有分类
    getSubjectAll(){
      subject.getSubjectList()
        .then(response => {
          this.data2 = response.data.items
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>

