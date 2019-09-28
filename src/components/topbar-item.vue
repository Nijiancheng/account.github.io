<template>
  <a class="m-topbar-item">
    <span class="m-topbar-item-text">
      <slot></slot>
    </span>
  </a>
</template>
<script>
export default {};
</script>
<style scoped lang="less">
.m-topbar-item {
  display: flex;
  padding: 0 10px;
}
.m-topbar-item-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  position: relative;
  top: 3px;
  img {
    width: 20px;
    height: 20px;
  }
}
.m-topbar-item-text {
  font-size: 20px;
}
.right-float {
  margin-right: 5px;
  position: relative;
}
.right-float::after {
  content: "";
  width: 0.5px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  display: block;
  position: absolute;
  top: 5px;
  left: 40px;
}
.right-float span {
  display: flex;
  align-items: center;
  top: 0;
  left: 5px;
}
.right-float div {
  width: 25px;
  height: 25px;
}
.right-float div img {
  width: 25px;
  height: 25px;
}
</style>
