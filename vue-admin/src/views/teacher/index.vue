<template>
  <div class="app-container">
    讲师列表
        <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getPageTeacherlist()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
        <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>

          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>

   <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getPageTeacherlist"
    />

  </div>
</template>

<script>
//引入js文件，为了调用方法
import teacher from '@/api/teacher'

export default {
  //变量和初始值
  data() {
    return {
      listLoading:false,//转的图标是否显示
      list:null,//数据list集合
      page:1,//当前页
      limit:10,//每页记录数
      total:0,//总记录数
      teacherQuery:{}
    }
  },
  //页面显示之前调用，调用methods里面的方法
  created () {
    this.getPageTeacherlist()
  },
  //定义具体的方法
  methods: {
    //删除讲师
    removeDataById(id) {
      //confirm 确认框
      this.$confirm('此操作将删除讲师信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {//点击确定执行then的代码
            //调用api的方法实现删除
            return teacher.removeTeacherId(id)
        }).then((response) => {//return表示后面代码还会执行
            //删除成功
            //刷新页面
            this.getPageTeacherlist()
            //提示
            this.$message({
              type: 'info',
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
              message: '删除失败'
            })
          }
        })
    },
    //清空的方法
    resetData() {
      this.teacherQuery = {}
      //查询所有记录
      this.getPageTeacherlist()
    },
    //设置页数默认值
    getPageTeacherlist(page=1) {
      //显示转图标
      this.listLoading = true
      this.page = page

      //调用api里面teacher.js里面的方法
      teacher.getTeacherList(this.page,this.limit,this.teacherQuery)
        .then(response => { //response就是后端接口返回的响应数据部分
          this.total = response.data.total
          this.list = response.data.rows
          console.log(this.total)
          console.log(this.list)

          //获取数据之后，图标不显示了
          this.listLoading = false
        })//成功之后调用
        .catch(response => {

        })//失败之后调用
    }
  }
}
</script>
