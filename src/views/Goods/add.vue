<template>
    <div class="add">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="mt-20">
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false">
            </el-alert>
            <el-steps  :space="200"  align-center :active="activeName*1" finish-status="success" class="mt-20 mb-20">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form label-position="top" :model="addForm" :rules="addRules" ref="addRef">
                <el-tabs 
                    tab-position="left" 
                    v-model="activeName" 
                    :before-leave="beforeLeave"
                    @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="商品名称" prop="goods_name">
                                <el-input v-model="addForm.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input v-model="addForm.goods_price" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input v-model="addForm.goods_weight" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input v-model="addForm.goods_number" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品分类" prop="goods_cat">
                                <el-cascader
                                    expandTrigger='hover'
                                    v-model="addForm.goods_cat"
                                    :options="goodsList"
                                    :props="listProps"
                                    @change="handleChange"
                                    clearable></el-cascader>
                            </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="item2" border v-for="(item2,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                         <el-upload
                            :action="imgUrl"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleAdd"
                            list-type="picture"
                            :headers="headerObj">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce" class="mb-20">
                                        
                        </quill-editor>
                        <el-button type="primary"  @click="addBtn">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 预览图片弹窗 -->
        <el-dialog
            title="预览"
            :visible.sync="previewModal"
            width="50%">

            <img :src="imgPath" alt="" style="width:100%;">
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'add',
    data() {
        return {
            activeName:'0',
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:[],
                pics:[],
                goods_introduce:'',
                attrs:[]
            },
            previewModal:false,
            addRules:{
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_cat: [
                    { required: true, message: '请选择分类', trigger: 'blur' },
                ],
            },
            goodsList:[],
            listProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            manyData:[],
            onlyData:[],
            imgUrl:'http://127.0.0.1:8888/api/private/v1/upload',
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            imgPath:''
        };
    },
    mounted(){
        this.getGoodsList()
    },
    methods:{
        // 获取级联选择商品
        getGoodsList(){
            this.$http.get('categories').then(res=>{
                if (res.meta.status!==200) return this.$message.error('获取商品失败！')

                this.goodsList=res.data
            })
        },

        // 监听是不是选择的是三级分类
        handleChange(){
            if (this.addForm.goods_cat.length!==3) {
                this.addForm.goods_cat=[]
                return
            }
        },
        beforeLeave(newVal,oldVal){
            if (oldVal==0&&this.addForm.goods_cat.length!==3) {
                this.$message.error('请选择商品分类！')
                return false
            }
        },

        // 监听现在是哪个tabs
        tabClick(){
            if(this.activeName==1){
                this.$http.get(`categories/${this.cateId}/attributes`,
                {
                    params:{sel:'many'}
                }).then(res=>{
                    if(res.meta.status!==200) return this.$message.error('获取动态参数失败！')

                    res.data.forEach(item=>{
                        item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(' ')
                    })
                    this.manyData=res.data
                })
            }else if(this.activeName==2){
                this.$http.get(`categories/${this.cateId}/attributes`,
                {
                    params:{sel:'only'}
                }).then(res=>{
                    if(res.meta.status!==200) return this.$message.error('获取静态属性失败！')

                    this.onlyData=res.data
                })
            }
        },

        // 预览
        handlePreview(img){
            console.log(img)
            this.previewModal=true
            this.imgPath=img.response.data.url
        },
        // 删除图片
        handleRemove(res){
            const filePath=res.response.data.tmp_path
            const i=this.addForm.pics.findIndex(x=>{
                return x.pic===filePath
            })
            this.addForm.pics.splice(i,1)
        },
        // 添加图片成功
        handleAdd(res){
            if(res.meta.status!==200) return this.$message.error('上传失败！')

            var picList={pic:res.data.tmp_path}
            this.addForm.pics.push(picList)
            this.$message.success('上传成功！')
        },
        // 添加商品
        addBtn(){
            this.$refs.addRef.validate(valid=>{
                if(!valid) return this.$message.error('请完善商品信息！')

                // 实现深拷贝
                const formInfo=JSON.parse(JSON.stringify(this.addForm))
                
                formInfo.goods_cat=this.addForm.goods_cat.join(',')

                this.manyData.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                this.onlyData.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                formInfo.attrs=this.addForm.attrs
                this.$http.post('goods',formInfo).then(res=>{
                    console.log(res)
                    if(res.meta.status!==201) return this.$message.error(res.meta.msg)

                    this.$message.success('添加商品成功！')
                    this.$router.push('/goods')
                })
            })
        }
    },
    computed:{
        // 分类id
        cateId(){
            if(this.addForm.goods_cat.length===3){
                return this.addForm.goods_cat[2]
            }

            return null
        }
    }
};
</script>
<style>
    .el-step__title{
        font-size: 13px;
    }
    .el-checkbox{
        margin:0 10px 0 0 !important ;
    }
    .ql-editor{
        min-height: 300px;
    }
</style>