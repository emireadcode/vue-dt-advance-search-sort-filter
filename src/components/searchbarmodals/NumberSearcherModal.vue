<script setup lang="ts">
import { inject, triggerRef, ref, customRef, watch, computed } from "vue";

const props = defineProps<{
    index: any;
    enableFocusableDescendants: boolean;
  }>(),
  cards = inject("cards") as any,
  open = ref(false),
  openExclude = ref(false),
  refequaltoinner = ref([]),
  refnotequaltoinner = ref([]),
  refexcludeequaltoinner = ref([]),
  refexcludefromtoinner = ref([]),
  refequalto = ref([]),
  refnotequalto = ref([]),
  refexcludeequalto = ref([]),
  refexcludefromto = ref([]),
  excludefromtoref = ref(),
  excludeequaltoref = ref(),
  equaltoref = ref(),
  notequaltoref = ref();
let greaterthan = useDebouncedRef(cards.value[props.index].search.greaterthan),
  lessthan = useDebouncedRef(cards.value[props.index].search.lessthan),
  equalto = useDebouncedRef(cards.value[props.index].search.equalto.single),
  notequalto = useDebouncedRef(cards.value[props.index].search.notequalto.single),
  from = useDebouncedRef(cards.value[props.index].search.fromto.from),
  to = useDebouncedRef(cards.value[props.index].search.fromto.to),
  excludefromtofrom = useDebouncedRef(
    cards.value[props.index].search.exclude.fromto.singlefrom
  ),
  excludefromtoto = useDebouncedRef(
    cards.value[props.index].search.exclude.fromto.singleto
  ),
  excludeequalto = useDebouncedRef(
    cards.value[props.index].search.exclude.equalto.single
  ),
  treenotequalto = useDebouncedRef(cards.value[props.index].search.notequalto),
  treeequalto = useDebouncedRef(cards.value[props.index].search.equalto),
  treeexcludeequalto = useDebouncedRef(cards.value[props.index].search.exclude.equalto),
  treeexcludefromto = useDebouncedRef(cards.value[props.index].search.exclude.fromto);

function updateTrueOrFalse(trueorfalse) {
  cards.value[props.index].search.trueorfalse = trueorfalse;
  triggerRef(cards);
}

function openNumberWindow() {
  open.value = true;
}
function openExcludeWindow() {
  if (
    greaterthan.value ||
    lessthan.value ||
    cards.value[props.index].search.notequalto.index > 0 ||
    notequalto ||
    (cards.value[props.index].search.fromto.from &&
      cards.value[props.index].search.fromto.to)
  ) {
    openExclude.value = true;
  }
}

function setTabs(
  tab: "GREATER-THAN" | "LESS-THAN" | "EQUAL-TO" | "NOT-EQUAL-TO" | "FROM-TO"
) {
  cards.value[props.index].search.tab = tab;
}

