import type { 
  NumberSearcherUIType
} from '../types/SupportedDatatypesTypeDeclaration';
import { type ShallowRef, triggerRef, nextTick, } from "vue";


function scrollToElement(el: HTMLDivElement | HTMLLIElement) {
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
  
function excludeFromToGuard(from: string, to: string, mainnumbersearcherui: NumberSearcherUIType["main"]) {
  if (mainnumbersearcherui.tab === "GREATER-THAN") {
    let grt = mainnumbersearcherui.greaterthan.value;
    if (parseFloat(from) > parseFloat(grt) && parseFloat(from) < parseFloat(to)) {
      return true;
    } else {
      return false;
    }
  } else if (mainnumbersearcherui.tab === "LESS-THAN") {
    let lst = mainnumbersearcherui.lessthan.value;
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
  
export function deleteSaved(
  index: number,
  treetype: "NOT-EQUAL-TO" | "EXCLUDE-FROM-TO" | "EQUAL-TO" | "EXCLUDE-EQUAL-TO",
  numbersearcherui: ShallowRef<NumberSearcherUIType["main"]> | ShallowRef<NumberSearcherUIType>
) {
  switch (treetype) {
    case "NOT-EQUAL-TO":
      for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.value.length; i++) {
        if (i === index) {
          let time: NodeJS.Timeout;
          time = setTimeout(() => {
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.show.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.value.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.disabled.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.index -= 1;
            triggerRef(numbersearcherui);
            clearTimeout(time);
          }, 10);
          break;
        }
      }
      break;
    case "EQUAL-TO":
      for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.value.length; i++) {
        if (i === index) {
          let time: NodeJS.Timeout;
          time = setTimeout(() => {
            (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.show.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.value.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.disabled.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.index -= 1;
            triggerRef(numbersearcherui);
            clearTimeout(time);
          }, 10);
          break;
        }
      }
      break;
    case "EXCLUDE-EQUAL-TO":
      for (
        let i = 0;
        i < (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.length;
        i++
      ) {
        if (i === index) {
          let time: NodeJS.Timeout;
          time = setTimeout(() => {
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.show.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.index -= 1;
            triggerRef(numbersearcherui);
            clearTimeout(time);
          }, 10);
          break;
        }
      }
      break;
    default:
      for (
        let i = 0;
        i < (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from.length;
        i++
      ) {
        if (i === index) {
          let time: NodeJS.Timeout;
          time = setTimeout(() => {
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.show.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.to.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.disabled.splice(i, 1);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.index -= 1;
            triggerRef(numbersearcherui);
            clearTimeout(time);
          }, 10);
          break;
        }
      }
      break;
  }
}
  
export function increaseIndexAndSavePrevious(
  rangeornot: string,
  debouncedref: string | string[],
  buttontype: "NOT-EQUAL-TO" | "EQUAL-TO" | "EXCLUDE-FROM-TO" | "EXCLUDE-EQUAL-TO",
  numbersearcherui: ShallowRef<NumberSearcherUIType> | ShallowRef<NumberSearcherUIType["main"]>
) {
  if (rangeornot === "RANGE") {
    let 
      from = debouncedref[0],
      to = debouncedref[1]
    ;
    if (from && to) {
      if (excludeFromToGuard(from, to, (numbersearcherui.value as NumberSearcherUIType).main)) {
        if ((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from.length === 0) {
          for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.length; i++) {
            if (
              parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value[i]) >= parseFloat(from) &&
              parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value[i]) <= parseFloat(to)
            ) {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequalto[i]);
              (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled[i] = false;
              triggerRef(numbersearcherui);
    
              let time: NodeJS.Timeout;
              time = setTimeout(() => {
                (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled[i] = true;
                scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequalto[i]);
                (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.show[i] = false;
                triggerRef(numbersearcherui);
                clearTimeout(time);
              }, 100);
            }
          }
          for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.length; i++) {
            if (
              parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value[i]) >= parseFloat(from) &&
              parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value[i]) <= parseFloat(to)
            ) {
              let time: NodeJS.Timeout;
              time = setInterval(() => {
                if ((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.show[i] === false) {
                  scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequalto[i]);
                  (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.show.splice(i, 1);
                  (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.splice(i, 1);
                  (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled.splice(i, 1);
                  triggerRef(numbersearcherui);
                  clearInterval(time);
                }
              }, 50);
            }
          }
          (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from.push(from);
          (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.to.push(to);
          (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.disabled.push(false);
          (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.show.push(true);
          (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.index++;
          triggerRef(numbersearcherui);
    
          let time1: NodeJS.Timeout;
          time1 = setTimeout(() => {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoref as HTMLLIElement);
            clearTimeout(time1);
          }, 50);
        } else {
          let
            fromwithinpreviousrange = false,
            fromwithinpreviousrangeindex = 0
          ;
          for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from.length; i++) {
            if (
              (
                parseFloat(from) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from[i])
                &&
                parseFloat(from) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.to[i])
              )
              ||
              (
                parseFloat(from) < parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from[i])
                &&
                parseFloat(to) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from[i])
                &&
                (
                  parseFloat(to) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.to[i]) 
                  ||
                  parseFloat(to) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.to[i])
                )
              )
            ) {
              fromwithinpreviousrange = true;
              fromwithinpreviousrangeindex = i;
              break;
            }
          }
          if (!fromwithinpreviousrange) {
            for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.length; i++) {
              if (
                parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value[i]) >= parseFloat(from) 
                &&
                parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value[i]) <= parseFloat(to)
              ) {
                scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequalto[i]);
                (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled[i] = false;
                triggerRef(numbersearcherui);
    
                let time: NodeJS.Timeout;
                time = setTimeout(() => {
                  (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled[i] = true;
                  scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequalto[i]);
                  (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.show[i] = false;
                  triggerRef(numbersearcherui);
                  clearTimeout(time);
                }, 100);
              }
            }
            for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.length; i++) {
              if (
                parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value[i]) >= parseFloat(from) &&
                parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value[i]) <= parseFloat(to)
              ) {
                let time: NodeJS.Timeout;
                time = setInterval(() => {
                  if ((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.show[i] === false) {
                    scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequalto[i]);
                    (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.show.splice(i, 1);
                    (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.splice(i, 1);
                    (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled.splice(i, 1);
                    triggerRef(numbersearcherui);
                    clearInterval(time);
                  }
                }, 50);
              }
            }
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from.push(from);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.to.push(to);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.disabled.push(false);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.show.push(true);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.index++;
            triggerRef(numbersearcherui);
    
            nextTick(() => {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.excludefromtoref as HTMLLIElement);
            });
          } else {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromto[fromwithinpreviousrangeindex]);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.disabled[fromwithinpreviousrangeindex] = false;
            triggerRef(numbersearcherui);
            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[
                fromwithinpreviousrangeindex
              ].style.backgroundColor = "#66bb6a";
              (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.disabled[fromwithinpreviousrangeindex] = true;
              triggerRef(numbersearcherui);
              clearTimeout(time1);
            }, 100);
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if (
                (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[fromwithinpreviousrangeindex] !== undefined &&
                (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[fromwithinpreviousrangeindex] !== null
              ) {
                if (
                  (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[fromwithinpreviousrangeindex].style
                    .backgroundColor !== "#fff"
                )
                (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[
                    fromwithinpreviousrangeindex
                  ].style.backgroundColor = "#fff";
              }
              clearTimeout(time2);
            }, 400);
          }
        }
      }
    }
  } else {
    if (typeof debouncedref === 'string') {
      let found = false,
        foundindex = 0;
      for (
        let i = 0; 
        i < ((buttontype === 'EQUAL-TO') ?
          (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.value.length
          : (
            buttontype === 'NOT-EQUAL-TO'?
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.value.length
            :
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.length
          ))
        ; 
        i++
      ) {
        if (
          (
            (buttontype === 'EQUAL-TO') ?
              (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.value[i]
              : (
                  (buttontype === 'NOT-EQUAL-TO') ?
                    (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.value[i]
                    :
                    (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value[i]
                )
          )
          === debouncedref
        ) {
          found = true;
          foundindex = i;
          break;
        }
      }
      let increment = true;
      switch (buttontype) {
        case "EQUAL-TO":
          if (!found) {
            (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.value.push(debouncedref as string);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.disabled.push(false);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.show.push(true);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.index++;
            triggerRef(numbersearcherui);
            let time: NodeJS.Timeout;
            time = setTimeout(() => {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType["main"]).equaltoref as HTMLLIElement);
              clearTimeout(time);
            }, 50);
          } else {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType["main"]).refequalto[foundindex]);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.disabled[foundindex] = false;
            triggerRef(numbersearcherui);
            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              (numbersearcherui.value as NumberSearcherUIType["main"]).refequaltoinner[foundindex].style.backgroundColor = "#66bb6a";
              (numbersearcherui.value as NumberSearcherUIType["main"]).treeequalto.disabled[foundindex] = true;
              triggerRef(numbersearcherui);
              clearTimeout(time1);
            }, 100);
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if (
                (numbersearcherui.value as NumberSearcherUIType["main"]).refequaltoinner[foundindex] !== undefined &&
                (numbersearcherui.value as NumberSearcherUIType["main"]).refequaltoinner[foundindex] !== null
              ) {
                if ((numbersearcherui.value as NumberSearcherUIType["main"]).refequaltoinner[foundindex].style.backgroundColor !== "#fff") {
                  (numbersearcherui.value as NumberSearcherUIType["main"]).refequaltoinner[foundindex].style.backgroundColor = "#fff";
                  triggerRef(numbersearcherui);
                }
              }
              clearTimeout(time2);
            }, 400);
          }
          (numbersearcherui.value as NumberSearcherUIType["main"]).equalto.value = "";
          break;
        case "NOT-EQUAL-TO":
          if (!found) {
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.value.push(debouncedref);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.disabled.push(false);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.show.push(true);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.index++;
            triggerRef(numbersearcherui);
            let time: NodeJS.Timeout;
            time = setTimeout(() => {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType["main"]).notequaltoref as HTMLLIElement);
              clearTimeout(time);
            }, 50);
          } else {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType["main"]).refnotequalto[foundindex]);
            (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.disabled[foundindex] = false;
            triggerRef(numbersearcherui);
            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              (numbersearcherui.value as NumberSearcherUIType["main"]).refnotequaltoinner[foundindex].style.backgroundColor = "#66bb6a";
              (numbersearcherui.value as NumberSearcherUIType["main"]).treenotequalto.disabled[foundindex] = true;
              triggerRef(numbersearcherui);
              clearTimeout(time1);
            }, 100);
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if (
                (numbersearcherui.value as NumberSearcherUIType["main"]).refnotequaltoinner[foundindex] !== undefined &&
                (numbersearcherui.value as NumberSearcherUIType["main"]).refnotequaltoinner[foundindex] !== null
              ) {
                if ((numbersearcherui.value as NumberSearcherUIType["main"]).refnotequaltoinner[foundindex].style.backgroundColor !== "#fff") {
                  (numbersearcherui.value as NumberSearcherUIType["main"]).refnotequaltoinner[foundindex].style.backgroundColor = "#fff";
                  triggerRef(numbersearcherui);
                }
              }
              clearTimeout(time2);
            }, 400);
          }
          (numbersearcherui.value as NumberSearcherUIType["main"]).notequalto.value = "";
          break;
        default:
          let fromwithinpreviousrange = false,
            fromwithinpreviousrangeindex = 0;
          for (let i = 0; i < (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from.length; i++) {
            if (
              parseFloat(debouncedref) >= parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.from[i]) &&
              parseFloat(debouncedref) <= parseFloat((numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.to[i])
            ) {
              fromwithinpreviousrange = true;
              fromwithinpreviousrangeindex = i;
              break;
            }
          }
          if (fromwithinpreviousrange) {
            scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromto[fromwithinpreviousrangeindex]);
            (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.disabled[fromwithinpreviousrangeindex] = false;
            triggerRef(numbersearcherui);
   
            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[
                fromwithinpreviousrangeindex
              ].style.backgroundColor = "#66bb6a";
              (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludefromto.disabled[fromwithinpreviousrangeindex] = true;
              triggerRef(numbersearcherui);
              clearTimeout(time1);
            }, 100);
     
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if (
                (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[fromwithinpreviousrangeindex] !== undefined &&
                (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[fromwithinpreviousrangeindex] !== null
              ) {
                if (
                  (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[fromwithinpreviousrangeindex].style
                    .backgroundColor !== "#fff"
                ) {
                  (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludefromtoinner[
                    fromwithinpreviousrangeindex
                  ].style.backgroundColor = "#fff";
                  
                  triggerRef(numbersearcherui);
                }
              }
              clearTimeout(time2);
            }, 400);
          } else {
            if (!found) {
              (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.value.push(debouncedref);
              (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled.push(false);
              (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.show.push(true);
              (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.index++;
              triggerRef(numbersearcherui);
              let time: NodeJS.Timeout;
              time = setTimeout(() => {
                scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.excludeequaltoref as HTMLLIElement);
                clearTimeout(time);
              }, 50);
            } else {
              scrollToElement((numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequalto[foundindex]);
              (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled[foundindex] = false;
              triggerRef(numbersearcherui);
              let time1: NodeJS.Timeout;
              time1 = setTimeout(() => {
                (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequaltoinner[foundindex].style.backgroundColor = "#66bb6a";
                (numbersearcherui.value as NumberSearcherUIType).exclude.treeexcludeequalto.disabled[foundindex] = true;
                triggerRef(numbersearcherui);
                clearTimeout(time1);
              },100);
              let time2: NodeJS.Timeout;
              time2 = setTimeout(() => {
                if (
                  (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequaltoinner[foundindex] !== undefined &&
                  (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequaltoinner[foundindex] !== null
                ) {
                  if (
                    (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequaltoinner[foundindex].style.backgroundColor !==
                    "#fff"
                  ) {
                    (numbersearcherui.value as NumberSearcherUIType).exclude.refexcludeequaltoinner[foundindex].style.backgroundColor =
                      "#fff";
                    triggerRef(numbersearcherui);
                  }
                }
                clearTimeout(time2);
              }, 400);
            }
          }
          (numbersearcherui.value as NumberSearcherUIType).exclude.excludeequalto.value = "";
          
          break;
      }
    }
  }
  triggerRef(numbersearcherui);
}

function paginate(operator: "EQUAL-TO" | "NOT-EQUAL-TO", mainnumbersearcherui: ShallowRef<NumberSearcherUIType["main"]>) {
  if(operator === "EQUAL-TO") {
    let includesize = mainnumbersearcherui.value.treeequalto.temporary.length;
    if (includesize > 0) {
      mainnumbersearcherui.value.treeequalto.pages = [];
      let innerpage = [],
        j = 0,
        k = 0,
        suminclude = 0;
      for (let i = 0; i < includesize; i++) {
        suminclude++;
        innerpage[k] = mainnumbersearcherui.value.treeequalto.temporary[i];
        if (suminclude > 100) {
          innerpage.splice(k, 1);
          if (innerpage.length > 0) mainnumbersearcherui.value.treeequalto.pages[j] = innerpage;
          innerpage = [];
          j++;
          k = -1;
          i -= 1;
          suminclude = 0;
        } else {
          if (i === includesize - 1 && innerpage.length > 0) {
            mainnumbersearcherui.value.treeequalto.pages[j] = innerpage;
          }
        }
        k++;
      }
    }
  }
  else {
    let includesize = mainnumbersearcherui.value.treenotequalto.temporary.length;
    if (includesize > 0) {
      mainnumbersearcherui.value.treenotequalto.pages = [];
      let innerpage = [],
        j = 0,
        k = 0,
        suminclude = 0;
      for (let i = 0; i < includesize; i++) {
        suminclude++;
        innerpage[k] = mainnumbersearcherui.value.treenotequalto.temporary[i];
        if (suminclude > 100) {
          innerpage.splice(k, 1);
          if (innerpage.length > 0) mainnumbersearcherui.value.treenotequalto.pages[j] = innerpage;
          innerpage = [];
          j++;
          k = -1;
          i -= 1;
          suminclude = 0;
        } else {
          if (i === includesize - 1 && innerpage.length > 0) {
            mainnumbersearcherui.value.treenotequalto.pages[j] = innerpage;
          }
        }
        k++;
      }
    }
  }
}
  
