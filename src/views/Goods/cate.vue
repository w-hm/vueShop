<template>
    <div class="cate">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="mt-20">
            <el-button type="primary"  @click="addModal">添加分类</el-button>

            <tree-table 
                :data="goodsList" 
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
                border
                class="mt-20">

                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" style="color:lightgreen;" v-if="scope.row.cat_deleted===false"></i>
                    <i class="el-icon-error" style="color:red;"  v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                        <el-tag size="mini" v-if="scope.row.cat_level===1" type="success">二级</el-tag>
                        <el-tag size="mini" v-if="scope.row.cat_level===2" type="warning">三级</el-tag>
                </template>
                <template slot="action">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <el-pagination
                class="ta-c mt-20"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="goodsInfo.pagenum"
                :page-sizes="[1, 3, 5, 10]"
                :page-size="goodsInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类弹窗 -->
        <el-dialog
            title="添加分类"
            :visible.sync="modal"
            width="50%"
            @close="closeModal">
            <div>
                <el-form :model="cateForm" :rules="rules" ref="ruleForm" label-width="100px" >
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="cateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                        <el-cascader
                            style="width:100%;"
                            expand-trigger="hover"
                            :change-on-select="true"
                            v-model="selectKeys"
                            :options="parentsList"
                            @change="handleChange"
                            :props="selectProps"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modal = false">取 消</el-button>
                <el-button type="primary" @click="saveCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'cate',
    data() {
        return {
            goodsList:[],
            goodsInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            total:0,
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok',
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order',
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'action',
                },
            ],
            modal:false,
            cateForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },
            rules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            parentsList:[],
            selectKeys:[],
            selectProps:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            }
        };
    },
    mounted(){
        this.getGoodsList()
    },
    methods:{

        // 获取商品列表
        getGoodsList(){
            this.$http.get('categories',{params:this.goodsInfo}).then(res=>{
                console.log(res.data.result)
                if(res.meta.status!==200) return this.$message.error('获取商品失败！')

                this.goodsList=res.data.result
                this.total=res.data.total
            })
        },

        // 获取当前页
        handleCurrentChange(currenPage){
            // console.log('currenPage',currenPage)
            this.goodsInfo.pagenum=currenPage
            this.getGoodsList()
        },

        // 获取每页多少条数据
        handleSizeChange(size){
            // console.log('size',size)
            this.goodsInfo.pagesize=size
            this.getGoodsList()
        },

        // 获取商品分类父级列表
        getCateListFa(){
            this.$http.get('categories',{params:{type:2}}).then(res=>{
                if(res.meta.status!==200) return this.$message.error('获取列表失败!')

                this.parentsList=res.data
            })
        },
        //监听级联选择
        handleChange(val){
            this.selectKeys=val
            if(this.selectKeys.length>0){
                this.cateForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
                this.cateForm.cat_level=this.selectKeys.length
                return
            }else{
                this.cateForm.cat_pid=0
                this.cateForm.cat_level=0
            }
        },
        addModal(){
            this.getCateListFa()
            this.modal=true
        },
        closeModal(){
            this.$refs.ruleForm.resetFields()
            this.selectKeys=[]
        },
        saveCate(){
            // console.log(this.cateForm)
            
            this.$refs.ruleForm.validate(valid=>{
                if (!valid) return
                this.modal=false
                this.$http.post('categories',this.cateForm).then(res=>{
                    console.log(res)
                    if(res.meta.status!==201) return this.$message.error('添加分类失败!')

                    this.$message.success('添加成功!')
                    this.getGoodsList()
                })
            })
        }
    }
};
</script>
<style>
</style>