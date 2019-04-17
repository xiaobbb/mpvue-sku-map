<template>
  <div>
    <div class="picker_content">
      <div class="picker_title">
        <span class="title_cancel" @click="cancelChooseDate">取消</span>
        <span class="title_text">请选择{{data}}时间</span>
        <span class="title_submit" @click="submitChooseDate">确定</span>
      </div>
      <div class="picker_body">
        <div class="center_body"></div>
        <div class="body_year item" @scroll.prevent="scrollDate('year')">
          <div class="year_body" v-for="(item, index) in yearData" :key="index">
            <span class="year_text">{{item}}</span>
          </div>
        </div>
        <scroll-view class="body_month item" :scroll-y="true" @scrolltolower="scrollDate('month')" @scroll="scroll">
          <div class="month_body" v-for="(item, index) in monthData" :key="index">
            <span class="month_text">{{item}}</span>
          </div>
        </scroll-view>
        <div class="body_day item" @scroll.prevent="scrollDate('day')">
          <div class="day_body" v-for="(item, index) in dayData" :key="index">
            <span class="day_text">{{item}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      default: ''
    },
    theDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      initData: ['1', '2', '3', '4', '5'],
      yearData: ['', '', '2018年', '2019年', '2020年', '2021年', '2022年', '', ''],
      monthData: ['', '', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月' ,'11月', '12月', '', ''],
      allDayData: ['', '', '1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号', '', ''],
      dayData: [],
      year: undefined,
      month: undefined,
      day: undefined,
      temp: {
        selectedMonth: undefined,
        selectedDay: undefined,
        beginOrEnd: undefined
      }
    }
  },
  created() {
    this.dayData = this.allDayData
  },
  watch: {
    theDate: 'initDate'
  },
  methods: {
    initDate() {
      let _date = new Date()
      let _year = _date.getFullYear() + '年'
      let _month = this.theDate.split('月')[0] + '月'
      let _day = this.theDate.split('月')[1]
      //定位当前年份并高亮
      for (const v of this.yearData) {
        if (_year == v) {
          document.getElementsByClassName('body_year')[0].scrollTop = (this.yearData.indexOf(v) - 2) * 42
          document.getElementsByClassName('body_year')[0].children[this.yearData.indexOf(v)].children[0].classList.add('selected_style')
        }
      }
      //定位当前月份并高亮
      for (const v of this.monthData) {
        if (_month == v) {
          document.getElementsByClassName('body_month')[0].scrollTop = (this.monthData.indexOf(v) - 2) * 42
          document.getElementsByClassName('body_month')[0].children[this.monthData.indexOf(v)].children[0].classList.add('selected_style')
        }
      }
      //定位当前天数并高亮
      for (const v of this.dayData) {
        if (_day == v) {
          document.getElementsByClassName('body_day')[0].scrollTop = (this.dayData.indexOf(v) - 2) * 42
          document.getElementsByClassName('body_day')[0].children[this.dayData.indexOf(v)].children[0].classList.add('selected_style')
        }
      }
    },
    scrollDate(data) {
        console.log(123)
      let _yearArr = []
      let _monthArr = []
      let _dayArr = []

      for (const v of document.getElementsByClassName('body_year')[0].children) {
        _yearArr.push(v)
      }

      for (const v of document.getElementsByClassName('body_month')[0].children) {
        _monthArr.push(v)
      }
      
      for (const v of document.getElementsByClassName('body_day')[0].children) {
        _dayArr.push(v)
      }

      if (data == 'year') {
        let a = document.getElementsByClassName('body_year')[0].scrollTop
        let year = undefined
        let month = undefined
        //取当前高亮月份
        for (const v of _monthArr) {
          if (v.children[0].classList[1] == 'selected_style') {
            month = parseInt(v.children[0].innerText.slice(0, -1))
          }
        }
        
        for (const v of _yearArr) {
          if (((2 + parseInt(a/42)) == _yearArr.indexOf(v)) && (a%42 <= 21)) {
            v.children[0].classList.add('selected_style')
            //取当前高亮年份
            year = parseInt(v.children[0].innerText.slice(0, -1))
            //根据当前月份判断天数
            if (month == '1' || month == '3' || month == '5' || month == '7' || month == '8' || month == '10' || month == '12') {
              this.dayData = this.allDayData
            }
            if (month == '4' || month == '6' || month == '9' || month == '11') {
              this.dayData = this.allDayData.slice(0, -3)
              this.dayData.push('')
              this.dayData.push('')
            }
            //当前月份为二月份时联合当前年份判断天数
            if (month == '2' && year%4 == 0) {
              this.dayData = this.allDayData.slice(0, -4)
              this.dayData.push('')
              this.dayData.push('')
            }
            if (month == '2' && year%4 != 0) {
              this.dayData = this.allDayData.slice(0, -5)
              this.dayData.push('')
              this.dayData.push('')
            }
          } else {
            v.children[0].classList.remove('selected_style')
          }
        }
      }

      if (data == 'month') {
        let a = document.getElementsByClassName('body_month')[0].scrollTop
        let year = undefined
        //取当前高亮年份
        for (const v of _yearArr) {
          if (v.children[0].classList[1] == 'selected_style') {
            year = parseInt(v.children[0].innerText.slice(0, -1))
          }
          for (const v of _monthArr) {
            if (((2 + parseInt(a/42)) == _monthArr.indexOf(v)) && (a%42 <= 21)) {
              v.children[0].classList.add('selected_style')
              //取当前高亮月份
              let month = parseInt(v.children[0].innerText.slice(0, -1))
              //判断该月份确定天数
              if (month == '1' || month == '3' || month == '5' || month == '7' || month == '8' || month == '10' || month == '12') {
                this.dayData = this.allDayData
              }
              if (month == '4' || month == '6' || month == '9' || month == '11') {
                this.dayData = this.allDayData.slice(0, -3)
                this.dayData.push('')
                this.dayData.push('')
              }
              //当前月份为二月份时联合当前年份判断天数
              if (month == '2' && year%4 == 0) {
                this.dayData = this.allDayData.slice(0, -4)
                this.dayData.push('')
                this.dayData.push('')
              }
              if (month == '2' && year%4 != 0) {
                this.dayData = this.allDayData.slice(0, -5)
                this.dayData.push('')
                this.dayData.push('')
              }
            } else {
              v.children[0].classList.remove('selected_style')
            }
          }
        }
      }  

      if (data == 'day') {
        let a = document.getElementsByClassName('body_day')[0].scrollTop

        for (const v of _dayArr) {
          if (((2 + parseInt(a/42)) == _dayArr.indexOf(v)) && (a%42 <= 21)) {
            v.children[0].classList.add('selected_style')
          } else {
            v.children[0].classList.remove('selected_style')
          }
        }
      }
    },
    cancelChooseDate() {
      this.$emit('closeTimePicker', false)
    },
    submitChooseDate() {
      let _monthArr = []
      let _dayArr = []
      for (const v of document.getElementsByClassName('body_month')[0].children) {
        _monthArr.push(v)
      }
      for (const v of document.getElementsByClassName('body_day')[0].children) {
        _dayArr.push(v)
      }

      for (const v of _monthArr) {
        if (v.children[0].classList[1] == 'selected_style') {
          this.temp.selectedMonth = v.children[0].innerText
        }
      }

      for (const v of _dayArr) {
        if (v.children[0].classList[1] == 'selected_style') {
          this.temp.selectedDay = v.children[0].innerText
        }
      }

      this.temp.beginOrEnd = this.data

      this.$emit('chooseDate', this.temp)
    }
  }
}
</script>
<style scoped>
 .picker_body{
     display:flex;
     justify-content:space-between;
     border:1px solid red;
     width:100%;
 }
 
.item{
    border:1px solid blue;
    height:200rpx;
    width:30%;
}
</style>