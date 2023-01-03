import type { 
  CurrentAndSignalInnerType,
  CurrentAndSignalType, 
  AtNumber, 
  NumberSearchType, 
  StringSearchType, 
  NumberType, 
  NumberSearchExcludeEqualToType, 
  NumberSearchExcludeFromToType 
} from "../types/SupportedDatatypesTypeDeclaration";
import { type Ref, nextTick, type ShallowRef, triggerRef, } from "vue";

const limit = 10;

function scrollToElement(el: HTMLDivElement | HTMLLIElement) {
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

async function isAlreadyInPageArray(
  currentandsignal: ShallowRef<CurrentAndSignalType>,
  newinputentry: string | [string, string],
  holder: ShallowRef<NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType | NumberType['search'] | AtNumber<NumberSearchType> | StringSearchType>,
  direction: 'DIRECT' | 'INDIRECT-CHECK-WHETHER-NEWINPUTENTRY-WITHIN-RANGE-OF-EXCLUDE-FROMTO' | 'INDIRECT-CHECK-WHETHER-RANGE-NEWINPUTENTRY-COVERS-EXCLUDE-EQUALTO',
  inputtype?: 'WORD' | 'EXCLUDE-EQUAL-TO' | 'EXCLUDE-FROM-TO' | 'NOT-EQUAL-TO' | 'EQUAL-TO' | undefined,
  from?: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL" | undefined
) {
  let inpage = false, pageindex = 0, pos = 0;
  if(direction === 'DIRECT') {
    for(
      let i=0;
      i<(
      inputtype==='WORD'?
          (holder.value as StringSearchType).pages.length
          : (
              inputtype==='EQUAL-TO'?
              ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages.length
              : (
                  inputtype==='NOT-EQUAL-TO'?
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages.length
                  : (
                      inputtype=='EXCLUDE-EQUAL-TO'?
                      ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length
                      :
                      ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages.length
                  )
              )
          )
      );
      i++
    ) {
      for(
        let j=0;
        j<(
          inputtype==='WORD'?
          (holder.value as StringSearchType).pages[i].length
          : (
              inputtype==='EQUAL-TO'?
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages[i].length
                  : (
                  inputtype==='NOT-EQUAL-TO'?
                      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages[i].length
                      : (
                      inputtype=='EXCLUDE-EQUAL-TO'?
                          ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length
                          :
                          ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i].length
                      )
                  )
          )
        );
        j++
      ) {
        if(inputtype==='WORD' || inputtype==='EQUAL-TO' || inputtype==='NOT-EQUAL-TO' || inputtype==='EXCLUDE-EQUAL-TO') {
          if(newinputentry === (
            inputtype==='WORD'?
              (holder.value as StringSearchType).pages[i][j]
              : (
                inputtype==='EQUAL-TO'?
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages[i][j]
                  : (
                    inputtype==='NOT-EQUAL-TO'?
                      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages[i][j]
                      : 
                      ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]
                  )
              )
          )) {
            pageindex = i;
            pos = j;
            inpage = true;
            break;
          }
        }
        else {
          if(
            (
              (
                parseFloat(newinputentry[0]) >= parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][0])
                &&
                (
                  parseFloat(newinputentry[0]) < parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][1])
                  &&
                  parseFloat(newinputentry[1]) >= parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][1])
                )
              )
              ||
              (
                parseFloat(newinputentry[0]) >= parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][0])
                &&
                parseFloat(newinputentry[1]) <= parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][1])
              )
              ||
              (
                parseFloat(newinputentry[0]) <= parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][0])
                &&
                (

                  parseFloat(newinputentry[1]) >= parseFloat(
                    (
                      (
                        holder.value as NumberType['search']
                      ).exclude?.fromto as NumberSearchExcludeFromToType
                    ).pages[i][j][1]
                  )
                  ||
                  (
                    parseFloat(newinputentry[1]) <= parseFloat(
                      (
                        (
                          holder.value as NumberType['search']
                        ).exclude?.fromto as NumberSearchExcludeFromToType
                      ).pages[i][j][1]
                    )
                    &&
                    parseFloat(newinputentry[1]) >= parseFloat(
                      (
                        (
                          holder.value as NumberType['search']
                        ).exclude?.fromto as NumberSearchExcludeFromToType
                      ).pages[i][j][0]
                    )
                  )
                )
              )
            )
            ||
            parseFloat(newinputentry[1]) === parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][0])
            ||
            parseFloat(newinputentry[0]) === parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][1])
          ) {
            pageindex = i;
            pos = j;
            inpage = true;
            break;
          }
        }
      }
      if(inpage) break;
    }
  }
  else if(direction === 'INDIRECT-CHECK-WHETHER-NEWINPUTENTRY-WITHIN-RANGE-OF-EXCLUDE-FROMTO') {
    if(typeof newinputentry === 'string') {
      for(
        let i=0;
        i<((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages.length;
        i++
      ) {
        for(
          let j=0;
          j<((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i].length;
          j++
        ) {
          if(
            parseFloat(newinputentry) >= parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][0])
            &&
            parseFloat(newinputentry) <= parseFloat(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][1])
          ) {
            pageindex = i;
            pos = j;
            inpage = true;
            let time3: NodeJS.Timeout;
            time3 = setTimeout(() => {
              if(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[pos] as HTMLDivElement) {
                scrollToElement(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[pos] as HTMLDivElement);
                (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.backgroundColor = "red";
                (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.color = "#fff";
                ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).show[pos] = true;
                ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[pos] = true;
                triggerRef(holder);
              }
              clearTimeout(time3);
            }, 100);
           
            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[pos] = true;
              triggerRef(holder);
              clearTimeout(time1);
            }, 800);
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement) {
                if(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos].style.backgroundColor !== '#fff') {
                  (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.backgroundColor = "#fff";
                  (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.color = "black";
                  ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[pos] = false;
                  triggerRef(holder);
                }
              }
              clearTimeout(time2);
            }, 810);
            break;
          }
        }
        if(inpage) break;
      }
    }
  }
  else {
    if(typeof newinputentry !== 'string') {
      let inpagepageindexandpos = await isAlreadyInPageArray(currentandsignal, newinputentry, holder, 'DIRECT', "EXCLUDE-FROM-TO", from);
      if(!inpagepageindexandpos.inpage) {
        let 
          time1: NodeJS.Timeout[] = [], 
          time2: NodeJS.Timeout[] = [], 
          time3: NodeJS.Timeout[] = [],  
          time4: NodeJS.Timeout, 
          time5: NodeJS.Timeout,
          time6: NodeJS.Timeout,
          time1Index = 0, 
          time2Index = 0,
          time3Index = 0,
          somethingdeleted = false
        ;
        for(
          let i=0;
          i<((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length;
          i++
        ) {
          for(
            let j=0;
            j<((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length;
            j++
          ) {
            if(
              parseFloat(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) >= parseFloat(newinputentry[0])
              &&
              parseFloat(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) <= parseFloat(newinputentry[1])
            ) {
              pageindex = i;
              pos = j;
              inpage = true;
              time3[time3Index] = setTimeout(() => {
                if(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[j] as HTMLDivElement) {
                  scrollToElement(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[j] as HTMLDivElement);
                  (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.backgroundColor="red";
                  (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.color="#fff";
                  ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show[j] = true;
                  ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = true;
                  triggerRef(holder);
                }
                clearTimeout(time3[time3Index]);
              }, 100);
              time3Index++;
              time1[time1Index] = setTimeout(() => {
                ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = true;
                triggerRef(holder);
                clearTimeout(time1[time1Index]);
              }, 800);
              time1Index++;
              time2[time2Index] = setTimeout(() => {
                if(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement) {
                  if((((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.backgroundColor !== "#fff") {
                    (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.backgroundColor = "#fff";
                    (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.color = "black";
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = false;
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show[j] = false;
                    triggerRef(holder);
                  }
                }
                clearTimeout(time2[time2Index]);
              }, 810);
              time2Index++;
            }
          }
        }
        time4 = setTimeout(() => {
          for(let i=0; i<((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length; i++) {
            for(let j=0; j<((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length; j++) {          
              if(
                parseFloat(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) >= parseFloat(newinputentry[0])
                &&
                parseFloat(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) <= parseFloat(newinputentry[1])
              ) {
                if(i in Object.keys(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages)) {
                  if(
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j] !== null
                    &&
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j] !== undefined
                  ) {
                    delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j];
                    delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[j];
                    delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j];
                    delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[j];
                    delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show[j];
                    triggerRef(holder);
                    somethingdeleted = true;
                  }
                }
                else {
                  i = -1;
                  j = ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length - 1;
                }
              }
            }
          }
          clearTimeout(time4);
        }, 815);
        time5 = setTimeout(() => {
          for(
            let i=0; 
            i<((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length; 
            i++
          ) {
            for(
              let j=0; 
              j<((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length; 
              j++
            ) {
              ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i] = [
                ...((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].filter((item) => (item !== undefined || item !== null))
              ];
              ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake = [
                ...((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake.filter((item) => (item !== undefined || item !== null))
              ];
              ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref = [
                ...((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref.filter((item) => (item !== undefined || item !== null))
              ];
              ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref = [
                ...((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref.filter((item) => (item !== undefined || item !== null))
              ];
              ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show = [
                ...((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show.filter((item) => (item !== undefined || item !== null))
              ];
              triggerRef(holder);
            }
          }
          clearTimeout(time5);
        }, 820);
        time6 = setTimeout(async () => {
          if(somethingdeleted) {
            let done = await repaginatePage(
              currentandsignal,
              holder,
              "EXCLUDE-EQUAL-TO"
            );
            if(done) {
              let inpagepageindexandpos = await isAlreadyInPageArray(
                currentandsignal,
                newinputentry,
                holder,
                direction,
                inputtype,
                from
              );
              inpage = inpagepageindexandpos.inpage;
              pageindex = inpagepageindexandpos.pageindex;
              pos = inpagepageindexandpos.pos;
            }
          }
          clearTimeout(time6);
        }, 825);
      }
    }
  }
  return {inpage, pageindex, pos};
}

function storeAllIntoAFlatArray(
  holder: ShallowRef<NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType | NumberType['search'] | AtNumber<NumberSearchType>>,
  inputtype: 'EXCLUDE-EQUAL-TO' | 'EXCLUDE-FROM-TO' | 'NOT-EQUAL-TO' | 'EQUAL-TO' | 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO' | 'DISPLAYER-EXCLUDE-FROM-TO',
  from?: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL" | undefined
) {
  let allinflatarray = [];
  for(
    let i=0;
    i<(
      inputtype==='DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'?
      (holder.value as NumberSearchExcludeEqualToType).pages.length
      : (
        inputtype==='DISPLAYER-EXCLUDE-FROM-TO'?
        (holder.value as NumberSearchExcludeFromToType).pages.length
        : (
          inputtype==='EQUAL-TO'?
          ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages.length
          : (
            inputtype==='NOT-EQUAL-TO'?
            ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages.length
            : (
              inputtype=='EXCLUDE-EQUAL-TO'?
              ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length
              :
              ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages.length
            )
          )
        )
      )
    );
    i++
  ) {
    for(
      let j=0;
      j<(
        inputtype==='DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'?
        (holder.value as NumberSearchExcludeEqualToType).pages[i].length
        : (
          inputtype==='DISPLAYER-EXCLUDE-FROM-TO'?
          (holder.value as NumberSearchExcludeFromToType).pages[i].length
          : (
            inputtype==='EQUAL-TO'?
            ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages[i].length
            : (
              inputtype==='NOT-EQUAL-TO'?
              ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages[i].length
              : (
                inputtype=='EXCLUDE-EQUAL-TO'?
                ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length
                :
                ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i].length
              )
            )
          )
        )
      );
      j++
    ) {

      inputtype==='DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'?
      allinflatarray.push((holder.value as NumberSearchExcludeEqualToType).pages[i][j])
      : (
        inputtype==='DISPLAYER-EXCLUDE-FROM-TO'?
        allinflatarray.push((holder.value as NumberSearchExcludeFromToType).pages[i][j])
        : (
          inputtype==='EQUAL-TO'?
          allinflatarray.push(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages[i][j])
          : (
            inputtype==='NOT-EQUAL-TO'?
            allinflatarray.push(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages[i][j])
            : (
              inputtype==='EXCLUDE-EQUAL-TO'?
              allinflatarray.push(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j])
              :
              allinflatarray.push(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j])
            )
          )
        )
      )
    }
  }
  return allinflatarray;
}

export async function repaginatePage(
  currentandsignal:  ShallowRef<CurrentAndSignalType>,
  holder: ShallowRef<NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType | NumberType['search'] | AtNumber<NumberSearchType> | StringSearchType>,
  inputtype: 'WORD' | 'EXCLUDE-EQUAL-TO' | 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO' | 'DISPLAYER-EXCLUDE-FROM-TO'
) {
  let done = false;
  for(
    let i=0;
    i<(
      inputtype==='WORD'?
      (holder.value as StringSearchType).pages.length
      : (
        inputtype==='DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'?
        (holder.value as NumberSearchExcludeEqualToType).pages.length
        : (
          inputtype==='DISPLAYER-EXCLUDE-FROM-TO'?
          (holder.value as NumberSearchExcludeFromToType).pages.length
          : 
          ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length
        )
      )
    );
    i++
  ) {
    let 
      jsize = (
        inputtype==='WORD'?
        (holder.value as StringSearchType).pages[i].length
        : (
          inputtype==='DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'?
          (holder.value as NumberSearchExcludeEqualToType).pages[i].length
          : (
            inputtype==='DISPLAYER-EXCLUDE-FROM-TO'?
            (holder.value as NumberSearchExcludeFromToType).pages[i].length
            : 
            ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length
          )
        )
      ),
      allinflatarray = []
    ;
    switch(inputtype) {
      case "WORD":
        if(jsize === 0) {
          (holder.value as StringSearchType).pages.splice(i, 1);
        }
        (holder.value as StringSearchType).pages = [
          ...(holder.value as StringSearchType).pages.filter((item: string[] | undefined | null) => (item !== undefined || item !== null))
        ];
        done = true;
        break;
      case "DISPLAYER-EXCLUDE-FROM-TO":
        if(jsize === 0) {
          (holder.value as NumberSearchExcludeFromToType).pages.splice(i, 1);
        }
        (holder.value as NumberSearchExcludeFromToType).pages = [
          ...((holder.value as NumberSearchExcludeFromToType).pages as [string, string][][]).filter((item: [string, string][] | undefined | null) => (item !== undefined || item !== null))
        ];
        allinflatarray = storeAllIntoAFlatArray(
          holder as ShallowRef<NumberSearchExcludeFromToType>,
          inputtype
        ) as [string, string][];
        (holder.value as NumberSearchExcludeFromToType).pages = [];
        (holder.value as NumberSearchExcludeFromToType).addeditemsref = [];
        (holder.value as NumberSearchExcludeFromToType).inneraddeditemsref = [];
        (holder.value as NumberSearchExcludeFromToType).endoflistitemref = undefined;
        (holder.value as NumberSearchExcludeFromToType).addloading = false;
        (holder.value as NumberSearchExcludeFromToType).loading = false;
        (holder.value as NumberSearchExcludeFromToType).show = [];
        (holder.value as NumberSearchExcludeFromToType).shake = [];
        (holder.value as NumberSearchExcludeFromToType).bottom = false;
        allinflatarray.forEach(async (item) => {
          await addNewInputEntry(
            item,
            inputtype,
            currentandsignal,
            holder
          );
        });
        allinflatarray = [];
        done = true;
        break;
      case "DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO":
        if(jsize === 0) {
          (holder.value as NumberSearchExcludeEqualToType).pages.splice(i, 1);
        }
        (holder.value as NumberSearchExcludeEqualToType).pages = [
          ...((holder.value as NumberSearchExcludeEqualToType).pages as string[][]).filter((item: string[] | undefined | null) => (item !== undefined || item !== null))
        ];
        allinflatarray = storeAllIntoAFlatArray(
          holder as ShallowRef<NumberSearchExcludeEqualToType>,
          inputtype
        ) as string[];
        (holder.value as NumberSearchExcludeEqualToType).pages = [];
        (holder.value as NumberSearchExcludeEqualToType).addeditemsref = [];
        (holder.value as NumberSearchExcludeEqualToType).inneraddeditemsref = [];
        (holder.value as NumberSearchExcludeEqualToType).endoflistitemref = undefined;
        (holder.value as NumberSearchExcludeEqualToType).addloading = false;
        (holder.value as NumberSearchExcludeEqualToType).loading = false;
        (holder.value as NumberSearchExcludeEqualToType).show = [];
        (holder.value as NumberSearchExcludeEqualToType).shake = [];
        (holder.value as NumberSearchExcludeEqualToType).bottom = false;
        allinflatarray.forEach(async (item) => {
          await addNewInputEntry(
            item,
            inputtype,
            currentandsignal,
            holder
          );
        });
        allinflatarray = [];
        done = true;
        break;
      default:
        if(jsize === 0) {
          ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.splice(i, 1);
        }
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages = [
          ...((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.filter((item: string[] | undefined | null) => (item !== undefined || item !== null))
        ];
        allinflatarray = storeAllIntoAFlatArray(
          holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>,
          'EXCLUDE-EQUAL-TO'
        ) as string[];
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages = [];
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref = [];
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref = [];
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).endoflistitemref = undefined;
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addloading = false;
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).loading = false;
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show = [];
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake = [];
        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).bottom = false;
        allinflatarray.forEach(async (item) => {
          await addNewInputEntry(
            item,
            inputtype,
            currentandsignal,
            holder
          );
        });
        allinflatarray = [];
        done = true;
        break;
    }
    triggerRef(holder);
  }
  return done;
}

export async function addNewInputEntry(
  newinputentry: string | [string, string],
  inputtype: 'WORD' | 'EXCLUDE-EQUAL-TO' | 'EXCLUDE-FROM-TO' | 'NOT-EQUAL-TO' | 'EQUAL-TO' | 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO' | 'DISPLAYER-EXCLUDE-FROM-TO',
  currentandsignal: ShallowRef<CurrentAndSignalType>,
  holder: ShallowRef<NumberSearchExcludeFromToType | NumberSearchExcludeEqualToType | NumberType['search'] | AtNumber<NumberSearchType> | StringSearchType>,
  from?: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL" | undefined
) {
  nextTick(async () => {
    if(inputtype==='DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO' || inputtype==='DISPLAYER-EXCLUDE-FROM-TO' || inputtype==='EQUAL-TO' || inputtype==='EXCLUDE-EQUAL-TO' || inputtype==='NOT-EQUAL-TO' || inputtype==='WORD') {
      switch(inputtype) {
        case 'WORD':
          let maxwordlength = 40;
          if(typeof newinputentry === 'string') {
            if(newinputentry.trim().length > 0 && newinputentry.length <= maxwordlength) {
              let inpagepageindexandpos = await isAlreadyInPageArray(currentandsignal, newinputentry, holder, 'DIRECT', inputtype, from);
              if(!inpagepageindexandpos.inpage) {
                (holder.value as StringSearchType).addloading = true;
                triggerRef(holder);
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  scrollToElement((holder.value as StringSearchType).endoflistitemref as HTMLLIElement);
                  clearTimeout(time1);
                }, 110);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  (holder.value as StringSearchType).addloading = false;
                  triggerRef(holder);
                  let sum = 0;
                  if((holder.value as StringSearchType).pages.length > 0) {
                    for(let i=0; i<(holder.value as StringSearchType).pages[(holder.value as StringSearchType).pages.length - 1].length; i++) {
                      sum+=(holder.value as StringSearchType).pages[(holder.value as StringSearchType).pages.length - 1][i].length;
                    }
                    if((sum+newinputentry.length) <= limit) {
                      (holder.value as StringSearchType).pages[(holder.value as StringSearchType).pages.length - 1].push(newinputentry);
                    }
                    else {
                      (holder.value as StringSearchType).pages = [
                        ...(holder.value as StringSearchType).pages,
                        [newinputentry]
                      ];
                    }
                  }
                  else {
                    (holder.value as StringSearchType).pages = [
                      [newinputentry]
                    ];
                  }
                  triggerRef(holder);
                  (currentandsignal.value.word as CurrentAndSignalInnerType).current = (holder.value as StringSearchType).pages.length - 1;
                  (currentandsignal.value.word as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  clearTimeout(time2);
                }, 100);
              }
              else {
                //scroll to element and show effect that word is in page
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  (currentandsignal.value.word as CurrentAndSignalInnerType).current = inpagepageindexandpos.pageindex;
                  (currentandsignal.value.word as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  if(((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement)) {
                    scrollToElement((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement);
                    ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "red";
                    ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "#fff";
                    triggerRef(holder);
                  }
                  clearTimeout(time1);
                }, 400);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  if(((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement)) {
                    if(((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                      ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                      ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "black";
                      triggerRef(holder);
                    }
                  }
                  clearTimeout(time2);
                }, 800);
              }
              (holder.value as StringSearchType).single = '';
              triggerRef(holder);
            }
          }
          break;
        case 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO':
          if(typeof newinputentry === 'string') {
            if(newinputentry.trim().length > 0) {
              (holder.value as NumberSearchExcludeEqualToType).addloading = true;
              triggerRef(holder);
              let time1: NodeJS.Timeout;
              time1 = setTimeout(() => {
                scrollToElement((holder.value as NumberSearchExcludeEqualToType).endoflistitemref as HTMLLIElement);
                clearTimeout(time1);
              }, 110);
              let time2: NodeJS.Timeout;
              time2 = setTimeout(() => {
                (holder.value as NumberSearchExcludeEqualToType).addloading = false;
                triggerRef(holder);
                if((holder.value as NumberSearchExcludeEqualToType).pages.length > 0) {
                  if((holder.value as NumberSearchExcludeEqualToType).pages[(holder.value as NumberSearchExcludeEqualToType).pages.length - 1].length < limit) {
                    (holder.value as NumberSearchExcludeEqualToType).pages[(holder.value as NumberSearchExcludeEqualToType).pages.length - 1].push(newinputentry); 
                  }
                  else {
                    (holder.value as NumberSearchExcludeEqualToType).pages = [
                      ...(holder.value as NumberSearchExcludeEqualToType).pages,
                      [newinputentry]
                    ];
                  }
                }
                else {
                  (holder.value as NumberSearchExcludeEqualToType).pages = [
                    [newinputentry]
                  ];
                }
                (holder.value as NumberSearchExcludeEqualToType).show.push(true);
                (holder.value as NumberSearchExcludeEqualToType).shake.push(false);
                triggerRef(holder);
                clearTimeout(time2);
              }, 100);
            }
          }
          break;
        case 'DISPLAYER-EXCLUDE-FROM-TO':
          if(typeof newinputentry !== 'string') {
            (holder.value as NumberSearchExcludeFromToType).addloading = true;
            triggerRef(holder);
            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              scrollToElement((holder.value as NumberSearchExcludeFromToType).endoflistitemref as HTMLLIElement);
              clearTimeout(time1);
            }, 110);
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              (holder.value as NumberSearchExcludeFromToType).addloading = false;
              triggerRef(holder);
              if((holder.value as NumberSearchExcludeFromToType).pages.length > 0) {
                if((holder.value as NumberSearchExcludeFromToType).pages[(holder.value as NumberSearchExcludeFromToType).pages.length - 1].length < limit) {
                  (holder.value as NumberSearchExcludeFromToType).pages[(holder.value as NumberSearchExcludeFromToType).pages.length - 1].push(newinputentry); 
                }
                else {
                  (holder.value as NumberSearchExcludeFromToType).pages = [
                    ...(holder.value as NumberSearchExcludeFromToType).pages,
                    [newinputentry]
                  ];
                }
              }
              else {
                (holder.value as NumberSearchExcludeFromToType).pages = [
                  [newinputentry]
                ];
              }
              (holder.value as NumberSearchExcludeFromToType).show.push(true);
              (holder.value as NumberSearchExcludeFromToType).shake.push(false);
              triggerRef(holder);
              clearTimeout(time2);
            }, 100);
          }
          break;
        case 'EQUAL-TO':
          if(typeof newinputentry === 'string') {
            if(newinputentry.trim().length > 0) {
              let inpagepageindexandpos = await isAlreadyInPageArray(currentandsignal, newinputentry, holder, 'DIRECT', inputtype, from);
              if(!inpagepageindexandpos.inpage) {
                ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.addloading = true;
                triggerRef(holder);
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  scrollToElement(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.endoflistitemref as HTMLLIElement);
                  clearTimeout(time1);
                }, 110);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.addloading = false;
                  triggerRef(holder);
                  if(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages.length > 0) {
                    if(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages[((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages.length - 1].length < limit) {
                      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages[((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages.length - 1].push(newinputentry); 
                    }
                    else {
                      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages = [
                        ...((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages,
                        [newinputentry]
                      ];
                    }
                  }
                  else {
                    ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages = [
                      [newinputentry]
                    ];
                  }
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.show.push(true);
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.shake.push(false);
                  triggerRef(holder);
                  (currentandsignal.value.equalto as CurrentAndSignalInnerType).current = ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages.length - 1;
                  (currentandsignal.value.equalto as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  clearTimeout(time2);
                }, 100);
              }
              else {
                //scroll to element and show effect that word is in page
                let time3: NodeJS.Timeout;
                time3 = setTimeout(() => {
                  (currentandsignal.value.equalto as CurrentAndSignalInnerType).current = inpagepageindexandpos.pageindex;
                  (currentandsignal.value.equalto as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  if(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement) {
                    scrollToElement(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement);
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "red";
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "#fff";
                    ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.show[inpagepageindexandpos.pos] = true;
                    ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.shake[inpagepageindexandpos.pos] = true;
                    triggerRef(holder);
                  }
                  clearTimeout(time3);
                }, 400);
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.shake[inpagepageindexandpos.pos] = true;
                  triggerRef(holder);
                  clearTimeout(time1);
                }, 800);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement)) {
                    if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "black";
                      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.shake[inpagepageindexandpos.pos] = false;
                      triggerRef(holder);
                    }
                  }
                  clearTimeout(time2);
                }, 910);
                let time4: NodeJS.Timeout;
                time4 = setTimeout(() => {
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.shake[inpagepageindexandpos.pos] = false;
                  triggerRef(holder);
                  clearTimeout(time4);
                }, 915);
              }
              ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.single = '';
              triggerRef(holder);
            }
          }
          break;
        case 'NOT-EQUAL-TO':
          if(typeof newinputentry === 'string') {
            if(newinputentry.trim().length > 0) {
              let inpagepageindexandpos = await isAlreadyInPageArray(currentandsignal, newinputentry, holder, 'DIRECT', inputtype, from);
              if(!inpagepageindexandpos.inpage) {
                ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.addloading = true;
                triggerRef(holder);
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  scrollToElement(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.endoflistitemref as HTMLLIElement);
                  clearTimeout(time1);
                }, 110);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.addloading = false;
                  if(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages.length > 0) {
                    if(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages[((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages.length - 1].length < limit) {
                      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages[((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages.length - 1].push(newinputentry);
                    }
                    else {
                      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages = [
                        ...((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages,
                        [newinputentry]
                      ];
                    }
                  }
                  else {
                    ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages = [
                      [newinputentry]
                    ];
                  }
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.show.push(true);
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.shake.push(false);
                  triggerRef(holder);
                  (currentandsignal.value.notequalto as CurrentAndSignalInnerType).current = ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages.length - 1;
                  (currentandsignal.value.notequalto as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  clearTimeout(time2);
                }, 100);
              }
              else {
                //scroll to element and show effect that word is in page
                let time3: NodeJS.Timeout;
                time3 = setTimeout(() => {
                  (currentandsignal.value.notequalto as CurrentAndSignalInnerType).current = inpagepageindexandpos.pageindex;
                  (currentandsignal.value.notequalto as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  if(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement) {
                    scrollToElement(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement);
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "red";
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "#fff";
                    ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.show[inpagepageindexandpos.pos] = true;
                    ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.shake[inpagepageindexandpos.pos] = true;
                    triggerRef(holder);
                  }
                  clearTimeout(time3);
                }, 400);
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.shake[inpagepageindexandpos.pos] = true;
                  triggerRef(holder);
                  clearTimeout(time1);
                }, 800);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement)) {
                    if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "black";
                      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.shake[inpagepageindexandpos.pos] = false;
                      triggerRef(holder);
                    }
                  }
                  clearTimeout(time2);
                }, 910);
                let time4: NodeJS.Timeout;
                time4 = setTimeout(() => {
                  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.shake[inpagepageindexandpos.pos] = false;
                  triggerRef(holder);
                  clearTimeout(time4);
                }, 915);
              }
              ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.single = '';
              triggerRef(holder);
            }
          }
          break;
        default: //EXCLUDE-EQUAL-TO
          if(typeof newinputentry === 'string') {
            if(newinputentry.trim().length > 0) {
              let inpagepageindexandpos1 = await isAlreadyInPageArray(currentandsignal, newinputentry, holder, 'INDIRECT-CHECK-WHETHER-NEWINPUTENTRY-WITHIN-RANGE-OF-EXCLUDE-FROMTO', undefined, from);
              if(!inpagepageindexandpos1.inpage) {
                let inpagepageindexandpos2 = await isAlreadyInPageArray(currentandsignal, newinputentry, holder, 'DIRECT', inputtype);
                if(!inpagepageindexandpos2.inpage) {
                  ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addloading = true;
                  triggerRef(holder);
                  let time1: NodeJS.Timeout;
                  time1 = setTimeout(() => {
                    scrollToElement(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).endoflistitemref as HTMLLIElement);
                    clearTimeout(time1);
                  }, 110);
                  let time2: NodeJS.Timeout;
                  time2 = setTimeout(() => {
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addloading = false;
                    triggerRef(holder);
                    if(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length > 0) {
                      if(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length - 1].length < limit) {
                        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length - 1].push(newinputentry); 
                      }
                      else {
                        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages = [
                          ...((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages,
                          [newinputentry]
                        ];
                      }
                    }
                    else {
                      ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages = [
                        [newinputentry]
                      ];
                    }
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show.push(true);
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake.push(false);
                    triggerRef(holder);
                    (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).current = ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length - 1;
                    (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).signal++;
                    triggerRef(currentandsignal);
                    clearTimeout(time2);
                  }, 100);
                }
                else {
                  //scroll to element and show effect that word is in page
                  let time3: NodeJS.Timeout;
                  time3 = setTimeout(() => {
                    (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).current = inpagepageindexandpos2.pageindex;
                    (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).signal++;
                    triggerRef(currentandsignal);
                    if(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement) {
                      scrollToElement(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement);
                      (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "red";
                      (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "#fff";
                      ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show[inpagepageindexandpos2.pos] = true;
                      ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = true;
                      triggerRef(holder);
                    }
                    clearTimeout(time3);
                  }, 400);
                  let time1: NodeJS.Timeout;
                  time1 = setTimeout(() => {
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = true;
                    triggerRef(holder);
                    clearTimeout(time1);
                  }, 800);
                  let time2: NodeJS.Timeout;
                  time2 = setTimeout(() => {
                    if((((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement)) {
                      if((((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                        (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                        (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "black";
                        ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = false;
                        triggerRef(holder);
                      }
                    }
                    clearTimeout(time2);
                  }, 910);
                  let time4: NodeJS.Timeout;
                  time4 = setTimeout(() => {
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = false;
                    triggerRef(holder);
                    clearTimeout(time4);
                  }, 915);
                }
              }
              ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).single = '';
              triggerRef(holder);
            }
          }
          break;
      }
    }
    else {
      if(typeof newinputentry !== 'string') {
        let inpagepageindexandpos1 = await isAlreadyInPageArray(currentandsignal, newinputentry, holder, 'INDIRECT-CHECK-WHETHER-RANGE-NEWINPUTENTRY-COVERS-EXCLUDE-EQUALTO', undefined, from);
        let inpagepageindexandpos2 = await isAlreadyInPageArray(currentandsignal, newinputentry, holder, 'DIRECT', inputtype, from);
        if(!inpagepageindexandpos2.inpage) {
          ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addloading = true;
          triggerRef(holder);
          let time1: NodeJS.Timeout;
          time1 = setTimeout(() => {
            scrollToElement(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).endoflistitemref as HTMLLIElement);
            clearTimeout(time1);
          }, 110);
          let time2: NodeJS.Timeout;
          time2 = setTimeout(() => {
            ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addloading = false;
            triggerRef(holder);
            if(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages.length > 0) {
              if(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages.length - 1].length < limit) {
                ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages[((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages.length - 1].push(newinputentry); 
              }
              else {
                ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages = [
                  ...((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages,
                  [newinputentry]
                ];
              }
            }
            else {
              ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages = [
                [newinputentry]
              ];
            }
            ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).show.push(true);
            ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake.push(false);
            triggerRef(holder);
            (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).current = ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).pages.length - 1;
            (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).signal++;
            triggerRef(currentandsignal);
            clearTimeout(time2);
          }, 100);
          ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).singlefrom = '';
          ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).singleto = '';
          triggerRef(holder);
        }
        else {
          //scroll to element and show effect that word is in page
          let time3: NodeJS.Timeout;
          time3 = setTimeout(() => {
            (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).current = inpagepageindexandpos2.pageindex;
            (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).signal++;
            triggerRef(currentandsignal);
            if(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement) {
              scrollToElement(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement);
              (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "red";
              (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "#fff";
              ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).show[inpagepageindexandpos2.pos] = true;
              ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = true;
              triggerRef(holder);
            }
            clearTimeout(time3);
          }, 400);
          let time1: NodeJS.Timeout;
          time1 = setTimeout(() => {
            ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = true;
            triggerRef(holder);
            clearTimeout(time1);
          }, 800);
          let time2: NodeJS.Timeout;
          time2 = setTimeout(() => {
            if((((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement)) {
              if((((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "black";
                ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = false;
                triggerRef(holder);
              }
            }
            clearTimeout(time2);
          }, 910);
          let time4: NodeJS.Timeout;
          time4 = setTimeout(() => {
            ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = false;
            triggerRef(holder);
            clearTimeout(time4);
          }, 915);
        }
      }
    }
  });
}

export function setTabAndResetOthers(
  tab: "GREATER-THAN" | "LESS-THAN" | "EQUAL-TO" | "NOT-EQUAL-TO" | "FROM-TO",
  holder: ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>,
  from?: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL" | undefined
) {
  if (tab === "GREATER-THAN") {
    if(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).greaterthan.trim().length > 0) {
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).lessthan = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.from = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.to = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.single = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.single = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages = [];
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages = [];
    }
  } else if (tab === "LESS-THAN") {
    if(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).lessthan.trim().length > 0) {
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).greaterthan = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.from = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.to = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.single = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.single = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages = [];
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages = [];
    }
  } else if (tab === "EQUAL-TO") {
    if(
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.single.trim().length > 0
      ||
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages.length > 0
    ) {
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).greaterthan = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).lessthan = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.from = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.to = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.single = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages = [];
    }
  } else if (tab === "NOT-EQUAL-TO") {
    if(
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.single.trim().length > 0
      ||
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages.length > 0
    ) {
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).greaterthan = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).lessthan = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.from = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.to = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.single = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages = [];
    }
  } else {
    if(
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.from.trim().length > 0
      ||
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.to.trim().length > 0
    ) {
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).greaterthan = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).lessthan = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.single = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.single = "";
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages = [];
      ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages = [];
    }
  }
  
  ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)?  (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).tab = tab;
  triggerRef(holder);
}