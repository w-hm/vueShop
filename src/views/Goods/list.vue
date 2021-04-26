<template>
    <div class="list">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="mt-20">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input 
                        placeholder="请输入内容" 
                        v-model="queryInfo.query"
                        @clear="getGoodsList"
                        clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="goAddGoods">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table
                class="mt-20"
                :data="goodsList"
                style="width: 100%"
                border
                stripe>
                <el-table-column type="index" ></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="110"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"  width="80"></el-table-column>
                <el-table-column label="创建时间"  width="160">
                    <template slot-scope="scope">
                        {{scope.row.add_time|dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeGoods(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                class="ta-c mt-20"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'list',
    data() {
        return {
            input3:'',
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            goodsList:[],
            total:0
        };
    },
    mounted(){
        this.getGoodsList()
    },
    methods:{

        // 获取商品列表
        getGoodsList(){
            this.$http.get('goods',{params:this.queryInfo}).then(res=>{
                console.log(res)
                if(res.meta.status!==200) return this.$message.error('获取商品列表失败！')
                this.goodsList=res.data.goods
                this.total=res.data.total
            })
            
        },

        // 监听一页多少数据
        handleSizeChange(size){
            this.queryInfo.pagesize=size
            this.getGoodsList()
        },

        // 监听现在第几页
        handleCurrentChange(page){
            this.queryInfo.pagenum=page
            this.getGoodsList()
        },
        removeGoods(goodsId){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`goods/${goodsId}`).then(res=>{
                    console.log(res)
                    if(res.meta.status!==200) return this.$message.error('删除商品失败！')

                    this.$message.success('删除成功！')
                    this.getGoodsList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        goAddGoods(){
            this.$router.push('/goods/add')
        }
    }
};
</script>
<style>
</style>