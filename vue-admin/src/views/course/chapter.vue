<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="text" @click="addChapterDialog()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterDataList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}
                <span class="acts">
                    <el-button type="text" @click="openVideoDialog(chapter.id)">添加小节</el-button>
                    <el-button style="" type="text"  @click="openDailogUpdate(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapterInfo(chapter.id)">删除</el-button>
                </span>
            </p>

            <!-- 小节 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                    <span class="acts">
                        <el-button type="text" @click="openUpdateVideoDialog(video.id)">编辑</el-button>
                        <el-button type="text" @click="openDeleteVideoDialog(video.id)">删除</el-button>
                    </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>
    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
    <!-- 添加和修改章节弹框 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>

        <el-form-item label="上传视频">
            <el-upload
              :on-success="handleVodUploadSuccess"
              :on-remove="handleVodRemove"
              :before-remove="beforeVodRemove"
              :on-exceed="handleUploadExceed"
              :file-list="fileList"
              :action="BASE_API+'/eduvod/vid/uploadVid'"
              :limit="1"
              class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
                <div slot="content">最大支持1G，<br>
                    支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                    GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                    MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                    SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                <i class="el-icon-question"/>
            </el-tooltip>
            </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/chapter'
import video from '@/api/video'

export default {
  data () {
    return {
      saveBtnDisabled:false,
      courseId:'',//课程id
      chapterId:'',//章节id
      chapterDataList:[],//章节集合
      videoDataList:[],//小节集合
      dialogChapterFormVisible:false,//章节的弹框默认不显示
      chapter:{
          title: '',
          sort: 0
      }, //用于封装章节数据对象
      dialogVideoFormVisible:false,//小节弹框默认值
      video:{
            title: '',
            sort: 0,
            free: 0,
            videoSourceId: '', //视频ID
            videoOriginalName:''//视频名称
      },//封装小节数据对象
      fileList:[],  // 文件列表
      BASE_API:process.env.BASE_API //获取配置文件路径
    }
  },
  created () {
    if(this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id

      //调用方法根据课程id得到所有章节和小节数据
      this.getChapterVideoList()
    }
  },
  methods: {
    //点击删除调用的方法
    beforeVodRemove(file, fileList) {
        return this.$confirm(`确认删除 ${file.name} 吗?`)
    },
    // 真正删除的方法
    handleVodRemove(file, fileList) {
      // 根据视频id删除阿里云视频
      video.removeAliyunVideo(this.video.videoSourceId)
        .then(response => {
          this.$message({
            type:'success',
            message:'删除成功'
          })

          //清空视频id
          this.video.videoSourceId = ''
        })
    },
    // 上传视频成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      // 上传成功之后返回视频ID,获取视频ID 赋值操作
      this.video.videoSourceId = response.data.vid
      //把上传文件名称进行赋值
      this.video.videoOriginalName = file.name
    },
    // 视图上传多于一个视频
    handleUploadExceed(files,fileList) {
        this.$message.warning('想要重新上传视频,请先删除已上传的视频')
    },
    //删除小节
    openDeleteVideoDialog(videoId) {
        this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return video.removeById(videoId)
        }).then(() => {
          this.getChapterVideoList()// 刷新列表
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
    //弹出框进行小节数据回显
    openUpdateVideoDialog(videoId) {
      //弹框
      this.dialogVideoFormVisible = true
      //根据小节id 查询
      video.getVideoInfo(videoId)
        .then(response => {
          this.video = response.data.video
          //手动显示视频名称
          this.fileList = [{'name':this.video.videoOriginalName}]
        })
    },
    //添加小节弹框
    openVideoDialog(chapterId){
      //弹框
      this.dialogVideoFormVisible = true
      this.chapterId = chapterId

      //清空数据
      this.video.title = ''
      this.video.sort = ''
      this.fileList = []
    },
    //添加小节和修改小节
    saveOrUpdateVideo(){
      if(!this.video.id) {
        //添加
        this.saveVideoInfo()
      } else {
         this.updateVideoInfo()
      }
    },
    //修改小节
    updateVideoInfo() {
      video.updateVideoInfo(this.video)
        .then(response => {
           //关闭弹框
          this.dialogVideoFormVisible = false
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getChapterVideoList()// 刷新列表
        })
    },
    //添加小节
    saveVideoInfo() {
      //设置课程id
      this.video.courseId = this.courseId
      //设置章节id
      this.video.chapterId = this.chapterId

      video.saveChapter(this.video)
        .then(response => {
          //关闭弹框
          this.dialogVideoFormVisible = false
          this.$message({
            type: 'success',
            message: '增加成功!'
          })
          this.getChapterVideoList()// 刷新列表
        })
    },
    //删除章节
    removeChapterInfo(chapterId) {
        this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return chapter.removeById(chapterId)
        }).then(() => {
          this.getChapterVideoList()// 刷新列表
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
    //修改弹框数据回显
    openDailogUpdate(chapterId) {
      //弹框
      this.dialogChapterFormVisible = true
      //根据章节id查询
      chapter.getChapterInfo(chapterId)
        .then(response => {
          this.chapter = response.data.eduChapter
        })
    },
    //弹出增加章节的弹框
    addChapterDialog(){
      this.chapter.title = ''
      this.chapter.sort = 0
      this.chapter.id = ''
      //设置 dialogChapterFormVisible 的值为true 就可以弹框
      this.dialogChapterFormVisible = true

    },
    //添加和修改
    saveOrUpdate() {
      //判断chapter是否有id
      if(!this.chapter.id) {
        //添加
        this.saveChapterInfo()
      } else {
        //修改
        this.updateInfoChapter()
      }
    },
         //修改章节
        updateInfoChapter() {
            chapter.updateChapterInfo(this.chapter)
                .then(response => {
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    })
                    //关闭弹框
                    this.dialogChapterFormVisible = false
                    //刷新页面
                    this.getChapterVideoList()
                })
        },
    //添加章节
    saveChapterInfo() {
      //添加之前，设置课程id到章节对象里面
      this.chapter.courseId = this.courseId
      //在实现添加
      chapter.saveChapter(this.chapter)
        .then(response => {
           this.$message({
            type: 'success',
            message: '保存成功!'
          })
          //关闭弹框
          this.dialogChapterFormVisible = false
          //刷新页面
          this.getChapterVideoList()
        })
    },
    //根据课程id得到所有章节和小节数据
    getChapterVideoList() {
      chapter.getChapterVideoList(this.courseId)
        .then(response => {
          this.chapterDataList = response.data.items
        })
    },
    //上一步
    previous() {
       this.$router.push({path:'/course/info/'+this.courseId})
    },
    //下一步
    next() {
      this.$router.push({path:'/course/publish/'+this.courseId})
    }
  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
