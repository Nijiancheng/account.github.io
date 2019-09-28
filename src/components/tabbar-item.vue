<template>
  <a class="m-tabbar-item" @click="goToRouter" :class="{'isActive':isActive}">
    <span class="m-tabbar-item-icon">
      <slot name="icon-normal"></slot>
    </span>
    <span class="m-tabbar-item-icon">
      <slot name="normal"></slot>
    </span>
    <span class="m-tabbar-item-text">
      <slot></slot>
    </span>
  </a>
</template>
<script>
export default {
  props: {
    id: {
      type: String
    }
  },
  methods: {
    goToRouter() {
      // console.log(this.id);
      this.$router.push(this.id);
    }
  },
  computed: {
    isActive() {
      // console.log(this.$route, "kanwo", this.id);
      if (this.$route.fullPath == "/" + this.id) {
        return true;
      } else {
        if (
          (this.$route.fullPath == "/menu" ||
            this.$route.fullPath == "/calendar") &&
          this.id == "statistics"
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.isActive {
  color: #78d666;
}
.m-tabbar-item {
  width: 33%;
  display: block;
  text-align: center;
  font-size: 10px;
  position: relative;
  padding: 5px;
  .iconfont {
    width: 48px;
    font-size: 25px;
  }
  .m-tabbar-item-text {
    position: absolute;
    bottom: -1px;
    left: 41%;
  }
}
.normal {
  position: relative;
  top: -20px;
  margin: 0 auto;
  width: 60px;
  height: 60px;
  background: #78d666;
  border-radius: 50px;
  z-index: 5;
  &::before {
    content: "";
    width: 2px;
    height: 20px;
    position: absolute;
    top: 20px;
    background-color: #fff;
  }
  &::after {
    content: "";
    width: 20px;
    height: 2px;
    position: absolute;
    top: 29px;
    left: 20px;
    background-color: #fff;
  }
}

.hidden {
  display: none;
}
</style>
