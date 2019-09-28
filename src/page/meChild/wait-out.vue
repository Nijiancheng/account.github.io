<template>
  <div class="wait-out">
    <div class="wait-out-top">
      <m-header :title="title" :is_goBack="is_goBack"></m-header>
      <div class="m-wait-out-main-top wait-out_top_select">
        <a @click="changeDate('m')" :class="{'selected':changeDateType=='m'?true:false}">当月待付</a>
        <a @click="changeDate('q')" :class="{'selected':changeDateType=='q'?true:false}">季度待付</a>
        <a @click="changeDate('y')" :class="{'selected':changeDateType=='y'?true:false}">年度待付</a>
      </div>
      <div class="transition">
        <div class="transition-left">
          {{date_name}}:
          <br />
          <span class="green">{{start_date}}</span> -
          <span class="green">{{end_date}}</span>
        </div>
        <div class="transition-right">
          总待付金额:
          <br />
          <span class="orange bigfont">{{ parseFloat(list.total).toFixed(2)}}</span>
        </div>
      </div>
    </div>
    <van-swipe-cell v-for="(item,index) in list.list" :key="index">
      <div class="wait-out-list" @click="goToRouter(item.type,item.id)">
        <div class="wait-out-list-left">
          <span v-if="red = item.type==2?true:false"></span>
          <span class="wait-out-list-left-iconfont iconfont" :class="{'red':red} ">&#xe644;</span>
          <div class="wait-out-list-left-title">
            <div class="wait-out-list-left-info">
              <span>{{item.company_name}}</span>
            </div>
            <div
              v-if="item.total_money-item.paid_money"
              :class="{'red':red,'green':!red}"
              class="wait-out-list-left-info wait-budget"
            >
              <span>待付款:</span>
              <span>{{item.total_money-item.paid_money}}</span>
            </div>
            <div class="wait-out-list-left-info">{{item.date}}</div>
          </div>
        </div>
        <div class="wait-out-list-right-money">
          <span>{{item.total_money}}</span>
          <span class="iconfont write-icon">&#xe8f2;</span>
        </div>
      </div>
      <template slot="right">
        <van-button square type="danger" text="删除" @click="del(item.id)" />
      </template>
    </van-swipe-cell>
    <div class="none" v-if="list==''">--暂无数据--</div>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import qs from "qs";
