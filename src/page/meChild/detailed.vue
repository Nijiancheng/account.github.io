<template>
  <div class="detailed">
    <div class="detailed-top">
      <m-header :title="title" :is_goBack="is_goBack" :is_select="is_select"></m-header>
      <div class="detailed-main-top">
        <div class="detailed-left">
          <span class="detailed-datetime small-font">账面收入</span>
          <p class="detailed-datetime">
            <span>{{Number(list.in).toFixed(2)}}</span>
          </p>
        </div>
        <div class="detailed-center">
          <span class="detailed-datetime small-font">账面支出</span>
          <p class="detailed-datetime">
            <span class="red">{{Number(list.out).toFixed(2)}}</span>
          </p>
        </div>
        <div class="detailed-right">
          <span class="detailed-datetime small-font">账面利润</span>
          <p class="detailed-datetime">
            <span class="orange">{{Number(list.in-list.out).toFixed(2)}}</span>
          </p>
        </div>
      </div>
      <div class="detailed_top_select">
        <a @click="changeDate('m')" :class="{'selected':changeDateType=='m'?true:false}">当月收支</a>
        <a @click="changeDate('q')" :class="{'selected':changeDateType=='q'?true:false}">季度收支</a>
        <a @click="changeDate('y')" :class="{'selected':changeDateType=='y'?true:false}">年度收支</a>
      </div>
      <div class="transition">
        {{date_name}}:
        <span class="green">{{start_date}}</span> -
        <span class="green">{{end_date}}</span>
      </div>
      <div class="screenButton" @click="openScreen"></div>
    </div>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-swipe-cell v-for="(item,index) in lists" :key="index">
          <div class="detailed-list" @click="goToRouter(item.type,item.id)">
            <div class="detailed-list-left">
              <span v-if="red = item.type==2?true:false"></span>
              <span class="detailed-list-left-iconfont iconfont" :class="{'red':red} ">&#xe644;</span>
              <div class="detailed-list-left-title">
                <div class="detailed-list-left-info">
                  <span>{{item.company_name}}</span>
                </div>
                <span
                  v-if="item.total_money-item.paid_money"
                  :class="{'red':red,'green':!red}"
                  class="detailed-list-left-info wait-budget"
                >
                  <span>待{{red?'付款:':'收款:'}}</span>
                  <span>{{item.total_money-item.paid_money}}</span>
                </span>
                <div class="detailed-list-left-info">{{item.date}}</div>
              </div>
            </div>
            <div class="detailed-list-right-money">
              <span>{{item.total_money}}</span>
              <span class="iconfont write-icon">&#xe8f2;</span>
            </div>
          </div>
          <template slot="right">
            <van-button square type="danger" text="删除" @click="del(item.id)" />
          </template>
        </van-swipe-cell>
      </van-list>
    </van-pull-refresh>

    <div class="none" v-if="list==''">--暂无数据--</div>

    <div class="detailed-screen" v-if="screen">
      <div class="detailed-screen-top">
        <span class="iconfont" @click="closeScreen">&#xe641;</span>
        <div>账面收支筛选</div>
      </div>
      <div class="detailed-screen-list" @click="showPopup(1)">
        <span>开始日期</span>
        <span>{{screen_start}}</span>
      </div>
      <div class="detailed-screen-list" @click="showPopup(2)">
        <span>结束日期</span>
        <span>{{screen_end}}</span>
      </div>
      <div class="detailed-screen-list" @click="showPopup1">
        <span>收入支出</span>
        <span>{{screen_budget==3?'不限':screen_budget==2?'支出':'收入'}}</span>
      </div>
      <div class="detailed-screen-list" @click="showPopup2">
        <span>收支类别</span>
        <span>{{screen_type==''?'不限':screen_budget==2?outType[screen_type].name:incomeType[screen_type].name}}</span>
      </div>

      <div class="detailed-screen-button">
        <button @click="screened">筛选</button>
      </div>

      <!-- 日期 -->
      <van-popup v-model="show" position="bottom" :style="{height:'30%'}">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          @confirm="getDateTime"
          @cancel="closeShow"
        />
      </van-popup>
      <!-- 单选 -->
      <van-popup v-model="show1" :style="{ width: '90%' }">
        <van-radio-group v-model="radio" @change="budgetChange">
          <van-cell-group>
            <van-cell title="不限" clickable @click="radio = '3'">
              <van-radio slot="right-icon" name="3" />
            </van-cell>
            <van-cell title="收入" clickable @click="radio = '1'">
              <van-radio slot="right-icon" name="1" />
            </van-cell>
            <van-cell title="支出" clickable @click="radio = '2'">
              <van-radio slot="right-icon" name="2" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-popup>
      <!-- 单选收支类别 -->
      <van-popup v-model="show2" :style="{ width: '90%' }">
        <van-radio-group v-model="radios" @change="typeChange">
          <van-cell-group>
            <van-cell title="不限" clickable @click="radios = ''">
              <van-radio slot="right-icon" name />
            </van-cell>
            <van-cell
              :title="items.name"
              clickable
              @click="radios = index"
              v-for="(items,index) in screen_budget==3?'':screen_budget==2?outType:incomeType"
              :key="index"
            >
              <van-radio slot="right-icon" :name="index" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-popup>
    </div>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import qs from "qs";
