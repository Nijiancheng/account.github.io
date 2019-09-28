<template>
  <div class="budget">
    <div class="budget-list">
      <a v-for="(item,index) in list" :key="index" @click="goToRouter(item)">
        <div class="list-icon iconfont">&#xe610;</div>
        <div class="list-text">{{item.name}}</div>
      </a>
      <a @click="goToRouter('type')" class="budGetSet">
        <div class="list-icon iconfont">&#xe750;</div>
        <div class="list-text">设置</div>
      </a>
    </div>
  </div>
</template>

<script>
import api from "../../api";
export default {
  props: {
    type: {
      type: String
    }
  },
  data() {
    return {
      list: []
    };
  },
  methods: {
    constructor() {
      // console.log(localStorage.getItem("budget"), "leixing");
      // 获取类别
      this.axios
        .get(api.Cate + localStorage.getItem("token"), {
          params: {
            type: localStorage.getItem("budget")
              ? localStorage.getItem("budget")
              : "2",
            dataType: 1
          }
        })
        .then(res => {
          // console.log(res);
          this.list = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    goToRouter(item) {
      if (item == "type") {
        // console.log('www')
        this.$router.push("/type_out");
      } else {
        localStorage.setItem("budgetType", 2);
        localStorage.setItem("budgetCateId", item.id);
        localStorage.setItem("budgetCateName", item.name);
        this.$router.push("/write");
      }
    }
  },
  created() {
    this.constructor();
  }
};
</script>
<style scoped lang="less">
.budget {
  .budget-list {
    a {
      display: block;
      width: 25%;
      float: left;
      /* border-right:1px solid rgba(0,0,0,0.1); */
      border-bottom: 1px solid rgba(100, 100, 100, 0.1);
      text-align: center;
      position: relative;
      &::after {
        content: "";
        display: inline-block;
        position: absolute;
        width: 1px;
        height: 100%;
        background-color: rgba(100, 100, 100, 0.1);
        right: 0;
        top: 0;
      }
      .list-icon {
        width: 40px;
        height: 40px;
        margin: 5px auto;
        line-height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.1);
        color: #888;
      }
      .list-text {
        font-size: 14px;
        padding-bottom: 5px;
        color: #888;
        overflow: hidden;
      }
    }
  }
  .budGetSet {
    .list-icon {
      color: #78d666 !important;
      font-size: 24px;
    }
  }
}
</style>