function scrollToElement(el) {
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

function excludeFromToGuard(from, to) {
  if (cards.value[props.index].search.tab === "GREATER-THAN") {
    let grt = greaterthan.value;
    if (parseFloat(from) > parseFloat(grt) && parseFloat(from) < parseFloat(to)) {
      return true;
    } else {
      return false;
    }
  } else if (cards.value[props.index].search.tab === "LESS-THAN") {
    let lst = lessthan.value;
    if (parseFloat(to) <= parseFloat(lst) && parseFloat(from) < parseFloat(to)) {
      return true;
    } else {
      return false;
    }
  } else {
    if (parseFloat(from) < parseFloat(to)) {
      return true;
    } else {
      return false;
    }
  }
}

function deleteSaved(
  index: number,
  treetype: "NOT-EQUAL-TO" | "EXCLUDE-FROM-TO" | "EQUAL-TO" | "EXCLUDE-EQUAL-TO"
) {
  switch (treetype) {
    case "NOT-EQUAL-TO":
      for (let i = 0; i < cards.value[props.index].search.notequalto.value.length; i++) {
        if (i === index) {
          let t = null;
          clearTimeout(t);
          t = setTimeout(() => {
            cards.value[props.index].search.notequalto.show.splice(i, 1);
            cards.value[props.index].search.notequalto.value.splice(i, 1);
            cards.value[props.index].search.notequalto.disabled.splice(i, 1);
            cards.value[props.index].search.notequalto.index -= 1;
            triggerRef(cards);
            clearTimeout(t);
          }, 10);
          break;
        }
      }
      break;
    case "EQUAL-TO":
      for (let i = 0; i < cards.value[props.index].search.equalto.value.length; i++) {
        if (i === index) {
          let t = null;
          clearTimeout(t);
          t = setTimeout(() => {
            cards.value[props.index].search.equalto.show.splice(i, 1);
            cards.value[props.index].search.equalto.value.splice(i, 1);
            cards.value[props.index].search.equalto.disabled.splice(i, 1);
            cards.value[props.index].search.equalto.index -= 1;
            triggerRef(cards);
            clearTimeout(t);
          }, 10);
          break;
        }
      }
      break;
    case "EXCLUDE-EQUAL-TO":
      for (
        let i = 0;
        i < cards.value[props.index].search.exclude.equalto.value.length;
        i++
      ) {
        if (i === index) {
          let t = null;
          clearTimeout(t);
          t = setTimeout(() => {
            cards.value[props.index].search.exclude.equalto.show.splice(i, 1);
            cards.value[props.index].search.exclude.equalto.value.splice(i, 1);
            cards.value[props.index].search.exclude.equalto.disabled.splice(i, 1);
            cards.value[props.index].search.exclude.equalto.index -= 1;
            triggerRef(cards);
            clearTimeout(t);
          }, 10);
          break;
        }
      }
      break;
    default:
      for (
        let i = 0;
        i < cards.value[props.index].search.exclude.fromto.from.length;
        i++
      ) {
        if (i === index) {
          let t = null;
          clearTimeout(t);
          t = setTimeout(() => {
            cards.value[props.index].search.exclude.fromto.show.splice(i, 1);
            cards.value[props.index].search.exclude.fromto.from.splice(i, 1);
            cards.value[props.index].search.exclude.fromto.to.splice(i, 1);
            cards.value[props.index].search.exclude.fromto.disabled.splice(i, 1);
            cards.value[props.index].search.exclude.fromto.index -= 1;
            triggerRef(cards);
            clearTimeout(t);
          }, 10);
          break;
        }
      }
      break;
  }
}

function increaseIndexAndSavePrevious(
  rangeornot: string,
  tree:
    | { value: (string | number)[]; index: number }
    | { from: (string | number)[]; to: (string | number)[]; index: number },
  debouncedref: Ref<number | string> | Ref<number | string>[],
  buttontype: string
) {
  if (rangeornot === "RANGE") {
    let from = debouncedref[0],
      to = debouncedref[1];
    if (from && to) {
      if (excludeFromToGuard(from, to)) {
        if (tree.from.length === 0) {
          for (let i = 0; i < treeexcludeequalto.value.value.length; i++) {
            if (
              treeexcludeequalto.value.value[i] >= parseFloat(from) &&
              treeexcludeequalto.value.value[i] <= parseFloat(to)
            ) {
              scrollToElement(refexcludeequalto.value[i]);

              treeexcludeequalto.value.disabled[i] = true;
              treeexcludeequalto.value = treeexcludeequalto.value;

              let t = null;
              clearTimeout(t);
              t = setTimeout(() => {
                treeexcludeequalto.value.disabled[i] = false;
                treeexcludeequalto.value = treeexcludeequalto.value;
                clearTimeout(t);
              }, 10);

              let t1 = null;
              clearTimeout(t1);
              t1 = setTimeout(() => {
                scrollToElement(refexcludeequalto.value[i]);

                treeexcludeequalto.value.show[i] = false;
                treeexcludeequalto.value = treeexcludeequalto.value;
                clearTimeout(t1);
              }, 50);
            }
          }

          for (let i = 0; i < treeexcludeequalto.value.value.length; i++) {
            if (
              treeexcludeequalto.value.value[i] >= parseFloat(from) &&
              treeexcludeequalto.value.value[i] <= parseFloat(to)
            ) {
              let t3 = null;
              t3 = setInterval(() => {
                if (treeexcludeequalto.value.show[i] === false) {
                  scrollToElement(refexcludeequalto.value[i]);

                  treeexcludeequalto.value.show.splice(i, 1);
                  treeexcludeequalto.value.value.splice(i, 1);
                  treeexcludeequalto.value.disabled.splice(i, 1);
                  treeexcludeequalto.value = treeexcludeequalto.value;
                  clearInterval(t3);
                }
              }, 50);
            }
          }

          tree.from.push(from);
          tree.to.push(to);
          tree.disabled.push(false);
          tree.show.push(true);
          tree.index++;
          treeexcludefromto.value = tree;

          let tt1 = null;
          clearTimeout(tt1);
          tt1 = setTimeout(() => {
            scrollToElement(excludefromtoref.value);
            clearTimeout(tt1);
          }, 50);
        } else {
          let fromwithinpreviousrange = false,
            fromwithinpreviousrangeindex = 0;
          for (let i = 0; i < tree.from.length; i++) {
            if (
              (parseFloat(from) >= parseFloat(tree.from[i]) &&
                parseFloat(from) <= parseFloat(tree.to[i])) ||
              (parseFloat(from) < parseFloat(tree.from[i]) &&
                parseFloat(to) >= parseFloat(tree.from[i]) &&
                (parseFloat(to) >= parseFloat(tree.to[i]) ||
                  parseFloat(to) <= parseFloat(tree.to[i])))
            ) {
              fromwithinpreviousrange = true;
              fromwithinpreviousrangeindex = i;
              break;
            }
          }
          if (!fromwithinpreviousrange) {
            for (let i = 0; i < treeexcludeequalto.value.value.length; i++) {
              if (
                treeexcludeequalto.value.value[i] >= parseFloat(from) &&
                treeexcludeequalto.value.value[i] <= parseFloat(to)
              ) {
                scrollToElement(refexcludeequalto.value[i]);

                treeexcludeequalto.value.disabled[i] = true;
                treeexcludeequalto.value = treeexcludeequalto.value;
                let t = null;
                clearTimeout(t);
                t = setTimeout(() => {
                  treeexcludeequalto.value.disabled[i] = false;
                  treeexcludeequalto.value = treeexcludeequalto.value;
                  clearTimeout(t);
                }, 10);

                let t1 = null;
                clearTimeout(t1);
                t1 = setTimeout(() => {
                  scrollToElement(refexcludeequalto.value[i]);
                  treeexcludeequalto.value.show[i] = false;
                  treeexcludeequalto.value = treeexcludeequalto.value;
                  clearTimeout(t1);
                }, 50);
              }
            }

            for (let i = 0; i < treeexcludeequalto.value.value.length; i++) {
              if (
                treeexcludeequalto.value.value[i] >= parseFloat(from) &&
                treeexcludeequalto.value.value[i] <= parseFloat(to)
              ) {
                let t3 = null;
                t3 = setInterval(() => {
                  if (treeexcludeequalto.value.show[i] === false) {
                    scrollToElement(refexcludeequalto.value[i]);
                    treeexcludeequalto.value.show.splice(i, 1);
                    treeexcludeequalto.value.value.splice(i, 1);
                    treeexcludeequalto.value.disabled.splice(i, 1);
                    treeexcludeequalto.value = treeexcludeequalto.value;
                    clearInterval(t3);
                  }
                }, 50);
              }
            }

            tree.from.push(from);
            tree.to.push(to);
            tree.disabled.push(false);
            tree.show.push(true);
            tree.index++;
            treeexcludefromto.value = tree;

            let tt1 = null;
            clearTimeout(tt1);
            tt1 = setTimeout(() => {
              scrollToElement(excludefromtoref.value);
              clearTimeout(tt1);
            }, 50);
          } else {
            scrollToElement(refexcludefromto.value[fromwithinpreviousrangeindex]);
            refexcludefromtoinner.value[
              fromwithinpreviousrangeindex
            ].style.backgroundColor = "#66bb6a";

            tree.disabled[fromwithinpreviousrangeindex] = true;
            treeexcludefromto.value = tree;
            let t = null;
            clearTimeout(t);
            t = setTimeout(() => {
              tree.disabled[fromwithinpreviousrangeindex] = false;
              treeexcludefromto.value = tree;
              clearTimeout(t);
            }, 10);

            let ttt;
            clearTimeout(ttt);
            ttt = setTimeout(() => {
              if (
                refexcludefromtoinner.value[fromwithinpreviousrangeindex] !== undefined &&
                refexcludefromtoinner.value[fromwithinpreviousrangeindex] !== null
              ) {
                if (
                  refexcludefromtoinner.value[fromwithinpreviousrangeindex].style
                    .backgroundColor !== "#fff"
                )
                  refexcludefromtoinner.value[
                    fromwithinpreviousrangeindex
                  ].style.backgroundColor = "#fff";
              }
              clearTimeout(ttt);
            }, 400);

            //excludefromtofrom.value = '';
            //excludefromtoto.value = '';
          }
        }
      }
    }
  } else {
    if (debouncedref) {
      let found = false,
        foundindex = 0;
      for (let i = 0; i < tree.value.length; i++) {
        if (tree.value[i] === debouncedref) {
          found = true;
          foundindex = i;
          break;
        }
      }

      switch (buttontype) {
        case "EQUAL-TO":
          if (!found) {
            tree.value.push(debouncedref);
            tree.disabled.push(false);
            tree.show.push(true);
            tree.index++;
            treeequalto.value = tree;
            let tt1 = null;
            clearTimeout(tt1);
            tt1 = setTimeout(() => {
              scrollToElement(equaltoref.value);
              clearTimeout(tt1);
            }, 50);
          } else {
            scrollToElement(refequalto.value[foundindex]);
            refequaltoinner.value[foundindex].style.backgroundColor = "#66bb6a";

            tree.disabled[foundindex] = true;
            treeequalto.value = tree;
            let t = null;
            clearTimeout(t);
            t = setTimeout(() => {
              tree.disabled[foundindex] = false;
              treeequalto.value = tree;
              clearTimeout(t);
            }, 10);

            let ttt;
            clearTimeout(ttt);
            ttt = setTimeout(() => {
              if (
                refequaltoinner.value[foundindex] !== undefined &&
                refequaltoinner.value[foundindex] !== null
              ) {
                if (refequaltoinner.value[foundindex].style.backgroundColor !== "#fff")
                  refequaltoinner.value[foundindex].style.backgroundColor = "#fff";
              }
              clearTimeout(ttt);
            }, 400);
          }
          equalto.value = "";
          break;
        case "NOT-EQUAL-TO":
          if (!found) {
            tree.value.push(debouncedref);
            tree.disabled.push(false);
            tree.show.push(true);
            tree.index++;
            treenotequalto.value = tree;
            let tt1 = null;
            clearTimeout(tt1);
            tt1 = setTimeout(() => {
              scrollToElement(notequaltoref.value);
              clearTimeout(tt1);
            }, 50);
          } else {
            scrollToElement(refnotequalto.value[foundindex]);
            refnotequaltoinner.value[foundindex].style.backgroundColor = "#66bb6a";

            tree.disabled[foundindex] = true;
            treenotequalto.value = tree;
            let t = null;
            clearTimeout(t);
            t = setTimeout(() => {
              tree.disabled[foundindex] = false;
              treenotequalto.value = tree;
              clearTimeout(t);
            }, 10);

            let ttt;
            clearTimeout(ttt);
            ttt = setTimeout(() => {
              if (
                refnotequaltoinner.value[foundindex] !== undefined &&
                refnotequaltoinner.value[foundindex] !== null
              ) {
                if (refnotequaltoinner.value[foundindex].style.backgroundColor !== "#fff")
                  refnotequaltoinner.value[foundindex].style.backgroundColor = "#fff";
              }
              clearTimeout(ttt);
            }, 400);
          }
          notequalto.value = "";
          break;
        default:
          let fromwithinpreviousrange = false,
            fromwithinpreviousrangeindex = 0;
          for (let i = 0; i < treeexcludefromto.value.from.length; i++) {
            if (
              parseFloat(debouncedref) >= parseFloat(treeexcludefromto.value.from[i]) &&
              parseFloat(debouncedref) <= parseFloat(treeexcludefromto.value.to[i])
            ) {
              fromwithinpreviousrange = true;
              fromwithinpreviousrangeindex = i;
              break;
            }
          }

          if (fromwithinpreviousrange) {
            scrollToElement(refexcludefromto.value[fromwithinpreviousrangeindex]);
            refexcludefromtoinner.value[
              fromwithinpreviousrangeindex
            ].style.backgroundColor = "#66bb6a";

            treeexcludefromto.value.disabled[fromwithinpreviousrangeindex] = true;
            treeexcludefromto.value = treeexcludefromto.value;
            let t = null;
            clearTimeout(t);
            t = setTimeout(() => {
              treeexcludefromto.value.disabled[fromwithinpreviousrangeindex] = false;
              treeexcludefromto.value = treeexcludefromto.value;
              clearTimeout(t);
            }, 10);

            let ttt;
            clearTimeout(ttt);
            ttt = setTimeout(() => {
              if (
                refexcludefromtoinner.value[fromwithinpreviousrangeindex] !== undefined &&
                refexcludefromtoinner.value[fromwithinpreviousrangeindex] !== null
              ) {
                if (
                  refexcludefromtoinner.value[fromwithinpreviousrangeindex].style
                    .backgroundColor !== "#fff"
                )
                  refexcludefromtoinner.value[
                    fromwithinpreviousrangeindex
                  ].style.backgroundColor = "#fff";
              }
              clearTimeout(ttt);
            }, 400);
          } else {
            if (!found) {
              tree.value.push(debouncedref);
              tree.disabled.push(false);
              tree.show.push(true);
              tree.index++;
              treeexcludeequalto.value = tree;

              let tt1 = null;
              clearTimeout(tt1);
              tt1 = setTimeout(() => {
                scrollToElement(excludeequaltoref.value);
                clearTimeout(tt1);
              }, 50);
            } else {
              scrollToElement(refexcludeequalto.value[foundindex]);
              refexcludeequaltoinner.value[foundindex].style.backgroundColor = "#66bb6a";

              tree.disabled[foundindex] = true;
              treeexcludeequalto.value = tree;
              let t = null;
              clearTimeout(t);
              t = setTimeout(() => {
                tree.disabled[foundindex] = false;
                treeexcludeequalto.value = tree;
                clearTimeout(t);
              }, 10);

              let ttt;
              clearTimeout(ttt);
              ttt = setTimeout(() => {
                if (
                  refexcludeequaltoinner.value[foundindex] !== undefined &&
                  refexcludeequaltoinner.value[foundindex] !== null
                ) {
                  if (
                    refexcludeequaltoinner.value[foundindex].style.backgroundColor !==
                    "#fff"
                  )
                    refexcludeequaltoinner.value[foundindex].style.backgroundColor =
                      "#fff";
                }
                clearTimeout(ttt);
              }, 400);
            }
          }
          excludeequalto.value = "";
          break;
      }
    }
  }
  triggerRef(cards);
}

function useDebouncedRef(value, delay = 400) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
          clearTimeout(timeout);
        }, delay);
      },
    };
  });
}

