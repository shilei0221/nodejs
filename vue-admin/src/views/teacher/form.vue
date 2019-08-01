<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
          </el-button>

          <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调

        <input type="file" name="file"/>
      -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduoss/upload'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
//引入
import teacher from '@/api/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const defaultForm = {
  name: '',
  sort: 0,
  level: '',
  career: '',
  intro: '',
  avatar: ''
}

export default {
  //声明组件
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher:{
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      BASE_API:process.env.BASE_API, //获取config里面配置文件路径
      imagecropperShow:false, //是否显示上传组件，false不显示
      imagecropperKey:0  //组件标识
    }
  },
  //监听器实现路由切换监听
  watch: {
    $route(to, from) {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    cropSuccess(data) {//上传成功
      //关闭弹框
      this.imagecropperShow = false
      //获取上传成功之后返回oss里面的地址
      this.teacher.avatar = data.url
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
       this.imagecropperKey = this.imagecropperKey + 1
    },
    close() {//关闭上传弹框
      //关闭弹框
      this.imagecropperShow = false
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },
    init() {
      //进入表单页面时候，如果修改，调用根据id查询的方法
      //讲师id如何得到，使用获取路由中参数值的方法
      //判断路由里面是否有参数，并且是id名称的参数
      if(this.$route.params && this.$route.params.id) {
        //获取路由中id值
        const id = this.$route.params.id
        //把获取的id传递进行id查询
        this.getInfoTeacher(id)
      } else {
        //路由中没有id值，这个时候做添加操作
        //清空表单
        //对象复制
        this.teacher = { ...defaultForm }
      }
    },
    //根据id查询讲师信息
    getInfoTeacher(id) {
      teacher.getTeacherById(id)
        .then(response => {
          this.teacher = response.data.teacher
        })
    },
    saveOrUpdate() {
      //判断点击保存时候，做添加还是修改操作
      //判断teacher对象里面是否有id值
      //如果没有id值，做添加操作
      if(!this.teacher.id) {
        //添加讲师
        this.saveTeacherInfo()
      } else {
        //修改
        this.updateTeacher()
      }
    },
    //修改讲师的方法
    updateTeacher() {
      teacher.updateTeacherById(this.teacher)
        .then(response => {
          this.$message({
              type: 'success',
              message: '修改成功'
          })
          //路由跳转到列表页面
          this.$router.push({path:'/teacher/index'})
        })
        .catch(response => {
            this.$message({
              type: 'info',
              message: '修改失败'
          })
        })
    },
    //添加讲师的方法
    saveTeacherInfo() {
      teacher.saveTeacher(this.teacher)
        .then(response => {
          //提示
          this.$message({
              type: 'success',
              message: '添加成功'
          })
          //添加成功之后回到列表页面
          //路由跳转实现
          this.$router.push({path:'/teacher/index'})
        })
        .catch(response => {
          this.$message({
              type: 'info',
              message: '添加失败'
            })
        })
    }
  }
}
</script>
