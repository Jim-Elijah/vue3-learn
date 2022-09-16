<template>
  <div class="red big">{{ item.name }}</div>
</template>
<script>
export default {
  props: ["item"],
};
</script>
<style lang="scss" scoped>
.red {
  color: red;
  font-size: 20px;
}
</style>
