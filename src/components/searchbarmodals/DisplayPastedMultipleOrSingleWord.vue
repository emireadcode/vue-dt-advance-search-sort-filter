<script setup lang="ts">
import type { StringSearchType } from '../types/SupportedDatatypesTypeDeclaration';


function resetDoneClick(tree: StringSearchType) {
  tree.done = false;
  nextTick(() => triggerRef(cards));
}
function deleteIncludeOrExclude(tree: StringSearchType, index: number) {
  if (current.value === 0) {
    for (let i = 0; i < tree.value.length; i++) {
      if (tree.value[i] === tree.value[index]) {
        tree.value.splice(i, 1);
        tree.temporary.splice(i, 1);
        tree.index--;
        tree.done = true;
        break;
      }
    }
    temporary.value = tree as StringSearchType;
  } else {
    let val = "";
    for (let i = 0; i < tree.value.length; i++) {
      if (tree.value[i] === tree.value[index]) {
        val = tree.value[i];
        tree.value.splice(i, 1);
        tree.index--;
        tree.done = true;
        break;
      }
    }
    for (let i = 0; i < tree.temporary.length; i++) {
      if (val === tree.temporary[i]) {
        tree.temporary.splice(i, 1);
        break;
      }
    }
    let newpagenum = current.value - 1;
    if (tree.value.length === 0) {
      pages.value.splice(newpagenum, 1);
      if (newpagenum === pages.value.length) {
        current.value = newpagenum;
        newpagenum--;
      }
      tree.value = pages.value[newpagenum];
      paginateFurther();
    } else {
      paginateFurther();
      tree.value = pages.value[newpagenum];
    }
  }
  nextTick(() => triggerRef(cards));
}

</script>

<template>
  <div class="d-block">
      <div
        @mousedown="resetDoneClick(tree)"
        @mouseup="resetDoneClick(tree)"
        :id="current === 0 ? cards[index].scroll.areaid + '-included-' + areatype : ''"
        class="m-0 p-0 d-block overflow-y-auto"
        style="z-index: 1000; background-color: #eee"
        :style="props.textAreaHeight"
      >
        <div class="d-block">
          <template v-if="tree.value">
            <ul
              class="m-0 p-0 flex-box flex-direction-row flex-wrap list-style-none justify-content-start w-100"
            >
              <li
                style="padding: 5px"
                class="flex-grow-0 flex-shrink-0"
                v-for="(included, includeindex) in tree.value"
                :key="includeindex + 'include'"
              >
                <div
                  :ref="
                    (el) => {
                      pasteditemsref[includeindex] = el as HTMLDivElement;
                    }
                  "
                  class="d-inline-block shadow-sm cursor-pointer"
                  style="border-radius: 9px;
                    background-color: #fff;
                    padding: 4px 7px;
                    font-size: 10px;
                  "
                >
                  <a
                    @click="deleteIncludeOrExclude(tree, includeindex)"
                    class="d-inline-block underline-none"
                    ><img
                      src="/src/assets/icons/close.png"
                      style="width: 18px; height: 18px"
                      class="align-middle"
                  /></a>
                  <span
                    class="font-0-dot-90-rem d-inline-block align-middle"
                    style="padding-left: 5px"
                    >{{ included }}</span
                  >
                </div>
              </li>
              <template v-if="tree.addloading">
                <li style="padding: 5px" class="flex-grow-0 flex-shrink-0">
                  <img
                    src="/src/assets/icons/loading.gif"
                    style="width: 32px; height: 32px"
                    class="align-middle"
                  />
                </li>
              </template>
              <li ref="lastpasteditemsref"></li>
            </ul>
          </template>
        </div>
        <div class="d-block">
          <template v-if="tree.loading">
            <div class="d-block text-center" style="padding: 20px 0">
              <img
                src="/src/assets/icons/loading.gif"
                style="width: 40px; height: 40px"
                class="align-middle"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
</template>