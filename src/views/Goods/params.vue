<template>
    <div class="params">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="mt-20">
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon
                :closable="false">
            </el-alert>

            <div class="mb-20 mt-20">
                <span>选择商品分类：</span>
                <el-cascader
                    expand-trigger="hover"
                    v-model="goodsKeys"
                    :options="goodsList"
                    @change="handleChange"
                    :props="goodsProps"
                    clearable>
                </el-cascader>
            </div>

            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="isDisableBtn" @click="modal=true">添加参数</el-button>

                    <el-table :data="manyData" border stripe class="mt-20" v-if="!isDisableBtn">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag 
                                    closable 
                                    @close="hanldeClose(index,scope.row)"
                                    v-for="(item,index) in scope.row.attr_vals" :key="index" 
                                    style="margin:10px;">
                                    {{item}}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    style="width:120px">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editText(scope.row.attr_id)">修改</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delWin(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isDisableBtn" @click="modal=true">添加属性</el-button>

                    <el-table :data="onlyData" border stripe class="mt-20" v-if="!isDisableBtn">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag 
                                    @close="hanldeClose(index,scope.row)"
                                    closable 
                                    v-for="(item,index) in scope.row.attr_vals" :key="index" 
                                    style="margin-right:20px;">
                                    {{item}}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    style="width:120px">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editText(scope.row.attr_id)">修改</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete"  @click="delWin(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加属性或参数弹窗 -->
        <el-dialog
            :title="'添加'+this.titleText"
            :visible.sync="modal"
            width="50%"
            @close="closeWin">
            <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" >
                <el-form-item :label="this.titleText" prop="attr_name">
                    <el-input v-model="ruleForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modal = false">取 消</el-button>
                <el-button type="primary" @click="saveForm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑属性或参数弹窗 -->
        <el-dialog
            :title="'修改'+this.titleText"
            :visible.sync="modal2"
            width="50%"
            @close="closeEditWin">
            <el-form :model="ruleFormEdit" :rules="rulesEdit" ref="ruleFormRefEdit" label-width="100px" >
                <el-form-item :label="this.titleText" prop="attr_name">
                    <el-input v-model="ruleFormEdit.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modal2 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'params',
    data() {
        return {
            modal:false,
            modal2:false,
            goodsKeys:[],
            goodsList:[],
            goodsProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            activeName:'many',
            manyData:[],
            onlyData:[],
            ruleForm:{
                attr_name:''
            },
            rules: {
                attr_name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
            },
            ruleFormEdit:{},
            rulesEdit:{
                attr_name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
            },
            inputVisible:false,
            inputValue:''
        };
    },
    mounted(){
        this.getGoodsList()
    },
    methods:{
        // 获取商品列表
        getGoodsList(){
            this.$http.get('categories').then(res=>{
                if(res.meta.status!==200) return this.$message.error('获取商品失败！')

                this.goodsList=res.data
            })
        },
        // 监听级联选择器变化
        handleChange(val){
            this.goodsKeys=val
            if (this.goodsKeys.length!==3) {
                this.goodsKeys=[]
                return
            }
            this.getData()
        },
        // 监听切换的tabs
        handleClick(){
            this.getData()
        },
        getData(){
            this.$http.get(`categories/${this.cateId}/attributes`,{params:{
                sel:this.activeName
            }}).then(res=>{
                if(res.meta.status!==200) return 
                
                res.data.forEach(item=>{
                    item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
                    item.inputVisible=false
                    item.inputValue=''
                })
                if(this.activeName==='many'){
                    this.manyData=res.data
                }else{
                    this.onlyData=res.data
                }
            })
        },
        closeWin(){
            this.$refs.ruleFormRef.resetFields()
        },
        closeEditWin(){
            this.$refs.ruleFormRefEdit.resetFields()
        },
        saveForm(){
            this.$refs.ruleFormRef.validate(valid=>{
                if(!valid) return
                this.$http.post(`categories/${this.cateId}/attributes`,
                {
                    attr_name:this.ruleForm.attr_name,
                    attr_sel:this.activeName
                }).then(res=>{
                    if (res.meta.status!==201) return this.$message.error('添加失败！')

                    this.$message.success('添加成功！')
                    this.modal=false
                    this.getData()
                })
            })
        },
        editText(attrId){
            this.modal2=true
            this.$http.get(`categories/${this.cateId}/attributes/${attrId}`,{
                attr_sel:this.activeName
            }).then(res=>{
                if (res.meta.status!==200) return 
                
                this.ruleFormEdit=res.data
            })
        },
        saveEdit(){
            this.$refs.ruleFormRefEdit.validate(valid=>{
                if (!valid) return

                this.$http.put(`categories/${this.cateId}/attributes/${this.ruleFormEdit.attr_id}`,
                {
                    attr_name:this.ruleFormEdit.attr_name,
                    attr_sel:this.activeName,
                }).then(res=>{
                    if(res.meta.status!==200) return this.$message.error('修改失败！')

                    this.$message.success('修改成功！')
                    this.modal2=false
                    this.getData()
                })
            })
        },
        delWin(attrId){
             this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`).then(res=>{
                        console.log(res)
                        if(res.meta.status!==200) return this.$message.error('删除失败！')

                        this.$message.success('删除成功！')
                        this.getData()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
            });
        },
        showInput(item){
            item.inputVisible=true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        // 删除标签
        hanldeClose(i,row){
            row.attr_vals.splice(i,1)
            this.editLable(row)
        },

        // 修改标签方法
        editLable(item){
            this.$http.put(`categories/${this.cateId}/attributes/${item.attr_id}`,
            {
                attr_name:item.attr_name,
                attr_sel:this.activeName,
                attr_vals:item.attr_vals.join(' ')
            }).then(res=>{
                if(res.meta.status!==200) return this.$message.error('修改失败！')
                this.$message.success('修改成功！')
            })
        },
        // 监听输入框失去焦点和点击enter键触发
        handleInputConfirm(item){
            if (item.inputValue.trim().length===0) {
                item.inputValue='';
                item.inputVisible=false
                return
            }
            
            item.attr_vals.push(item.inputValue.trim())
            item.inputValue=''
            item.inputVisible=false

            this.editLable(item)
        }
    },
    computed:{
        isDisableBtn(){
            if (this.goodsKeys.length!==3) {
                return true
            }
            return false
        },
        cateId(){
            if(this.goodsKeys.length===3){
                return this.goodsKeys[2]
            }

            return null
        },
        titleText(){
            if (this.activeName==='many') {
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    }
};
</script>
<style>
</style>