watch(
  () => from.value,
  (x) => {
    cards.value[props.index].search.fromto.from = x;
  }
);

watch(
  () => to.value,
  (x) => {
    cards.value[props.index].search.fromto.to = x;
  }
);

watch(
  () => greaterthan.value,
  (x) => {
    cards.value[props.index].search.greaterthan = x;
  }
);

watch(
  () => lessthan.value,
  (x) => {
    cards.value[props.index].search.lessthan = x;
  }
);

watch(
  () => equalto.value,
  (x) => {
    cards.value[props.index].search.equalto.single = x;
  }
);

watch(
  () => notequalto.value,
  (x) => {
    cards.value[props.index].search.notequalto.single = x;
  }
);

watch(
  () => cards.value[props.index].search.exclude.equalto.index,
  (x) => {
    excludeequalto.value = "";
  }
);

watch(
  () => cards.value[props.index].search.exclude.fromto.index,
  (x) => {
    excludefromtoto.value = "";
    excludefromtofrom.value = "";
  }
);

watch(
  () => cards.value[props.index].search.equalto.index,
  (x) => {
    equalto.value = "";
  }
);

watch(
  () => cards.value[props.index].search.notequalto.index,
  (x) => {
    notequalto.value = "";
  }
);

function resetOthers(pressedinput: string) {
  if (pressedinput === "GREATER-THAN") {
    lessthan.value = "";
    from.value = "";
    to.value = "";
    equalto.value = "";
    notequalto.value = "";
    cards.value[props.index].search.equalto.value = [];
    cards.value[props.index].search.notequalto.value = [];
    cards.value[props.index].search.equalto.index = 0;
    cards.value[props.index].search.notequalto.index = 0;
  } else if (pressedinput === "LESS-THAN") {
    greaterthan.value = "";
    from.value = "";
    to.value = "";
    equalto.value = "";
    notequalto.value = "";
    cards.value[props.index].search.equalto.value = [];
    cards.value[props.index].search.notequalto.value = [];
    cards.value[props.index].search.equalto.index = 0;
    cards.value[props.index].search.notequalto.index = 0;
  } else if (pressedinput === "EQUAL-TO") {
    greaterthan.value = "";
    lessthan.value = "";
    from.value = "";
    to.value = "";
    notequalto.value = "";
    cards.value[props.index].search.notequalto.value = [];
    cards.value[props.index].search.notequalto.index = 0;
  } else if (pressedinput === "NOT-EQUAL-TO") {
    greaterthan.value = "";
    lessthan.value = "";
    from.value = "";
    to.value = "";
    equalto.value = "";
    cards.value[props.index].search.equalto.value = [];
    cards.value[props.index].search.equalto.index = 0;
  } else {
    greaterthan.value = "";
    lessthan.value = "";
    equalto.value = "";
    notequalto.value = "";
    cards.value[props.index].search.equalto.value = [];
    cards.value[props.index].search.notequalto.value = [];
    cards.value[props.index].search.equalto.index = 0;
    cards.value[props.index].search.notequalto.index = 0;
  }
  cards.value[props.index].search.exclude = {
    fromto: {
      singlefrom: "",
      singleto: "",
      from: [],
      to: [],
      index: 0,
      disabled: [],
      show: [],
    },
    equalto: {
      single: "",
      value: [],
      index: 0,
      disabled: [],
      show: [],
    },
  };
}

