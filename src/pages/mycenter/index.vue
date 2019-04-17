
<template>
  <div class="freeRoom">
    <div class="selectTime" @click="selectTime">选择时间</div>
    <div>
        <div class="timeText">{{year}}年{{month}}月{{day}}日</div>
        <picker-view class="pickerView" :value="value" @change="bindDateChangeStart">
            <picker-view-column class="pickerColumn">
                <div class="pickerItem" v-for="(item,key) in years" :key='key'>{{item}}年</div>
            </picker-view-column>
            <picker-view-column class="pickerColumn">
                <div class="pickerItem" v-for="(item,key) in months" :key='key'>{{item}}月</div>
            </picker-view-column>
            <picker-view-column class="pickerColumn">
                <div class="pickerItem" v-for="(item,key) in days" :key='key'>{{item}}日</div>
            </picker-view-column>
        </picker-view>
    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            years: [],
            months: [],
            days: [],
            year: 0,
            month: 0,
            day: 0,
            value: [8, 1, 1]
        }
    },
    onLoad () {
        this.initDatas()
    },

    methods: {
        initDatas () {
            // 获取当前年月
            const date = new Date()
            const nowYear = date.getFullYear()
            const nowMonth = date.getMonth() + 1
            const nowDay = date.getDate()
            this.year = nowYear
            this.month = nowMonth
            this.day = nowDay
            // 循环前先清空数组
            this.years = []
            this.months = []
            // 2010年到2028年
            for (let i = 2010; i <= nowYear + 10; i++) {
                this.years.push(i)
            }
            // 设置月份列表
            for (let i = 1; i <= 12; i++) {
                this.months.push(i)
            }
            // 初始化当前年月
            this.getMonth(nowYear, nowMonth, nowDay)
        },
        getMonth (year, month, day) {
            let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            let dayNum = 0
            // 通过年和月获取这个月份下有多少天
            if (month === 2) { // 闰年
                dayNum = ((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0) ? 29 : 28
            } else {
                dayNum = daysInMonth[month - 1]
            }
            this.days = []
            for (let i = 1; i <= dayNum; i++) {
                this.days.push(i)
            }
            // 初始 选中年月日对应下标
            let yearIdx = 0
            let monthIdx = 0
            let dayIdx = 0
 
            // 获取滚动后 年月日对应的下标
            this.years.map((v, idx) => {
                if (v === year) {
                    yearIdx = idx
                }
            })
            this.months.map((v, idx) => {
                if (v === month) {
                    monthIdx = idx
                }
            })
            this.days.map((v, idx) => {
                if (v === day) {
                    dayIdx = idx
                }
            })
            // 重置滚动后 年月日 的下标
            this.value = [yearIdx, monthIdx, dayIdx]
            // 赋值年月日
            this.year = this.years[yearIdx]
            this.month = this.months[monthIdx]
            this.day = this.days[dayIdx]
        },
        bindDateChangeStart (e) {
          console.log(e)
            // valIndex 是获取到的年月日在各自集合中的下标
            const valIndex = e.mp.detail.value
            // console.log(JSON.stringify(e.mp.detail.value))
            let year = this.years[valIndex[0]]
            let month = this.months[valIndex[1]]
            let day = this.days[valIndex[2]]
            // 滚动时再动态 通过年和月获取 这个月下对应有多少天
            this.getMonth(year, month, day)
        }
    }
}
</script>


<style lang="less" scoped>
    .freeRoom{
        .timeText{
            text-align: center;
        }
        .pickerView{
            width:100%;
            height: 300rpx;
            margin-top: 100rpx;
            .pickerColumn{
                .pickerItem{
                    line-height:68rpx;
                    height:34rpx;
                    overflow:hidden;
                    text-align: center;
                }
            }
        }
    }
</style>

