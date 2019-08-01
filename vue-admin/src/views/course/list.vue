<template>
  <div class="app-container">
    课程列表
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="80" />
      <el-table-column prop="lessonNum" label="课时数" width="80" />
      <el-table-column prop="price" label="价格" width="80" />

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">{{ scope.row.level==='Draft'?'未发布':'已发布' }}</template>
      </el-table-column>

       <el-table-column label="操作" width="200" align="center">
       <template slot-scope="scope">
          <div>
            <el-button type="danger" size="mini" >编辑课程大纲</el-button>
          </div>
          <div>
            <el-button type="danger" size="mini" >编辑课程信息</el-button>
          </div>
          <div>
            <el-button type="success" size="mini" @click="removeDataById(scope.row.id)">删除</el-button>
          </div>
        </template>
       
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getPageTeacherlist"
    />-->
  </div>
</template>

<script>
//引入js文件，为了调用方法
import course from "@/api/course";

export default {
  //变量和初始值
  data() {
    return {
      listLoading: false, //转的图标是否显示
      list: null, //数据list集合
      page: 1, //当前页
      limit: 10, //每页记录数
      total: 0, //总记录数
      teacherQuery: {}
    };
  },
  //页面显示之前调用，调用methods里面的方法
  created() {
    this.getCourselist();
  },
  //定义具体的方法
  methods: {
    //删除课程
    removeDataById(id) {
         this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return course.removeCourseById(id)
        }).then(() => {
          this.getCourselist()// 刷新列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch((response) => { // 失败
          if (response === 'cancel') {
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
    //设置页数默认值
    getCourselist() {
      //显示转图标
      this.listLoading = true;

      //调用api里面teacher.js里面的方法
      course
        .findAllCourseList()
        .then(response => {
          //response就是后端接口返回的响应数据部分
          this.list = response.data.items;
          console.log(this.list);

          //获取数据之后，图标不显示了
          this.listLoading = false;
        }) //成功之后调用
        .catch(response => {}); //失败之后调用
    }
  }
};
</script>
