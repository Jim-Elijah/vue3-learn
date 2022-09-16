<template>
  <draggable
    v-model="myArray"
    group="people"
    @start="drag = true"
    @end="drag = false"
    item-key="id"
    class="drag-wrapper"
  >
    <template v-slot:item="{ element }">
      <dragItem :item="element" />
    </template>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
import dragItem from "./dragItem.vue";
export default {
  components: {
    draggable,
    dragItem,
  },
  data() {
    return {
      drag: false,
      myArray: [
        { id: 1, name: "Jenny" },
        { id: 2, name: "kevin" },
        { id: 3, name: "lili" },
      ],
    };
  },
  updated() {
    console.log("u", this.drag, this.myArray);
  },
};
</script>
<style lang="scss" scoped>
.red {
  color: red;
  font-size: 20px;
}
</style>