import api from "../../api";
import { SwipeCell, Cell, Button, Dialog, Toast, CellGroup, Popup } from "vant";
export default {
  data() {
    return {
      currentDate: new Date(),
      token: "",
      list: {},
      title: "账面收支明细",
      is_goBack: true,
      start_date: "",
      end_date: "",
      date_name: "当月",
      changeDateType: "m",
      screen_start: "",
      screen_end: "",
      timeType: ""
    };
  },
  components: {
    mHeader,
    [SwipeCell.name]: SwipeCell,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    [Popup.name]: Popup
  },
  methods: {
    constructor() {
      this.token = localStorage.getItem("token");
      this.changeToMonth();
    },
    getWaitIncome() {
      //  待付列表
      this.axios
        .get(api.WaitRP + this.token, {
          params: {
            begin_date: this.start_date,
            end_date: this.end_date,
            type: 2
          }
        })
        .then(response => {
          // console.log(response);
          this.list = response.data.data;
          // console.log(this.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    del(id) {
      Dialog.confirm({
        title: "删除",
        message: "确认删除该条数据嘛？"
      })
        .then(() => {
          this.axios
            .post(
              api.Del.Url1 +
                id +
                api.Del.Url2 +
                localStorage.getItem("token")
            )
            .then(response => {
              // console.log(response);
              if (response.data.status) {
                Toast("删除成功");
                this.getWaitIncome();
              }
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    changeDate(val) {
      this.changeDateType = val;
      if (val == "m") {
        this.changeToMonth();
      } else if (val == "q") {
        this.changeToQuarter();
      } else if (val == "y") {
        this.changeToYear();
      } else {
        this.getWaitIncome();
      }
    },
    changeToMonth() {
      // 时间

      let yy = this.currentDate.getFullYear();
      let mm = (this.currentDate.getMonth() + 1).toString().padStart(2, 0);
      let time = new Date(yy, mm, 0);
      let dd = time
        .getDate()
        .toString()
        .padStart(2, 0);
      //   console.log(dd);
      this.screen_start = this.start_date = yy + "-" + mm + "-01";
      this.screen_end = this.end_date = yy + "-" + mm + "-" + dd;
      this.date_name = "当月";
      this.getWaitIncome();
    },
    changeToYear() {
      let yy = this.currentDate.getFullYear();
      this.screen_start = this.start_date = yy + "-01" + "-01";
      this.screen_end = this.end_date = yy + "-12" + "-31";
      this.date_name = "今年";
      this.getWaitIncome();
    },
    changeToQuarter() {
      let year = this.currentDate.getFullYear();
      let month = this.currentDate.getMonth() + 1;
      let quarter = this.getQuarterStartMonth(month);
      if (quarter != 0) {
        //获取季度最后一天
        var lastDay = new Date(year, quarter + 2, 0);
        this.screen_start = this.start_date =
          year + "-" + quarter.toString().padStart(2, 0) + "-01";
        this.screen_end = this.end_date =
          year +
          "-" +
          (quarter + 2).toString().padStart(2, 0) +
          "-" +
          lastDay.getDate();
        this.date_name = "本季度";
        this.getWaitIncome();
      }
    },
    goToRouter(type, id) {
      localStorage.setItem("detail_type", type);
      localStorage.setItem("detail_id", id);
      this.$router.push("/account-detail");
    },
    getQuarterStartMonth(month) {
      let quarterStartMonth = 0;
      if (month < 4) {
        quarterStartMonth = 1;
      }
      if (3 < month && month < 7) {
        quarterStartMonth = 4;
      }
      if (6 < month && month < 10) {
        quarterStartMonth = 7;
      }
      if (month > 9) {
        quarterStartMonth = 10;
      }
      return quarterStartMonth;
    },
    getDateTime(value) {
      // console.log(value);
      // console.log(this.timeType);
      let yy = this.currentDate.getFullYear();
      let mm = this.currentDate.getMonth() + 1;
      mm = mm < 10 ? "0" + mm : mm;
      let dd = this.currentDate.getDate();
      dd = dd < 10 ? "0" + dd : dd;
      if (this.timeType == 1) {
        this.screen_start = yy + "-" + mm + "-" + dd;
      } else if (this.timeType == 2) {
        this.screen_end = yy + "-" + mm + "-" + dd;
      }
      this.show = false;
    }
  },
  created() {
    this.constructor();
  }
};
</script>

<style scoped lang="less">
// .bigfont {
//   font-size: 20px;
// }
.wait-out {
  position: absolute;
  width: 100%;
  min-height: 100%;
  top: 0;
  z-index: 500;
  background-color: #fff;
  padding-top: 157px;
  box-sizing: border-box;
  .m-wait-out-main-top {
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    background-color: #78d666;
    color: #fff;
    text-align: left;
    display: flex;
  }
  .m-wait-out-main-top > div {
    flex: 1;
    padding: 5px 15px;
  }
  .m-wait-out-main-top > div > p > span {
    font-size: 25px;
  }
  .small-font {
    font-size: 14px;
  }
  .green {
    color: green;
  }
  .orange {
    color: orange;
  }
  .selected {
    color: #78d666 !important;
    background-color: #ffe;
  }
  .wait-out-top {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #78d666;
    z-index: 999;
  }
  .wait-out-list {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding: 0px 15px;
    font-size: 16px;
    align-items: center;
    background: #fff;
    position: relative;
    left: 0;
  }
  .wait-out-list .wait-out-list-left {
    display: flex;
    align-items: center;
    .wait-out-list-left-iconfont {
      color: #57a976;
      font-size: 40px;
      display: inline-block;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: #eee;
      text-align: center;
      line-height: 45px;
      margin: 10px 10px 10px 0;
    }
  }
  .wait-out-list-left-info {
    min-height: 20px;
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 15px;
  }
  .van-swipe-cell__right button {
    height: 100%;
  }
  .red {
    color: red !important;
  }
  .none {
    width: 100%;
    background-color: #fff;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    color: #333;
    text-align: center;
  }

  .wait-out_top_select {
    display: flex;
    justify-content: space-around;
    background-color: #78d666;
    a {
      color: #ffe;
      display: flex;
      align-items: center;
      padding: 0 5px;
      height: 35px;
      border: 1px solid #ffe;
      border-radius: 5px;
      margin: 5px;
    }
  }
  .transition {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #eee;
    color: #555;
    padding:5px 15px;
  }
  .transition-right {
    text-align: right;
  }
  .wait-budget {
    border: 1px solid;
    border-radius: 15px;
    padding: 1px 10px;
  }
}
</style>
