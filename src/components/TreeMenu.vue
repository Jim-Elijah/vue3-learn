<template>
  <div class="custom-tree-container">
    <el-tree
      :data="dataSource"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }} === {{ data.id }}</span>
          <span class="more-wrapper">
            <a :id="data.id" @click="toggleIsShow">...</a>
            <ul
              v-if="
                isShowRef && (clickedIdRef == -1 || clickedIdRef == data.id)
              "
            >
              <li
                v-for="(name, index) in nameArr"
                :key="name"
                :id="index"
                :index="index"
                @click="clickHandler($event, node, data)"
              >
                {{ name }}
              </li>
            </ul>
            <!-- <a @click="append(data)"> Append </a>
            <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a> -->
          </span>
        </span>
      </template>
    </el-tree>
    <el-button>新建部门</el-button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    let id = 1000;
    let clickedIdRef = ref(-1);
    let isShowRef = ref(false);
    let nameArr = ["编辑", "添加子部门", "删除"];
    const append = (data) => {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        data.children = [];
      }
      data.children.push(newChild);
      dataSource.value = [...dataSource.value];
    };

    const remove = (node, data) => {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      dataSource.value = [...dataSource.value];
    };

    const clickHandler = (e, node, data) => {
      console.log("click", e, node, data);
      const index = Number(e.target.id);
      console.log("index", index);
      if (index === 0) {
        console.log("todo");
      } else if (index === 1) {
        console.log("add");
        append(data);
      } else {
        console.log("remove");
        remove(node, data);
      }
      toggleIsShow(e, true);
    };
    // const renderContent = (
    //   h,
    //   {
    //     node,
    //     data,
    //     store,
    //   }
    // ) => {
    //   return h(
    //     "span",
    //     {
    //       class: "custom-tree-node",
    //     },
    //     h("span", null, node.label),
    //     h(
    //       "span",
    //       null,
    //       h(
    //         "a",
    //         {
    //           onClick: () => append(data),
    //         },
    //         "Append "
    //       ),
    //       h(
    //         "a",
    //         {
    //           style: "margin-left: 8px",
    //           onClick: () => remove(node, data),
    //         },
    //         "Delete"
    //       )
    //     )
    //   );
    // };

    const toggleIsShow = (e, ignoreUpdateId) => {
      isShowRef.value = !isShowRef.value;
      if (!ignoreUpdateId) {
        console.log("toggle", e.target.id);
        clickedIdRef.value = e.target.id;
      }
      console.log("toggle", isShowRef.value);
    };
    const dataSource = ref([
      {
        id: 1,
        label: "Level one 1",
        children: [
          {
            id: 4,
            label: "Level two 1-1",
            children: [
              {
                id: 9,
                label: "Level three 1-1-1",
              },
              {
                id: 10,
                label: "Level three 1-1-2",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        label: "Level one 2",
        children: [
          {
            id: 5,
            label: "Level two 2-1",
          },
          {
            id: 6,
            label: "Level two 2-2",
          },
        ],
      },
      {
        id: 3,
        label: "Level one 3",
        children: [
          {
            id: 7,
            label: "Level two 3-1",
          },
          {
            id: 8,
            label: "Level two 3-2",
          },
        ],
      },
    ]);

    return {
      dataSource,
      append,
      remove,
      nameArr,
      clickedIdRef,
      isShowRef,
      toggleIsShow,
      clickHandler,
    };
  },
};
</script>

<style>
.custom-tree-container {
  width: 300px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.more-wrapper {
  position: relative;
}

.more-wrapper ul {
  position: absolute;
  top: 0;
  left: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 10px;
  align-items: start;
}
.more-wrapper ul li {
  list-style: none;
  float: left;
}
</style>
