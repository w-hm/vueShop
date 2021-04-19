<template>
    <div class="roles">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="mt-20">
            <el-button type="primary">添加角色</el-button>
             <el-table
                :data="roleList"
                style="width: 100%"
                border
                stripe
                class="mt-20">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['d-f ai-c bdbottom',i1==0?'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="i1">
                            <el-col :span="5">
                                <el-tag closable @close="removeLabel(scope.row,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[i2==0?'':'bdtop']" class=" d-f ai-c" v-for="(item2,i2) in item1.children" :key="i2">
                                    <el-col :span="6">
                                        <el-tag @close="removeLabel(scope.row,item2.id)" closable type="success">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag @close="removeLabel(scope.row,item3.id)" closable type="warning" v-for="(item3,i3) in item2.children" :key="i3">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column  type="index" ></el-table-column>
                <el-table-column  prop="roleName" label="角色名称"></el-table-column>
                <el-table-column  prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column   label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="small" type="warning" icon="el-icon-setting" @click="getRightsList(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
             </el-table>
        </el-card>

        <!-- 分配权限弹窗 -->
        <el-dialog
            title="分配权限"
            :visible.sync="powerModal"
            width="50%"
            @close="resetTree">
            <el-tree 
                :data="rightsList" 
                :props="rightsTree" 
                show-checkbox 
                default-expand-all
                node-key="id"
                :default-checked-keys="defaultKeys"
                ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="powerModal = false">取 消</el-button>
                <el-button type="primary" @click="setRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'roles',
    data() {
        return {
            roleList:[],
            powerModal:false,
            rightsList:[],
            rightsTree:{
                children: 'children',
                label: 'authName'
            },
            defaultKeys:[],
            roleId:''
        };
    },
    mounted(){
        this.getRoleList()
    },
    methods:{
        // 获取角色列表
        getRoleList(){
            this.$http.get('roles').then(res=>{
                if (res.data.meta.status!==200) {
                    this.$message.error('获取角色列表失败！')
                }
                this.roleList=res.data.data
            })
        },

        // 删除角色权限
        removeLabel(role,rightId){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`roles/${role.id}/rights/${rightId}`).then(res=>{
                        if(res.data.meta.status!==200) return this.$message.error('删除失败！')

                        this.$message.success('删除权限成功！')
                        console.log(role)
                        role.children=res.data.data
                        // roleId=res.data.data
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },

        // 分配权限列表
        getRightsList(role){
            this.roleId=role.id
            this.$http.get('rights/tree').then(res=>{
                if(res.data.meta.status!==200) return this.$message.error('获取权限列表失败！')

                this.rightsList=res.data.data
            })
            this.getKeys(role,this.defaultKeys)
            this.powerModal=true
        },
        // 获取当前角色下已被勾选的权限
        getKeys(node,arr){
            if(!node.children){
               return arr.push(node.id)
            }

            node.children.forEach(item=>{
                this.getKeys(item,arr)
            })
        },
        // 重置defaultKeys数组
        resetTree(){
            this.defaultKeys=[]
        },
        setRights(){
            var keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
            var keysStr=keys.join(',')
            this.$http.post(`roles/${this.roleId}/rights`,
            {rids:keysStr}).then(res=>{
                console.log(res)
                if (res.data.meta.status!==200) return this.$message.error('分配权限失败！')
            
                this.getRoleList()
            })
            this.powerModal=false
        }
    }
};
</script>
<style scoped lang="less">
    .el-tag{
        margin: 7px;
    }
</style>