import api from "../../api";
import {
  SwipeCell,
  Cell,
  Button,
  Dialog,
  Toast,
  CellGroup,
  DatetimePicker,
  RadioGroup,
  Radio,
  Popup,
  PullRefresh,
  List
} from "vant";
export default {
  data() {
    return {
      currentDate: new Date(),
      dateTime: new Date(),
      token: "",
      list: {},
      lists: [],
      type: {},
      title: "账面收支明细",
      is_goBack: true,
      is_select: true,
      start_date: "",
      end_date: "",
      date_name: "当月",
      budget_type: "3",
      category: "",
      changeDateType: "m",
      show: false,
      show1: false,
      show2: false,
      screen: false,
      screen_start: "",
      screen_end: "",
      screen_budget: "3",
      screen_type: "",
      radio: "3",
      radios: "",
      incomeType: {},
      outType: {},
      timeType: "",
      isLoading: false,
      loading: false,
      finished: false,
      page: 1,
      num: 0,
      loop: 0
    };
  },
  components: {
    mHeader,
    [SwipeCell.name]: SwipeCell,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    [Toast.name]: Toast,
    [DatetimePicker.name]: DatetimePicker,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Popup.name]: Popup,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List
  },
  methods: {
    constructor() {
      this.token = localStorage.getItem("token");
      this.changeToMonth();
    },
    getDetailed() {
      //  收支列表 账单明细(全部)
      this.axios
        .get(api.Record + localStorage.getItem("token"), {
          params: {
            begin_date: this.start_date,
            end_date: this.end_date,
            type: Number(this.budget_type),
            category_id:
              this.category == ""
                ? ""
                : this.budget_type == 2
                ? this.outType[this.category].id
                : this.incomeType[this.category].id,
            excel: 0,
            page: this.page
          }
        })
        .then(response => {
          this.list = response.data.data;
          this.page += 1;
          this.loop = 0;
          this.num = response.data.data.list.length;
          this.finished = false;

          if (this.loading) {
            this.onLoad();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取类别
    getTypeIncome() {
      this.axios
        .get(api.Cate + localStorage.getItem("token"), {
          params: {
            type: 1,
            dataType: 1
          }
        })
        .then(res => {
          // console.log(res.data.data);
          this.incomeType = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTypeOut() {
      this.axios
        .get(api.Cate + localStorage.getItem("token"), {
          params: {
            type: 2,
            dataType: 1
          }
        })
        .then(res => {
          this.outType = res.data.data;
        });
    },
    del(id) {
      Dialog.confirm({
        title: "删除",
        message: "确认删除该条数据嘛？"
      })
        .then(() => {
          // 删除订单
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
                this.page = 1;
                this.lists = [];
                this.num = 0;
                this.loading = true;
                this.getDetailed();
                // this.onLoad();
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
        this.page = 1;
        this.lists = [];
        this.num = 0;
        this.loading = true;
        this.getDetailed();
        // this.onLoad();
      }
    },
    changeToMonth() {
      // 时间
      let yy = this.dateTime.getFullYear();
      let mm = (this.dateTime.getMonth() + 1).toString().padStart(2, 0);
      let time = new Date(yy, mm, 0);
      let dd = time
        .getDate()
        .toString()
        .padStart(2, 0);
      // console.log(yy, mm, dd);
      this.screen_start = this.start_date = yy + "-" + mm + "-01";
      this.screen_end = this.end_date = yy + "-" + mm + "-" + dd;
      this.date_name = "当月";
      this.page = 1;
      this.lists = [];
      this.num = 0;
      this.loading = true;
      this.getDetailed();
      // this.onLoad();
    },
    changeToYear() {
      let yy = this.dateTime.getFullYear();
      this.screen_start = this.start_date = yy + "-01" + "-01";
      this.screen_end = this.end_date = yy + "-12" + "-31";
      this.date_name = "今年";
      this.page = 1;
      this.lists = [];
      this.num = 0;
      this.loading = true;
      this.getDetailed();
      // this.onLoad();
    },
    changeToQuarter() {
      let year = this.dateTime.getFullYear();
      let month = this.dateTime.getMonth() + 1;
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
        this.page = 1;
        this.lists = [];
        this.num = 0;
        this.loading = true;
        this.getDetailed();
        // this.onLoad();
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
    openScreen() {
      this.screen = true;
    },
    closeScreen() {
      this.screen = false;
    },
    screened() {
      this.start_date = this.screen_start;
      this.end_date = this.screen_end;
      this.budget_type = this.screen_budget;
      this.category = this.screen_type;
      this.changeDateType = "s";
      this.closeScreen();
      this.page = 1;
      this.lists = [];
      this.num = 0;
      this.loading = true;
      this.getDetailed();
      // this.onLoad();
    },
    budgetChange(name) {
      // console.log(name);
      if (name == 3) {
        this.screen_type = "";
      }
      this.screen_budget = name;
      // console.log(this.screen_budget);
      // console.log(this.screen_type);
      this.show1 = false;
    },
    typeChange(names) {
      this.screen_type = names;
      // console.log(this.screen_type);
      this.show2 = false;
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
    },
    showPopup(num) {
      this.timeType = num;
      this.show = true;
    },
    showPopup1() {
      this.show1 = true;
    },
    showPopup2() {
      this.show2 = true;
    },
    closeShow() {
      this.show = false;
    },
    closeShow1() {
      this.show1 = false;
    },
    closeShow2() {
      this.show2 = false;
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
        this.reLoad();
      }, 500);
    },
    reLoad() {
      this.page = 1;
      this.num = 0;
      this.lists = [];
      this.loading = true;
      this.getDetailed();
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          if (this.list.list[this.loop]) {
            this.lists.push(this.list.list[this.loop]);
          } else {
            this.loading = false;
            this.finished = true;
            return;
          }
          this.loop++;
        }
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.lists.length >= (this.page - 2) * 20 + this.num) {
          // console.log(this.num);
          if (this.num == 20) {
            this.num = 0;
            this.loop = 0;
            this.getDetailed();
          } else {
            this.finished = true;
            this.loop = 0;
          }
        }
      }, 500);
    }
  },
  created() {
    this.constructor();
    this.getTypeIncome();
    this.getTypeOut();
  }
};
</script>

<style scoped lang='less'>
.detailed {
  position: absolute;
  width: 100%;
  min-height: 100%;
  top: 0;
  z-index: 999;
  background-color: #fff;
  padding-top: 205px;
  box-sizing: border-box;
  .detailed-main-top {
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    background-color: #78d666;
    color: #fff;
    text-align: left;
    display: flex;
    div {
      flex: 1;
      padding: 5px 0px 5px 15px;
      p {
        span {
          font-size: 25px;
        }
      }
    }
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
    color: #ffe !important;
    background-color: #78d666;
  }
  .detailed-top {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #78d666;
    z-index: 999;
  }
  .detailed-list {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding: 0px 15px;
    font-size: 16px;
    align-items: center;
    background: #fff;
    position: relative;
    left: 0;
    .detailed-list-left {
      display: flex;
      align-items: center;
      width: 70%;
      .detailed-list-left-iconfont {
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
  }
  .detailed-list-left-info {
    min-height: 20px;
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 15px;
  }
  .van-swipe-cell {
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
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

  .detailed_top_select {
    display: flex;
    justify-content: space-around;
    background-color: #ffe;
    a {
      color: #333;
      display: block;
      padding: 5px;
      border: 1px solid #78d666;
      border-radius: 5px;
      margin: 5px;
    }
  }

  .transition {
    background-color: #eee;
    color: #333;
    padding: 5px;
  }
  .wait-budget {
    border: 1px solid;
    border-radius: 15px;
    padding: 1px 10px;
    display: inline-block;
    .detailed-screen-box {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      span {
        display: block;
        padding: 2px;
        input {
          text-align: right;
          border: none;
          height: 30px;
        }
      }
    }
  }
  .detailed-screen {
    position: fixed;
    top: 0;
    background-color: #eee;
    width: 100%;
    height: 100%;
    z-index: 1100;
    button {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 3px;
      background-color: #78d666;
      color: #ffe;
    }
  }
  .detailed-screen-top {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    background-color: #78d666;
    color: #ffe;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      display: block;
      position: absolute;
      left: 15px;
      padding: 5px;
      box-sizing: border-box;
      font-size: 20px;
    }
  }
  .detailed-screen-list {
    padding: 15px;
    margin-top: 15px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .detailed-screen-button {
    width: 100%;
    padding: 20px 10px;
    box-sizing: border-box;
  }
  .screenButton {
    width: 15%;
    height: 40px;
    /* background-color: rgba(0,0,0,0.1); */
    z-index: 1005;
    position: absolute;
    top: 5px;
    right: 0;
  }
  .detailed-datetime {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