const excludeAddNewFromTo = computed(() => {
  if (cards.value[props.index].search.tab === "GREATER-THAN") {
    return (
      parseFloat(excludefromtoto.value) <=
        parseFloat(cards.value[props.index].result.max) &&
      parseFloat(excludefromtofrom.value) <
        parseFloat(cards.value[props.index].result.max) &&
      parseFloat(excludefromtofrom.value) > parseFloat(greaterthan.value) &&
      parseFloat(excludefromtofrom.value) < parseFloat(excludefromtoto.value)
    );
  } else if (cards.value[props.index].search.tab === "LESS-THAN") {
    return (
      parseFloat(excludefromtoto.value) >
        parseFloat(cards.value[props.index].result.min) &&
      parseFloat(excludefromtofrom.value) >=
        parseFloat(cards.value[props.index].result.min) &&
      parseFloat(excludefromtoto.value) <= parseFloat(lessthan.value) &&
      parseFloat(excludefromtofrom.value) < parseFloat(excludefromtoto.value)
    );
  } else {
    return (
      parseFloat(excludefromtofrom.value) > parseFloat(from.value) &&
      parseFloat(excludefromtoto.value) < parseFloat(to.value) &&
      parseFloat(excludefromtofrom.value) < parseFloat(excludefromtoto.value)
    );
  }
});

const excludeAddNewEqualto = computed(() => {
  if (cards.value[props.index].search.tab === "GREATER-THAN") {
    return (
      parseFloat(excludeequalto.value) >= parseFloat(greaterthan.value) &&
      parseFloat(excludeequalto.value) <= parseFloat(cards.value[props.index].result.max)
    );
  } else if (cards.value[props.index].search.tab === "LESS-THAN") {
    return (
      parseFloat(excludeequalto.value) <= parseFloat(lessthan.value) &&
      parseFloat(excludeequalto.value) >= parseFloat(cards.value[props.index].result.min)
    );
  } else {
    return (
      parseFloat(excludeequalto.value) >= parseFloat(from.value) &&
      parseFloat(excludeequalto.value) <= parseFloat(to.value)
    );
  }
});

const excludeDone = computed(() => {
  if (cards.value[props.index].search.tab === "GREATER-THAN") {
    return (
      (parseFloat(excludefromtofrom.value) > parseFloat(greaterthan.value) &&
        parseFloat(excludefromtofrom.value) < parseFloat(excludefromtoto.value) &&
        parseFloat(excludefromtofrom.value) <
          parseFloat(cards.value[props.index].result.max) &&
        parseFloat(excludefromtoto.value) <=
          parseFloat(cards.value[props.index].result.max)) ||
      (parseFloat(excludeequalto.value) >= parseFloat(greaterthan.value) &&
        parseFloat(excludeequalto.value) <=
          parseFloat(cards.value[props.index].result.max)) ||
      parseFloat(cards.value[props.index].search.exclude.equalto.index) > 0 ||
      parseFloat(cards.value[props.index].search.exclude.fromto.index) > 0
    );
  } else if (cards.value[props.index].search.tab === "LESS-THAN") {
    return (
      (parseFloat(excludefromtoto.value) <= parseFloat(lessthan.value) &&
        parseFloat(excludefromtofrom.value) < parseFloat(excludefromtoto.value) &&
        parseFloat(excludefromtofrom.value) >=
          parseFloat(cards.value[props.index].result.min) &&
        parseFloat(excludefromtoto.value) >
          parseFloat(cards.value[props.index].result.min)) ||
      (parseFloat(excludeequalto.value) <= parseFloat(lessthan.value) &&
        parseFloat(excludeequalto.value) >=
          parseFloat(cards.value[props.index].result.min)) ||
      parseFloat(cards.value[props.index].search.exclude.equalto.index) > 0 ||
      parseFloat(cards.value[props.index].search.exclude.fromto.index) > 0
    );
  } else {
    return (
      (parseFloat(excludefromtoto.value) <= parseFloat(to.value) &&
        parseFloat(excludefromtofrom.value) < parseFloat(excludefromtoto.value) &&
        parseFloat(excludefromtofrom.value) >= parseFloat(from.value) &&
        parseFloat(excludefromtoto.value) > parseFloat(from.value)) ||
      (parseFloat(excludeequalto.value) >= parseFloat(from.value) &&
        parseFloat(excludeequalto.value) <= parseFloat(to.value)) ||
      parseFloat(cards.value[props.index].search.exclude.equalto.index) > 0 ||
      parseFloat(cards.value[props.index].search.exclude.fromto.index) > 0
    );
  }
});

const excludeClear = computed(() => {
  return (
    excludefromtofrom.value ||
    excludefromtoto.value ||
    excludeequalto.value ||
    parseFloat(cards.value[props.index].search.exclude.equalto.index) > 0 ||
    parseFloat(cards.value[props.index].search.exclude.fromto.index) > 0
  );
});

const done = computed(() => {
  return (
    (parseFloat(greaterthan.value) <= cards.value[props.index].result.max &&
      parseFloat(greaterthan.value) >= cards.value[props.index].result.min) ||
    (parseFloat(lessthan.value) <= cards.value[props.index].result.max &&
      parseFloat(lessthan.value) >= cards.value[props.index].result.min) ||
    cards.value[props.index].search.equalto.index > 0 ||
    (parseFloat(equalto.value) <= cards.value[props.index].result.max &&
      parseFloat(equalto.value) >= cards.value[props.index].result.min) ||
    cards.value[props.index].search.notequalto.index > 0 ||
    (parseFloat(notequalto.value) <= cards.value[props.index].result.max &&
      parseFloat(notequalto.value) >= cards.value[props.index].result.min) ||
    (parseFloat(from.value) < parseFloat(to.value) &&
      parseFloat(from.value) <= cards.value[props.index].result.max &&
      parseFloat(from.value) >= cards.value[props.index].result.min &&
      parseFloat(to.value) <= cards.value[props.index].result.max &&
      parseFloat(to.value) >= cards.value[props.index].result.min)
  );
});

