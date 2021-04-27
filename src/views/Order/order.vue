<template>
    <div class="order">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="mt-20">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input 
                        placeholder="请输入内容" 
                        v-model="queryInfo.query"
                        @clear="getOrderList"
                        clearable>
                        <el-button slot="append" icon="el-icon-search" ></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table
                :data="orderList"
                style="width: 100%"
                border
                stripe
                class="mt-20">
                <el-table-column type="index"></el-table-column>
                <el-table-column  label="订单编号" prop="order_number"></el-table-column>
                <el-table-column  label="订单价格" prop="order_price" width="100"></el-table-column>
                <el-table-column  label="是否付款" prop="pay_status" width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.pay_status==='0'?'danger':'success'">
                            {{scope.row.pay_status==='0'?'未付款':'已付款'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="是否发货" prop="is_send" width="100"></el-table-column>
                <el-table-column  label="下单时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.create_time|dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="140">
                    <template>
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="editModal"></el-button>
                        <el-button size="mini" type="success" icon="el-icon-location" @click="progressBox=true"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 3, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="ta-c mt-20">
            </el-pagination>
        </el-card>


        <!-- 修改地址 -->
        <el-dialog
            title="修改地址"
            :visible.sync="editAddress"
            width="50%"
            @close="closeWin">
            <el-form 
                :model="addressForm" :rules="addressRules" 
                ref="ruleFormAddress" label-width="100px" >
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1" style="width:100%;"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAddress = false">取 消</el-button>
                <el-button type="primary" @click="editAddress = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 物流信息 -->
        <el-dialog
            title="物流信息"
            :visible.sync="progressBox"
            width="50%"
            >
            <el-timeline>
                <el-timeline-item 
                    v-for="(progerss,index) in progressInfo" 
                    :key="index"
                    :timestamp="progerss.time">
                    {{progerss.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityData from "./citydata.js"
export default {
    name:'order',
    data() {
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            orderList:[],
            total:0,
            editAddress:false,
            addressForm:{
                address1:[],
                address2:''
            },
            addressRules:{
                address1: [
                    { required: true, message: '请选择省市区', trigger: 'blur' },
                ],
                address2: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ],
            },
            cityData,
            progressBox:false,
            progressInfo:[
                {
                    "time": "2018-05-10 09:39:00",
                    "ftime": "2018-05-10 09:39:00",
                    "context": "已签收,感谢使用顺丰,期待再次为您服务",
                    "location": ""
                },
                {
                    "time": "2018-05-10 08:23:00",
                    "ftime": "2018-05-10 08:23:00",
                    "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    "location": ""
                },
                {
                    "time": "2018-05-10 07:32:00",
                    "ftime": "2018-05-10 07:32:00",
                    "context": "快件到达 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-10 02:03:00",
                    "ftime": "2018-05-10 02:03:00",
                    "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 23:05:00",
                    "ftime": "2018-05-09 23:05:00",
                    "context": "快件到达 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 21:21:00",
                    "ftime": "2018-05-09 21:21:00",
                    "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 13:07:00",
                    "ftime": "2018-05-09 13:07:00",
                    "context": "顺丰速运 已收取快件",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:25:03",
                    "ftime": "2018-05-09 12:25:03",
                    "context": "卖家发货",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:22:24",
                    "ftime": "2018-05-09 12:22:24",
                    "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                    "location": ""
                },
                {
                    "time": "2018-05-08 21:36:04",
                    "ftime": "2018-05-08 21:36:04",
                    "context": "商品已经下单",
                    "location": ""
                }
            ]
        };
    },
    mounted(){
        this.getOrderList()
    },
    methods:{
        // 获取订单数据
        getOrderList(){
            this.$http.get('orders',{
                params:this.queryInfo
            }).then(res=>{
                if(res.meta.status!==200) return this.$message.error('获取订单失败！')

                this.total=res.data.total
                this.orderList=res.data.goods
            })
        },

        // 当前数据条数改变
        handleSizeChange(size){
            this.queryInfo.pagesize=size
            this.getOrderList()
        },

        // 当前页该改变
        handleCurrentChange(page){
            this.queryInfo.pagenum=page
            this.getOrderList()
        },

        editModal(){
            this.editAddress=true
        },
        closeWin(){
            this.$refs.ruleFormAddress.resetFields()
        },
    }
};
</script>
<style>
    .el-dialog__body{
        padding: 30px 60px;
    }
</style>