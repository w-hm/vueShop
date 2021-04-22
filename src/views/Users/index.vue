<template>
    <div class="users">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="users-box1">
            <el-card>
                <div >
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-input 
                                placeholder="请输入内容" 
                                v-model="queryInfo.query"  
                                class="input-with-select"
                                clearable
                                @clear="getUserList">
                                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" @click="addModal=true">添加用户</el-button>
                        </el-col>
                    </el-row>
                    <el-table
                        stripe
                        :data="userList"
                        border
                        class="mt-20">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="username" label="姓名"></el-table-column>
                        <el-table-column prop="email" label="邮箱"></el-table-column>
                        <el-table-column prop="mobile" label="电话"></el-table-column>
                        <el-table-column prop="role_name" label="角色"></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.mg_state" @change="userState(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                                    <el-button  type="primary"  icon="el-icon-edit" size="mini" @click="fixUser(scope.row.id)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                                    <el-button  type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                                    <el-button  type="warning" icon="el-icon-setting" size="mini" @click="setRoleRight(scope.row)"></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-size="queryInfo.pagesize"
                        :page-sizes="[1, 2, 5, 10]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        class="mt-20 ta-c">
                    </el-pagination>
                </div>
            </el-card>
        </div>
        <!-- 添加用户弹窗 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addModal"
            width="50%"
            @close="closeWin"
            >
            <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addModal = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
    
        <!-- 编辑用户弹窗 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="editModal"
            width="50%"
            @close="closeWin2"
            >
            <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editModal = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限弹窗 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setRole"
            width="50%"
            @close="setRoleClose">
            <div>
                <p class="mb-20">当前用户：{{rightInfo.username}}</p>
                <p class="mb-20">当前角色：{{rightInfo.role_name}}</p>
                <p>
                    分配新角色：
                    <el-select v-model="currentRole" placeholder="请选择">
                        <el-option
                        v-for="item in roleRightsList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRole = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'users',
    data() {
        // 验证邮箱规则
        var checkEmail=(rule,val,cb)=>{
            const regEmail=/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/

            if(regEmail.test(val)){
                return cb()
            }

            cb(new Error('请输入合法邮箱！'))
        }

        // 验证手机号规则
        var checkMobile=(rule,val,cb)=>{
            const regMobile=/^1[34578]\d{9}$/

            if(regMobile.test(val)){
                return cb()
            }

            cb(new Error('请输入正确手机号！'))
        }
        return {
            userList: [],
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            total:0,
            addModal:false,
            editModal:false,
            addForm:{
                username:'xxx',
                password:'xxxxxx',
                email:'xxx@qq.com',
                mobile:'13333333333'
            },
            addRules:{
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator:checkEmail , trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator:checkMobile , trigger: 'blur'}
                ],
            },
            editForm:{
                email:'',
                mobile:''
            },

            editRules:{
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator:checkEmail , trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator:checkMobile , trigger: 'blur'}
                ],
            },
            setRole:false,
            rightInfo:[],
            roleRightsList:[],
            currentRole:''
        };
    },
    mounted(){
        this.getUserList();
    },
    methods:{
        // 获取用户列表
        getUserList(){
            this.$http.get('users',{params:this.queryInfo}).then(res=>{
                if(res.meta.status!==200) return this.$message.error(res.meta.msg);
                this.userList=res.data.users
                this.total=res.data.total
            })
        },
        // 当前数据多少条
        handleSizeChange(val){
            this.queryInfo.pagesize=val
            this.getUserList()
        },

        // 当前页
        handleCurrentChange(val){
            this.queryInfo.pagenum=val
            this.getUserList()
        },
        // 更新用户状态
        userState(userInfo){
            this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(res=>{
                if (res.meta.status!==200) {
                    this.$message.error('更新用户状态失败')
                }

                this.$message.success('更新用户状态成功')
            })
        },

        // 监听添加客户弹窗关闭
        closeWin(){
            this.$refs.addRef.resetFields()
        },
         closeWin2(){
            this.$refs.editRef.resetFields()
        },
        // 新增用户
        addUser(){
            this.$refs.addRef.validate(val=>{
                if(!val) return

                this.$http.post('users',this.addForm).then(res=>{
                    if(res.meta.status!==201){
                        this.$message.error('新增用户失败')
                    }else{
                        this.$message.success('添加成功')
                    }
                    this.getUserList()
                    this.addModal=false
                })
            })
        },
        // 修改用户
        fixUser(id){
            this.$http.get('users/'+id).then(res=>{
                this.editForm=res.data
            })
            this.editModal=true
        },
        // 提交编辑好的用户信息
        submitEdit(){
            this.$refs.editRef.validate(val=>{
                if (val) {
                    this.$http.put(`users/${this.editForm.id}`,this.editForm).then(res=>{
                        if(res.meta.status!==200) return this.message.error('修改失败！')

                        this.$message.success('更新用户信息成功！')
                        this.editModal=false;
                        this.getUserList()
                    })
                }
            })
        },
        // 删除用户
        removeUser(id){
            // console.log(id)
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    this.$http.delete(`users/${id}`).then(res=>{
                        console.log(res)
                        if(res.meta.status!==200) return this.$message.error(re.meta.msg)

                        this.$message.success('删除用户成功')
                        this.getUserList()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        // 分配权限
        setRoleRight(rightInfo){
            this.$http.get('roles').then(res=>{
                if(res.meta.status!==200) return this.$message.error('获取角色权限失败！')
                this.roleRightsList=res.data
            })
            this.rightInfo=rightInfo
            this.setRole=true
        },
        // 保存分配角色
        saveRoleInfo(){
            if(!this.currentRole) return this.$message.error('请选择用户角色！')

            this.$http.put(`users/${this.rightInfo.id}/role`,{
                rid:this.currentRole
            }).then(res=>{
                if(res.meta.status!==200) return this.$message.error('更改角色失败！')
                
                this.$message.success('更改角色成功！')
                this.setRole=false
                this.getUserList()
            })
        },
        // 监听关闭分配弹窗
        setRoleClose(){
            this.currentRole='';
            this.rightInfo={}
        }
    }
};
</script>
<style lang="less" scoped>
    .users{
        &-box1{
            margin-top: 20px;
        }
    }
</style>