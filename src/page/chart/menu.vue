<template>
  <div class="menu">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-swipe-cell v-for="(item,index) in lists" :key="index">
          <div class="menu-list" @click="goToRouter(item.type,item.id)">
            <div class="menu-list-left">
              <span v-if="red = item.type==2?true:false"></span>
              <span class="menu-list-left-iconfont iconfont" :class="{'red':red} ">&#xe644;</span>
              <div class="menu-list-left-title">{{type[item.category_id]}}</div>
            </div>
            <div class="menu-list-right-money">
              <span v-if="item.type==2">-</span>
              {{item.total_money}}
            </div>
          </div>
          <template slot="right">
            <van-button square type="danger" text="删除" @click="del(item.id)" :id="item.id" />
          </template>
        </van-swipe-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  SwipeCell,
  Cell,
  Button,
  Dialog,
  List,
  PullRefresh,
  Toast
} from "vant";
import api from "../../api";
import qs from "qs";
export default {
  data() {
    return {
      start: 0,
      end: 0,
      list: {},
      type: {},
      isLoading: false,
      lists: [],
      loading: true,
      finished: false,
      page: 1,
      num: 0,
      loop: 0
    };
  },
  components: {
    [SwipeCell.name]: SwipeCell,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh
  },
  methods: {
    getTypeIncome() {
      this.axios
        .get(api.Cate + localStorage.getItem("token"), {
          params: {
            type: 1,
            dataType: 1
          }
        })
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            let arr1 = res.data.data;
            for (let i in arr1) {
              // console.log(arr1[i]);
              this.type[arr1[i].id] = arr1[i].name;
            }
            this.getTypeOut();
          }
          // console.log(this.type);
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
          // console.log(res);
          if (res.data.status) {
            let arr1 = res.data.data;
            for (let i in arr1) {
              this.type[arr1[i].id] = arr1[i].name;
            }
            this.getAccountList();
          }
        });
    },
    getAccountList() {
      //  收支列表
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      this.axios
        .get(api.Record + localStorage.getItem("token"), {
          params: {
            page: this.page
          }
        })
        .then(response => {
          if (response.data.status) {
            this.list = response.data.data.list;
            this.page += 1;
            this.num = response.data.data.list.length;
            this.finished = false;
            if (this.loading) {
              this.onLoad();
              // console.log();
            }
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    opendel() {
      this.show = true;
    },
    del(id) {
      Dialog.confirm({
        title: "删除",
        message: "确认删除该条数据嘛？"
      })
        .then(() => {
          Toast.loading({
            mask: true,
            message: "加载中..."
          });
          this.axios
            .post(
              api.Del.Url1 + id + api.Del.Url2 + localStorage.getItem("token")
            )
            .then(response => {
              // console.log(response);
              if (response.data.status) {
                Toast.clear();
                Toast("删除成功");
                this.page = 1;
                this.num = 0;
                this.lists = [];
                this.loop = 0;
                this.loading = true;
                this.getAccountList();
              } else {
                Toast(response.data.data);
              }
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    goToRouter(type, id) {
      localStorage.setItem("detail_type", type);
      localStorage.setItem("detail_id", id);
      this.$router.push("/account-detail");
    },
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.reload();
        this.$toast("刷新成功");
      }, 500);
    },
    reload() {
      this.page = 1;
      this.num = 0;
      this.lists = [];
      this.loading = true;
      this.loop = 0;
      // console.log(this.page);
      this.getAccountList();
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          if (this.list[this.loop]) {
            this.lists.push(this.list[this.loop]);
          } else {
            this.loading = false;
            this.finished = true;
            return;
          }
          this.loop++;
        }
        // 加载状态结束
        this.loading = false;
        // console.log(this.lists.length,this.page,this.num,this.list.length, "leibiao");
        // 数据全部加载完成
        if (this.lists.length >= (this.page - 2) * 20 + this.num) {
          // console.log(this.num);
          Toast.clear();
          if (this.num == 20) {
            this.num = 0;
            this.loop = 0;
            this.getAccountList();
          } else {
            this.loop = 0;
            this.finished = true;
          }
        }
      }, 500);
    }
  },
  created() {
    this.getTypeIncome();
  }
};
</script>

<style scoped lang='less'>
.menu {
  padding-top: 195px;
  padding-bottom: 50px;
  box-sizing: border-box;
  min-height: 100%;
  .menu-list {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding: 0px 15px;
    font-size: 16px;
    align-items: center;
    background: #fff;
    .menu-list-left {
      display: flex;
      align-items: center;
      .menu-list-left-iconfont {
        color: #57a976;
        font-size: 25px;
        display: inline-block;
        width: 37px;
        height: 37px;
        border-radius: 50%;
        background-color: #eee;
        text-align: center;
        line-height: 35px;
        margin: 10px 10px 10px 0;
      }
    }
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
}
</style>