const exclude = computed(() => {
  return (
    (parseFloat(greaterthan.value) <= cards.value[props.index].result.max &&
      parseFloat(greaterthan.value) >= cards.value[props.index].result.min) ||
    (parseFloat(lessthan.value) <= cards.value[props.index].result.max &&
      parseFloat(lessthan.value) >= cards.value[props.index].result.min) ||
    (parseFloat(from.value) < parseFloat(to.value) &&
      parseFloat(from.value) <= cards.value[props.index].result.max &&
      parseFloat(from.value) >= cards.value[props.index].result.min &&
      parseFloat(to.value) <= cards.value[props.index].result.max &&
      parseFloat(to.value) >= cards.value[props.index].result.min)
  );
});

const clear = computed(() => {
  return (
    (parseFloat(greaterthan.value) <= cards.value[props.index].result.max &&
      parseFloat(greaterthan.value) >= cards.value[props.index].result.min) ||
    (parseFloat(lessthan.value) <= cards.value[props.index].result.max &&
      parseFloat(lessthan.value) >= cards.value[props.index].result.min) ||
    cards.value[props.index].search.equalto.index > 0 ||
    (parseFloat(equalto.value) <= cards.value[props.index].result.max &&
      parseFloat(equalto.value) >= cards.value[props.index].result.min) ||
    cards.value[props.index].search.notequalto.index > 0 ||
    (parseFloat(notequalto.value) <= cards.value[props.index].result.max &&
      parseFloat(notequalto.value) >= cards.value[props.index].result.min) ||
    (parseFloat(from.value) < parseFloat(to.value) &&
      parseFloat(from.value) <= cards.value[props.index].result.max &&
      parseFloat(from.value) >= cards.value[props.index].result.min &&
      parseFloat(to.value) <= cards.value[props.index].result.max &&
      parseFloat(to.value) >= cards.value[props.index].result.min)
  );
});

const equaltoAddNew = computed(() => {
  return (
    parseFloat(equalto.value) <= cards.value[props.index].result.max &&
    parseFloat(equalto.value) >= cards.value[props.index].result.min
  );
});

const notequaltoAddNew = computed(() => {
  return (
    parseFloat(notequalto.value) <= cards.value[props.index].result.max &&
    parseFloat(notequalto.value) >= cards.value[props.index].result.min
  );
});

function updateSortType(val) {
  cards.value[props.index].sorttype = val.sorttype;
  triggerRef(cards);
}

function updateFilterableResultDisplayer(card) {
  cards.value[props.index] = card;
  triggerRef(cards);
}
</script>

