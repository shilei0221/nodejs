<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

   <el-form label-width="120px">

  <el-form-item label="课程标题">
    <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
  </el-form-item>

  <!-- 所属分类 TODO -->
  <el-form-item label="课程分类">
    <!--所属的一级分类 -->
    <el-select @change="showTwoSubject"
      v-model="courseInfo.subjectParentId"
      placeholder="请选择">
      <el-option
        v-for="oneSubject in oneSubjectList"
        :key="oneSubject.id"
        :label="oneSubject.title"
        :value="oneSubject.id"/>
    </el-select>

    <!-- 二级分类 -->
    <el-select v-model="courseInfo.subjectId" placeholder="请选择">
      <el-option
        v-for="subject in twoSubjectList"
        :key="subject.value"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>
  </el-form-item>

  <!-- 课程讲师 TODO -->
  <!-- 课程讲师 -->
  <el-form-item label="课程讲师">
    <el-select
      v-model="courseInfo.teacherId"
      placeholder="请选择">
      <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
    </el-select>
  </el-form-item>

  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
  </el-form-item>

  <!-- 课程简介 TODO -->
<!-- 课程简介-->
  <el-form-item label="课程描述">
      <tinymce :height="300" v-model="courseInfo.description"/>
  </el-form-item>
  <!-- 课程封面 TODO -->
  <!-- 课程封面-->
  <el-form-item label="课程封面">

    <el-upload
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :action="BASE_API+'/eduoss/upload'"
      class="avatar-uploader">
      <img :src="courseInfo.cover">
    </el-upload>

  </el-form-item>

  <el-form-item label="课程价格">
    <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
  </el-form-item>

  <el-form-item>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
import course from '@/api/course'
import subject from '@/api/subject'
import Tinymce from '@/components/Tinymce'

export default {
   components: { Tinymce },//声明编辑器的组件
  data () {
    return {
      saveBtnDisabled:false,
      courseInfo:{
          title: '',
          subjectId: '',
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/01.jpg',
          price: 0
      },
      oneSubjectList:[], //代表一级分类的集合
      twoSubjectList:[], //代表二级分类的集合
      teacherList:[], //讲师数组
      courseId:'',
      BASE_API:process.env.BASE_API
    }
  },
  created () {
    this.init()
  },
  methods: {
    init(){
      //获取路由上面课程id值,数据回显
      if(this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        //调用方法得到课程信息
        this.getInfoCourse()
      } else {
        //添加课程操作
        //讲师列表
        this.getTeacherAll()
        //一级分类
        this.getLevelSubject()
      }
    },
    //根据id查询课程信息
    getInfoCourse(){
      course.getCourseInfoId(this.courseId)
        .then(response => {
          this.courseInfo = response.data.course
          //把二级分类数据回显实现
          //1 调用方法获取所有的分类（包含一级和二级）
          subject.getSubjectList()
            .then(response => {
              this.oneSubjectList = response.data.items
              //2 遍历分类集合 得到每个分类
              for(var i = 0;i < this.oneSubjectList.length;i++) {
                //得到每个分类
                var oneSubject = this.oneSubjectList[i]
                //3 判断当前一级分类id和所有的一级分类id是否一样
                if(oneSubject.id === this.courseInfo.subjectParentId) {
                    //4 获取一级分类里面的二级分类
                    this.twoSubjectList = oneSubject.children
                }
              }
            })
        })
          //讲师列表
        this.getTeacherAll()
    },
    //上传封面之后调用的方法
    handleAvatarSuccess(res, file) {
        this.courseInfo.cover = res.data.url
    },
    //上传之前调用的方法
    beforeAvatarUpload(file) {
      //限定上传图片格式或者大小
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //点击一级分类显示对应的二级分类
    showTwoSubject(value) {
      //如果使用原生的js代码，使用change事件的时候，需要手动把value值传递过来
      //写法 this.value 但是现在使用 elementui 组件，这个过程封装了
      //直接获取点击 id 值
      //显示二级分类
      //遍历一级分类（包含二级分类）
      for(var i = 0; i < this.oneSubjectList.length;i++) {
        //获取每个分类对象
        var subjectLevel = this.oneSubjectList[i]
        //判断当前点击一级分类id和所有一级分类比较
        if(value === subjectLevel.id) {
            //获取二级分类
            this.twoSubjectList = subjectLevel.children
            //最后清空数据
            this.courseInfo.subjectId=''
        }
      }
    },
    //查询所有一节分类
    getLevelSubject(){
      subject.getSubjectList()
        .then(response => {
          this.oneSubjectList = response.data.items
        })
    },
    //查询所有的讲师列表
    getTeacherAll() {
      course.getTeacherList()
        .then(response => {
          this.teacherList = response.data.items
        })
    },
    //TODO 添加和修改的方法
    saveOrUpdate() {
      //判断添加还是修改
      if(!this.courseInfo.id) {
          //添加方法
          this.addCourseInfo()
      } else {
        //修改操作
      this.updateCourse()
      }
    },
    //修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo)
        .then(response => {
           //提示信息
          this.$message({
              type:'success',
              message:'修改成功'
          })
          //跳转到第二步
          this.$router.push({path:'/course/chapter/'+this.courseId})
        })
    },
    //添加课程
    addCourseInfo() {
      course.saveCourseInfo(this.courseInfo)
        .then(response => {
          //获取返回课程id
          this.courseId = response.data.courseId
          //提示信息
          this.$message({
              type:'success',
              message:'保存成功'
          })
           //跳转到第二步
           //路由跳转
          this.$router.push({path:'/course/chapter/'+this.courseId})
        })
    }
  }
}
</script>


<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
