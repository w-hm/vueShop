<template>
    <div class="report">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="mt-20">
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from "lodash"
export default {
    name:'report',
  data() {
    return {
        options: {
            title: {
                text: '用户来源'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#E9EEF3'
                }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                boundaryGap: false
                }
            ],
            yAxis: [
                {
                type: 'value'
                }
            ]
        }
    };
  },
  mounted(){
        var myChart=echarts.init(document.getElementById('main'));

        this.$http.get('reports/type/1').then(res=>{
            if (res.meta.status!==200) return this.$message.error('获取图表失败！')

            const newObj=_.merge(res.data,this.options)
            myChart.setOption(newObj);
        })
  },
  methods:{
  }
};
</script>
<style>
</style>