<template>  
  <transition name="modal">
    <div
      class="position-fixed h-100 w-100 overflow-auto user-select-none"
      style="z-index: 1800"
    >
      <div class="modal-mask h-100 w-100 modal-mask-background-1">
        <div class="modal-wrapper text-center">
          <div class="modal-container d-block">
            <div class="d-block">
              <div
                style="background-color: #fff; padding: 3px 10px"
                class="shadow-sm d-block"
              >
                <a
                  class="underline-none cursor-pointer align-middle"
                  @click="open = false"
                >
                  <img
                    src="/src/assets/icons/close.png"
                    class="align-middle"
                    style="width: 24px; height: 24px"
                  />
                </a>
              </div>
              <div
                class="d-block text-center"
                style="padding: 7px; font-size: 0.6rem"
              >
                {{ cards[index].info.name }}
              </div>
            </div>
            <div class="d-block">
              <div
                class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                style="padding: 6px 0 10px 0"
              >
                <div class="flex-w-50">
                  <span
                    class="d-inline-block p-0 m-0 letter-spacing align-middle"
                  >
                    {{ cards[index].result.max }}
                  </span>
                </div>
                <div class="flex-w-50">
                  <span
                    class="d-inline-block p-0 m-0 letter-spacing align-middle"
                  >
                    {{ cards[index].result.min }}
                  </span>
                </div>
              </div>
            </div>
            <div class="d-block m-0" style="padding: 0 10px">
              <div class="d-block" style="padding: 15px 0">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                >
                  <div class="flex-w-50" style="padding-right: 10px">
                    <div class="d-block shadow-sm" style="padding: 5px">
                      <div class="d-block" style="padding-bottom: 5px">
                        <img
                          src="/src/assets/icons/greater-than.png"
                          class="align-middle"
                          style="width: 24px; height: 24px"
                        />
                      </div>
                      <div class="d-block">
                        <input
                          @keyup="resetOthers('GREATER-THAN')"
                          @keydown.space.prevent
                          v-model.trim="greaterthan"
                          @click.once="setTabs('GREATER-THAN')"
                          type="text"
                          class="w-100 text-center"
                          style="height: 30px"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="flex-w-50" style="padding-left: 10px">
                    <div class="d-block shadow-sm" style="padding: 5px">
                      <div class="d-block" style="padding-bottom: 5px">
                        <img
                          src="/src/assets/icons/less-than.png"
                          class="align-middle"
                          style="width: 24px; height: 24px"
                        />
                      </div>
                      <div class="d-block">
                        <input
                          @keyup="resetOthers('LESS-THAN')"
                          @keydown.space.prevent
                          v-model.trim="lessthan"
                          @click.once="setTabs('LESS-THAN')"
                          type="text"
                          class="w-100 text-center"
                          style="height: 30px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-block" style="padding: 0 0 15px 0">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                >
                  <div class="flex-w-50" style="padding-right: 10px">
                    <div class="d-block shadow-sm" style="padding: 5px">
                      <div class="d-block" style="padding-bottom: 5px">
                        <img
                          src="/src/assets/icons/equal-to.png"
                          class="align-middle"
                          style="width: 24px; height: 24px"
                        />
                      </div>
                      <div class="d-block">
                        <input
                          @keyup="resetOthers('EQUAL-TO')"
                          @keydown.space.prevent
                          v-model.trim="equalto"
                          @click.once="setTabs('EQUAL-TO')"
                          type="text"
                          class="w-100 text-center"
                          style="height: 30px; z-index: 1110"
                        />
                      </div>
                      <div
                        class="d-block overflow-y-auto overflow-x-hidden"
                        style="height: 180px; z-index: 1000"
                      >
                        <ul
                          class="d-block list-style-none m-0"
                          style="padding: 5px 0px"
                        >
                          <li
                            class="w-100"
                            v-for="(data, dindex) in cards[index].search.equalto
                              .value"
                            :key="'exc' + dindex"
                          >
                            <Transition>
                              <div
                                :ref="
                                  (el) => {
                                    refequalto[dindex] = el;
                                  }
                                "
                                v-if="treeequalto.show[dindex]"
                                class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                style="padding: 1px 5px"
                                :class="{ shake: treeequalto.disabled[dindex] }"
                              >
                                <div class="flex-shrink-0 flex-grow-0">
                                  <a
                                    @click="deleteSaved(dindex, 'EQUAL-TO')"
                                    class="remove-selected m-0 d-inline-block underline-none"
                                  >
                                    <img
                                      class="align-middle"
                                      src="/src/assets/icons/close.png"
                                      style="width: 25px; height: 25px"
                                    />
                                  </a>
                                </div>
                                <div
                                  class="flex-fill"
                                  style="padding-left: 5px"
                                >
                                  <div class="d-block" style="padding: 5px">
                                    <div
                                      :ref="
                                        (el) => {
                                          refequaltoinner[dindex] = el;
                                        }
                                      "
                                      class="text-left d-block text-wrap text-break shadow-sm"
                                      style="
                                        border-radius: 20px;
                                        padding: 8px;
                                        z-index: 999;
                                      "
                                    >
                                      <label
                                        class="d-block align-middle letter-spacing"
                                        style="font-size: 0.875rem"
                                        >{{ data }}</label
                                      >
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Transition>
                          </li>
                          <li ref="equaltoref"></li>
                        </ul>
                      </div>
                      <div class="d-block" style="padding-top: 5px">
                        <button
                          :disabled="equaltoAddNew ? false : true"
                          @click="
                            increaseIndexAndSavePrevious(
                              'NON-RANGE',
                              cards[index].search.equalto,
                              equalto,
                              'EQUAL-TO'
                            )
                          "
                          class="btn w-100"
                          :style="
                            equaltoAddNew
                              ? 'background-color: #F0E68C;'
                              : 'background-color:#eee;'
                          "
                          style="padding: 4px 0 1px 0; font-size: 0.85rem"
                        >
                          Add New
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="flex-w-50" style="padding-left: 10px">
                    <div class="d-block shadow-sm" style="padding: 5px">
                      <div class="d-block" style="padding-bottom: 5px">
                        <img
                          src="/src/assets/icons/not-equal-to.png"
                          class="align-middle"
                          style="width: 24px; height: 24px"
                        />
                      </div>
                      <div class="d-block">
                        <input
                          @keyup="resetOthers('NOT-EQUAL-TO')"
                          @keydown.space.prevent
                          v-model.trim="notequalto"
                          @click.once="setTabs('NOT-EQUAL-TO')"
                          type="text"
                          class="w-100 text-center"
                          style="height: 30px; z-index: 1110"
                        />
                      </div>
                      <div
                        class="d-block overflow-y-auto overflow-x-hidden"
                        style="height: 180px; z-index: 1000"
                      >
                        <ul
                          class="d-block list-style-none m-0"
                          style="padding: 5px 0px"
                        >
                          <li
                            class="w-100"
                            v-for="(data, dindex) in cards[index].search
                              .notequalto.value"
                            :key="'exc' + dindex"
                          >
                            <Transition>
                              <div
                                :ref="
                                  (el) => {
                                    refnotequalto[dindex] = el;
                                  }
                                "
                                v-if="treenotequalto.show[dindex]"
                                class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                style="padding: 1px 5px"
                                :class="{
                                  shake: treenotequalto.disabled[dindex],
                                }"
                              >
                                <div class="flex-shrink-0 flex-grow-0">
                                  <a
                                    @click="deleteSaved(dindex, 'NOT-EQUAL-TO')"
                                    class="remove-selected m-0 d-inline-block underline-none"
                                  >
                                    <img
                                      class="align-middle"
                                      src="/src/assets/icons/close.png"
                                      style="width: 25px; height: 25px"
                                    />
                                  </a>
                                </div>
                                <div
                                  class="flex-fill"
                                  style="padding-left: 5px"
                                >
                                  <div class="d-block" style="padding: 5px">
                                    <div
                                      :ref="
                                        (el) => {
                                          refnotequaltoinner[dindex] = el;
                                        }
                                      "
                                      class="text-left d-block text-wrap text-break shadow-sm"
                                      style="
                                        border-radius: 20px;
                                        padding: 8px;
                                        z-index: 999;
                                      "
                                    >
                                      <label
                                        class="d-block align-middle letter-spacing"
                                        style="font-size: 0.875rem"
                                        >{{ data }}</label
                                      >
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Transition>
                          </li>
                          <li ref="notequaltoref"></li>
                        </ul>
                      </div>
                      <div class="d-block" style="padding-top: 5px">
                        <button
                          :disabled="notequaltoAddNew ? false : true"
                          @click="
                            increaseIndexAndSavePrevious(
                              'NON-RANGE',
                              cards[index].search.notequalto,
                              notequalto,
                              'NOT-EQUAL-TO'
                            )
                          "
                          class="btn w-100"
                          :style="
                            notequaltoAddNew
                              ? 'background-color: #F0E68C;'
                              : 'background-color:#eee;'
                          "
                          style="padding: 4px 0 1px 0; font-size: 0.85rem"
                        >
                          Add New
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-block" style="padding: 0 0 15px 0">
                <div
                  style="padding: 5px"
                  class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                >
                  <div class="flex-grow-1 flex-shrink-1">
                    <div class="d-block" style="padding-bottom: 5px">
                      <label>From</label>
                    </div>
                    <div class="d-block">
                      <input
                        @keydown.space.prevent
                        v-model.trim="from"
                        @keyup="resetOthers('FROM-TO')"
                        @click.once="setTabs('FROM-TO')"
                        type="text"
                        class="w-100 text-center"
                        style="height: 30px"
                      />
                    </div>
                  </div>
                  <div class="flex-grow-1 flex-shrink-1">
                    <div class="d-block" style="padding-bottom: 5px">
                      <label>To</label>
                    </div>
                    <div class="d-block">
                      <input
                        @keydown.space.prevent
                        v-model.trim="to"
                        @keyup="resetOthers('FROM-TO')"
                        @click.once="setTabs('FROM-TO')"
                        type="text"
                        class="w-100 text-center"
                        style="height: 30px"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-block" style="padding: 15px 0">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                >
                  <div class="flex-w-100-over-3">
                    <button
                      :style="
                        done
                          ? 'background-color: #F0E68C;'
                          : 'background-color: #eee;'
                      "
                      :disabled="done ? false : true"
                      class="btn w-100 shadow-sm"
                      style="padding: 7px; border-radius: 12px"
                    >
                      Done
                    </button>
                  </div>
                  <div class="flex-w-100-over-3">
                    <button
                      @click="openExcludeWindow()"
                      class="btn w-100 shadow-sm"
                      style="padding: 7px; border-radius: 12px"
                      :style="
                        exclude
                          ? 'background-color: #2196F3;color:#fff;'
                          : 'background-color:#eee;'
                      "
                      :disabled="exclude ? false : true"
                    >
                      Exclude
                    </button>
                  </div>
                  <div class="flex-w-100-over-3">
                    <button
                      :disabled="clear ? false : true"
                      :style="
                        clear
                          ? 'background-color:red;color:#fff;'
                          : 'background-color:#eee;'
                      "
                      class="btn w-100 shadow-sm"
                      style="padding: 7px; border-radius: 12px"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
              <Teleport to="body">
                <div v-if="openExclude" class="d-block position-relative">
                  <transition name="modal">
                    <div
                      class="position-fixed h-100 w-100 overflow-auto user-select-none"
                      style="z-index: 1800"
                    >
                      <div
                        class="modal-mask h-100 w-100 modal-mask-background-2"
                      >
                        <div class="modal-wrapper text-center">
                          <div
                            class="modal-container d-block"
                            style="border-bottom: 3px solid blue"
                          >
                            <div class="d-block m-0 p-0">
                              <div class="d-block">
                                <div
                                  class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                                  style="
                                    background-color: blue;
                                    padding: 0 10px;
                                  "
                                >
                                  <div class="flex-fill text-left">
                                    <span
                                      class="m-0 p-0 text-capitalize text-center letter-spacing font-bold font-0-dot-80-rem"
                                      style="color: #fff"
                                      >{{ cards[index].info.name }}</span
                                    >
                                  </div>
                                  <div
                                    class="flex-grow-0 flex-shrink-0 text-right"
                                  >
                                    <a
                                      class="underline-none cursor-pointer align-middle"
                                      @click="openExclude = false"
                                    >
                                      <img
                                        src="/src/assets/icons/close.png"
                                        class="align-middle"
                                        style="width: 24px; height: 24px"
                                      />
                                    </a>
                                  </div>
                                </div>
                                <div
                                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                                  style="padding: 10px 0"
                                >
                                  <div class="flex-w-50">
                                    <span
                                      class="d-inline-block p-0 m-0 letter-spacing align-middle"
                                    >
                                      Max:
                                      {{
                                        cards[index].search.tab ===
                                        "GREATER-THAN"
                                          ? cards[index].result.max
                                          : cards[index].search.tab ===
                                            "LESS-THAN"
                                          ? lessthan
                                          : to
                                      }}
                                    </span>
                                  </div>
                                  <div class="flex-w-50">
                                    <span
                                      class="d-inline-block p-0 m-0 letter-spacing align-middle"
                                    >
                                      Min:
                                      {{
                                        cards[index].search.tab === "LESS-THAN"
                                          ? cards[index].result.min
                                          : cards[index].search.tab ===
                                            "GREATER-THAN"
                                          ? greaterthan
                                          : from
                                      }}
                                    </span>
                                  </div>
                                </div>
                                <template
                                  v-if="
                                    cards[index].search.tab === 'GREATER-THAN'
                                  "
                                >
                                  <div
                                    class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center shadow-sm"
                                    style="padding: 5px 10px"
                                  >
                                    <div
                                      class="flex-shrink-0 flex-grow-0 align-middle p-0 m-0"
                                    >
                                      <img
                                        src="/src/assets/icons/greater-than.png"
                                        style="width: 25px; height: 25px"
                                        class="align-middle"
                                      />
                                    </div>
                                    <div
                                      class="m-0 flex-shrink-0 flex-grow-0 letter-spacing font-bold align-middle"
                                      style="padding: 5px 0 1px 5px"
                                    >
                                      {{ greaterthan }}
                                    </div>
                                  </div>
                                </template>
                                <template
                                  v-else-if="
                                    cards[index].search.tab === 'LESS-THAN'
                                  "
                                >
                                  <div
                                    class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center shadow-sm"
                                    style="padding: 5px 10px"
                                  >
                                    <div
                                      class="flex-shrink-0 flex-grow-0 align-middle p-0 m-0"
                                    >
                                      <img
                                        src="/src/assets/icons/less-than.png"
                                        style="width: 25px; height: 25px"
                                        class="align-middle"
                                      />
                                    </div>
                                    <div
                                      class="m-0 flex-shrink-0 flex-grow-0 letter-spacing font-bold align-middle"
                                      style="padding: 5px 0 1px 5px"
                                    >
                                      {{ lessthan }}
                                    </div>
                                  </div>
                                </template>
                                <template v-else>
                                  <div
                                    class="d-block shadow-sm text-center"
                                    style="padding: 5px 10px"
                                  >
                                    <img
                                      src="/src/assets/icons/range.png"
                                      style="width: 25px; height: 25px"
                                      class="align-middle"
                                    />
                                  </div>
                                </template>
                                <div
                                  class="d-block text-center"
                                  style="padding: 10px 0 5px 0"
                                >
                                  <span
                                    class="d-inline-block letter-spacing font-bold font-0-dot-70-rem"
                                    >Exclude By</span
                                  >
                                </div>
                                <div class="d-block" style="padding: 5px">
                                  <div class="d-block">
                                    <div
                                      class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                                    >
                                      <div
                                        class="flex-w-60"
                                        style="padding-right: 5px"
                                      >
                                        <div
                                          class="d-block text-center shadow-sm"
                                          style="padding: 5px 0"
                                        >
                                          <span
                                            class="d-inline-block letter-spacing font-0-dot-80-rem"
                                            >RANGE</span
                                          >
                                        </div>
                                        <div
                                          class="d-block shadow-sm"
                                          style="padding: 10px 5px 5px"
                                        >
                                          <div
                                            class="w-100 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                                          >
                                            <div
                                              class="flex-grow-1 flex-shrink-1"
                                            >
                                              <div
                                                class="d-block"
                                                style="padding-bottom: 5px"
                                              >
                                                <label>From</label>
                                              </div>
                                              <div class="d-block">
                                                <input
                                                  @keydown.space.prevent
                                                  v-model.trim="
                                                    excludefromtofrom
                                                  "
                                                  type="text"
                                                  class="w-100 text-center"
                                                  style="
                                                    height: 30px;
                                                    z-index: 1110;
                                                  "
                                                />
                                              </div>
                                            </div>
                                            <div
                                              class="flex-grow-1 flex-shrink-1"
                                            >
                                              <div
                                                class="d-block"
                                                style="padding-bottom: 5px"
                                              >
                                                <label>To</label>
                                              </div>
                                              <div class="d-block">
                                                <input
                                                  @keydown.space.prevent
                                                  v-model.trim="excludefromtoto"
                                                  type="text"
                                                  class="w-100 text-center"
                                                  style="
                                                    height: 30px;
                                                    z-index: 1110;
                                                  "
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            class="d-block overflow-y-auto overflow-x-hidden"
                                            style="height: 180px; z-index: 1000"
                                          >
                                            <ul
                                              class="d-block list-style-none m-0"
                                              style="padding: 5px 0px"
                                            >
                                              <li
                                                class="w-100"
                                                v-for="(data, dindex) in cards[
                                                  index
                                                ].search.exclude.fromto.from"
                                                :key="
                                                  cards[index].search.tab +
                                                  '-EXCLUDE-FROM-TO' +
                                                  dindex
                                                "
                                              >
                                                <Transition>
                                                  <div
                                                    :ref="
                                                      (el) => {
                                                        refexcludefromto[
                                                          dindex
                                                        ] = el;
                                                      }
                                                    "
                                                    v-if="
                                                      treeexcludefromto.show[
                                                        dindex
                                                      ]
                                                    "
                                                    class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                                                    style="padding: 1px 5px"
                                                    :class="{
                                                      shake:
                                                        treeexcludefromto
                                                          .disabled[dindex],
                                                    }"
                                                  >
                                                    <div
                                                      class="flex-shrink-0 flex-grow-0"
                                                    >
                                                      <a
                                                        @click="
                                                          deleteSaved(
                                                            dindex,
                                                            'EXCLUDE-FROM-TO'
                                                          )
                                                        "
                                                        class="remove-selected m-0 d-inline-block underline-none"
                                                      >
                                                        <img
                                                          class="align-middle"
                                                          src="/src/assets/icons/close.png"
                                                          style="
                                                            width: 25px;
                                                            height: 25px;
                                                          "
                                                        />
                                                      </a>
                                                    </div>
                                                    <div
                                                      class="flex-fill"
                                                      style="padding-left: 5px"
                                                    >
                                                      <div
                                                        class="d-block"
                                                        style="padding: 5px"
                                                      >
                                                        <div
                                                          :ref="
                                                            (el) => {
                                                              refexcludefromtoinner[
                                                                dindex
                                                              ] = el;
                                                            }
                                                          "
                                                          class="d-block text-wrap text-break shadow-sm"
                                                          style="
                                                            border-radius: 20px;
                                                            padding: 8px;
                                                            z-index: 999;
                                                          "
                                                        >
                                                          <label
                                                            class="d-block align-middle letter-spacing text-left font-0-dot-875-rem"
                                                          >
                                                            {{
                                                              cards[index]
                                                                .search.exclude
                                                                .fromto.from[
                                                                dindex
                                                              ]
                                                            }}
                                                            -
                                                            {{
                                                              cards[index]
                                                                .search.exclude
                                                                .fromto.to[
                                                                dindex
                                                              ]
                                                            }}
                                                          </label>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Transition>
                                              </li>
                                              <li ref="excludefromtoref"></li>
                                            </ul>
                                          </div>
                                          <div
                                            class="d-block"
                                            style="padding-top: 10px"
                                          >
                                            <button
                                              :style="
                                                excludeAddNewFromTo
                                                  ? 'background-color: #F0E68C;'
                                                  : 'background-color: #eee;'
                                              "
                                              :disabled="
                                                excludeAddNewFromTo
                                                  ? false
                                                  : true
                                              "
                                              @click="
                                                () => {
                                                  increaseIndexAndSavePrevious(
                                                    'RANGE',
                                                    cards[index].search.exclude
                                                      .fromto,
                                                    [
                                                      excludefromtofrom,
                                                      excludefromtoto,
                                                    ],
                                                    'EXCLUDE-FROM-TO'
                                                  );
                                                }
                                              "
                                              class="btn w-100 shadow-sm font-0-dot-85-rem"
                                              style="padding: 5px 0 1px 0"
                                            >
                                              Add New
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        class="flex-w-40"
                                        style="padding-left: 5px"
                                      >
                                        <div
                                          class="d-block text-center shadow-sm"
                                          style="padding: 5px 0"
                                        >
                                          <span
                                            class="d-inline-block letter-spacing font-0-dot-80-rem"
                                            >EQUAL TO</span
                                          >
                                        </div>
                                        <div
                                          class="d-block shadow-sm"
                                          style="padding: 10px 5px 5px"
                                        >
                                          <div
                                            class="d-block"
                                            style="padding-bottom: 5px"
                                          >
                                            <img
                                              src="/src/assets/icons/equal-to.png"
                                              class="align-middle"
                                              style="width: 24px; height: 24px"
                                            />
                                          </div>
                                          <div class="d-block">
                                            <input
                                              @keydown.space.prevent
                                              v-model.trim="excludeequalto"
                                              type="text"
                                              class="w-100 text-center"
                                              style="
                                                height: 30px;
                                                z-index: 1110;
                                              "
                                            />
                                          </div>
                                          <div
                                            class="d-block overflow-y-auto overflow-x-hidden"
                                            style="height: 180px; z-index: 1000"
                                          >
                                            <ul
                                              class="d-block list-style-none m-0"
                                              style="padding: 5px 0px"
                                            >
                                              <li
                                                class="w-100"
                                                v-for="(data, dindex) in cards[
                                                  index
                                                ].search.exclude.equalto.value"
                                                :key="
                                                  cards[index].search.tab +
                                                  '-EXCLUDE-EQUAL-TO' +
                                                  dindex
                                                "
                                              >
                                                <Transition>
                                                  <div
                                                    :ref="
                                                      (el) => {
                                                        refexcludeequalto[
                                                          dindex
                                                        ] = el;
                                                      }
                                                    "
                                                    v-if="
                                                      treeexcludeequalto.show[
                                                        dindex
                                                      ]
                                                    "
                                                    class="flex-box flex-direction-row w-100 flex-nowrap justify-content-start align-items-center"
                                                    style="padding: 1px 5px"
                                                    :class="{
                                                      shake:
                                                        treeexcludeequalto
                                                          .disabled[dindex],
                                                    }"
                                                  >
                                                    <div
                                                      class="flex-shrink-0 flex-grow-0"
                                                    >
                                                      <a
                                                        @click="
                                                          deleteSaved(
                                                            dindex,
                                                            'EXCLUDE-EQUAL-TO'
                                                          )
                                                        "
                                                        class="m-0 d-inline-block underline-none"
                                                      >
                                                        <img
                                                          class="align-middle"
                                                          src="/src/assets/icons/close.png"
                                                          style="
                                                            width: 25px;
                                                            height: 25px;
                                                          "
                                                        />
                                                      </a>
                                                    </div>
                                                    <div
                                                      class="flex-fill"
                                                      style="padding-left: 5px"
                                                    >
                                                      <div
                                                        class="d-block"
                                                        style="padding: 5px"
                                                      >
                                                        <div
                                                          :ref="
                                                            (el) => {
                                                              refexcludeequaltoinner[
                                                                dindex
                                                              ] = el;
                                                            }
                                                          "
                                                          class="d-block text-wrap text-break shadow-sm"
                                                          style="
                                                            border-radius: 20px;
                                                            padding: 8px;
                                                            z-index: 999;
                                                          "
                                                        >
                                                          <label
                                                            class="d-block align-middle letter-spacing text-left font-0-dot-875-rem"
                                                            >{{ data }}</label
                                                          >
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Transition>
                                              </li>
                                              <li ref="excludeequaltoref"></li>
                                            </ul>
                                          </div>
                                          <div
                                            class="d-block"
                                            style="padding-top: 10px"
                                          >
                                            <button
                                              @click="
                                                () => {
                                                  increaseIndexAndSavePrevious(
                                                    'NON-RANGE',
                                                    cards[index].search.exclude
                                                      .equalto,
                                                    excludeequalto,
                                                    'EXCLUDE-EQUAL-TO'
                                                  );
                                                }
                                              "
                                              class="btn w-100 shadow-sm font-0-dot-85-rem"
                                              style="padding: 5px 0 1px 0"
                                              :style="
                                                excludeAddNewEqualto
                                                  ? 'background-color: #F0E68C;'
                                                  : 'background-color: #eee;'
                                              "
                                              :disabled="
                                                excludeAddNewEqualto
                                                  ? false
                                                  : true
                                              "
                                            >
                                              Add New
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style="padding: 15px 10px"
                                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                                >
                                  <div class="flex-w-50">
                                    <button
                                      class="btn w-100 shadow-sm"
                                      style="padding: 7px; border-radius: 12px"
                                      :style="
                                        excludeDone
                                          ? 'background-color: #F0E68C;'
                                          : 'background-color: #eee;'
                                      "
                                      :disabled="excludeDone ? false : true"
                                    >
                                      Done
                                    </button>
                                  </div>
                                  <div class="flex-w-50">
                                    <button
                                      class="btn w-100 shadow-sm"
                                      style="padding: 7px; border-radius: 12px"
                                      :style="
                                        excludeClear
                                          ? 'background-color: red;color:#fff;'
                                          : 'background-color: #eee;'
                                      "
                                      :disabled="excludeClear ? false : true"
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </Teleport>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
.modal-mask-background-1 {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-mask-background-2 {
  background-color: rgba(255, 255, 255, 0.85);
}
.modal-mask {
  top: 0;
  left: 0;
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0px auto;
  background-color: #f8f8f8;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  width: 480px;
}
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>