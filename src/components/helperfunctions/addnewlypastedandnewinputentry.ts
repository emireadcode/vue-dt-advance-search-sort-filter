import type { 
  CurrentAndSignalInnerType,
  CurrentAndSignalType,
  AtNumber,
  NumberSearchType,
  StringSearchType,
  NumberType,
  NumberSearchExcludeEqualToType,
  NumberSearchExcludeFromToType,
  EnteredWhenInAndWhenNotInPageType,
} from "../types/SupportedDatatypesTypeDeclaration";
import { shallowRef, nextTick, type ShallowRef, triggerRef, } from "vue";

const numberlimit = 10, wordlimit = 100;

function scrollToElement(el: HTMLDivElement | HTMLLIElement) {
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export async function repaginateExcludeEqualtoPage(
  currentandsignal:  ShallowRef<CurrentAndSignalType>,
  holder: ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
  from?: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL" | undefined
) {
  let
  allinflatarray = [],
    done = false,
    enteredwheninandwhennot = shallowRef<EnteredWhenInAndWhenNotInPageType>({
      enteredwheninpage: false,
      enteredwhennotinpage: false
    })
  ;
  for(
    let i=0;
    i<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length;
    i++
  ) {
    let 
      jsize = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length
    ;
    if(jsize === 0) {
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.splice(i, 1);
    }
    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages = [
      ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.filter((item: string[] | undefined | null) => (item !== undefined && item !== null))
    ];
    triggerRef(holder);
  }
  allinflatarray = storeAllInExcludeEqualToPagesIntoAFlatArray(
    holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
    from
  ) as string[];
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages = [];
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref = [];
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref = [];
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).endoflistitemref = undefined;
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addloading = false;
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).loading = false;
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).show = [];
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake = [];
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).bottom = false;
  triggerRef(holder);
  allinflatarray.forEach(async (item) => {
    await addNewInputEntry(
      item,
      'EXCLUDE-EQUAL-TO',
      currentandsignal,
      holder,
      enteredwheninandwhennot,
      from
    );
  });
  allinflatarray = [];
  done = true;
  return done;
}

async function isAlreadyInPageArray(
  currentandsignal: ShallowRef<CurrentAndSignalType>,
  newinputentry: string | [string, string],
  holder: ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType> | StringSearchType>,
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
          (
            (
              (from === "NUMBER-SEARCHER-MODAL" || from === undefined)? 
              holder.value as NumberType['search']['multiple'] : 
              (holder.value as AtNumber<NumberSearchType>).search
            )?.equalto as NumberSearchExcludeEqualToType
          ).pages.length
          : (
            inputtype==='NOT-EQUAL-TO'?
            (
              (
                (from === "NUMBER-SEARCHER-MODAL" || from === undefined)? 
                holder.value as NumberType['search']['multiple'] : 
                (holder.value as AtNumber<NumberSearchType>).search
              )?.notequalto as NumberSearchExcludeEqualToType
            ).pages.length
            : (
              inputtype=='EXCLUDE-EQUAL-TO'?
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length
              :
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length
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
            (
              (
                (from === "NUMBER-SEARCHER-MODAL" || from === undefined)? 
                holder.value as NumberType['search']['multiple'] : 
                (holder.value as AtNumber<NumberSearchType>).search
              )?.equalto as NumberSearchExcludeEqualToType
            ).pages[i].length
            : (
              inputtype==='NOT-EQUAL-TO'?
              (
                (
                  (from === "NUMBER-SEARCHER-MODAL" || from === undefined)? 
                  holder.value as NumberType['search']['multiple'] : 
                  (holder.value as AtNumber<NumberSearchType>).search
                )?.notequalto as NumberSearchExcludeEqualToType
              ).pages[i].length
              : (
                inputtype=='EXCLUDE-EQUAL-TO'?
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length
                :
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i].length
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
              (
                (
                  (from === "NUMBER-SEARCHER-MODAL" || from === undefined)? 
                  holder.value as NumberType['search']['multiple'] : 
                  (holder.value as AtNumber<NumberSearchType>).search
                )?.equalto as NumberSearchExcludeEqualToType
              ).pages[i][j]
              : (
                inputtype==='NOT-EQUAL-TO'?
                (
                  (
                    (from === "NUMBER-SEARCHER-MODAL" || from === undefined)? 
                    holder.value as NumberType['search']['multiple'] : 
                    (holder.value as AtNumber<NumberSearchType>).search
                  )?.notequalto as NumberSearchExcludeEqualToType
                ).pages[i][j]
                : 
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]
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
                parseFloat(newinputentry[0]) >= parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][0])
                &&
                (
                  parseFloat(newinputentry[0]) < parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][1])
                  &&
                  parseFloat(newinputentry[1]) >= parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][1])
                )
              )
              ||
              (
                parseFloat(newinputentry[0]) >= parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][0])
                &&
                parseFloat(newinputentry[1]) <= parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][1])
              )
              ||
              (
                parseFloat(newinputentry[0]) <= parseFloat(
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][0]
                )
                &&
                (
                  parseFloat(newinputentry[1]) >= parseFloat(
                    (
                      (
                        holder.value as NumberType['search']['multiple']
                      )?.exclude?.fromto as NumberSearchExcludeFromToType
                    ).pages[i][j][1]
                  )
                  ||
                  (
                    parseFloat(newinputentry[1]) <= parseFloat(
                      (
                        (
                          holder.value as NumberType['search']['multiple']
                        )?.exclude?.fromto as NumberSearchExcludeFromToType
                      ).pages[i][j][1]
                    )
                    &&
                    parseFloat(newinputentry[1]) >= parseFloat(
                      (
                        (
                          holder.value as NumberType['search']['multiple']
                        )?.exclude?.fromto as NumberSearchExcludeFromToType
                      ).pages[i][j][0]
                    )
                  )
                )
              )
            )
            ||
            parseFloat(newinputentry[1]) === parseFloat(
              (
                ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType
              ).pages[i][j][0]
            )
            ||
            parseFloat(newinputentry[0]) === parseFloat(
              (
                ((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType
              ).pages[i][j][1]
            )
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
        i<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length;
        i++
      ) {
        for(
          let j=0;
          j<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i].length;
          j++
        ) {
          if(
            parseFloat(newinputentry) >= parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][0])
            &&
            parseFloat(newinputentry) <= parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[i][j][1])
          ) {
            pageindex = i;
            pos = j;
            inpage = true;
            let time3: NodeJS.Timeout;
            time3 = setTimeout(() => {
              (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).current = i;
              (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).signal++;
              triggerRef(currentandsignal);
              if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[pos] as HTMLDivElement) {
                scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[pos] as HTMLDivElement);
                ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.backgroundColor = "red";
                ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.color = "#fff";
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).show[pos] = true;
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).shake[pos] = true;
                triggerRef(holder);
              }
              clearTimeout(time3);
            }, 100);
           
            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).shake[pos] = true;
              triggerRef(holder);
              clearTimeout(time1);
            }, 800);
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement) {
                if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos].style.backgroundColor !== '#fff') {
                  ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.backgroundColor = "#fff";
                  ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.color = "black";
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).shake[pos] = false;
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
      let inpagepageindexandpos = await isAlreadyInPageArray(
        currentandsignal, 
        newinputentry, 
        holder, 
        'DIRECT', 
        'EXCLUDE-FROM-TO', 
        from
      );
      if(!inpagepageindexandpos.inpage) {
        let
          time1: NodeJS.Timeout[] = [], 
          time2: NodeJS.Timeout[] = [], 
          time3: NodeJS.Timeout[] = [], 
          time7: NodeJS.Timeout[] = [],  
          time4: NodeJS.Timeout, 
          time5: NodeJS.Timeout,
          time6: NodeJS.Timeout,
          time1Index = 0, 
          time2Index = 0,
          time3Index = 0,
          time7Index = 0,
          somethingdeleted = false
        ;
        for(
          let i=0;
          i<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length;
          i++
        ) {
          for(
            let j=0;
            j<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length;
            j++
          ) {
            if(
              parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) >= parseFloat(newinputentry[0])
              &&
              parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) <= parseFloat(newinputentry[1])
            ) {
              pageindex = i;
              pos = j;
              inpage = true;
              time3[time3Index] = setTimeout(() => {
                (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).current = i;
                (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).signal++;
                triggerRef(currentandsignal);
                if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[j] as HTMLDivElement) {
                  scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[j] as HTMLDivElement);
                  ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.backgroundColor="red";
                  ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.color="#fff";
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).show[j] = true;
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = true;
                  triggerRef(holder);
                }
                clearTimeout(time3[time3Index]);
              }, 400);
              time3Index++;
              time1[time1Index] = setTimeout(() => {
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = true;
                triggerRef(holder);
                clearTimeout(time1[time1Index]);
              }, 900);
              time1Index++;
              time2[time2Index] = setTimeout(() => {
                if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement) {
                  if(((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.backgroundColor !== "#fff") {
                    ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.backgroundColor = "#fff";
                    ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.color = "black";
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = false;
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).show[j] = false;
                    triggerRef(holder);
                  }
                }
                clearTimeout(time2[time2Index]);
              }, 910);
              time2Index++;
              time7[time7Index] = setTimeout(() => {
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = false;
                triggerRef(holder);
                clearTimeout(time7[time7Index]);
              }, 915);
              time7Index++;
            }
          }
        }
        time4 = setTimeout(() => {
          for(let i=0; i<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length; i++) {
            for(let j=0; j<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length; j++) {          
              if(
                parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) >= parseFloat(newinputentry[0])
                &&
                parseFloat((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) <= parseFloat(newinputentry[1])
              ) {
                if(i in Object.keys((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages)) {
                  if(
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j] !== null
                    &&
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j] !== undefined
                  ) {
                    delete (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j];
                    delete (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake[j];
                    delete (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j];
                    delete (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[j];
                    delete (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).show[j];
                    triggerRef(holder);
                    somethingdeleted = true;
                  }
                }
                else {
                  i = -1;
                  j = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length - 1;
                }
              }
            }
          }
          clearTimeout(time4);
        }, 920);
        time5 = setTimeout(() => {
          for(
            let i=0; 
            i<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length; 
            i++
          ) {
            for(
              let j=0; 
              j<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length; 
              j++
            ) {
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i] = [
                ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].filter((item) => (item !== undefined && item !== null))
              ];
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake = [
                ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake.filter((item) => (item !== undefined && item !== null))
              ];
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref = [
                ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref.filter((item) => (item !== undefined && item !== null))
              ];
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref = [
                ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref.filter((item) => (item !== undefined && item !== null))
              ];
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).show = [
                ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).show.filter((item) => (item !== undefined && item !== null))
              ];
              triggerRef(holder);
            }
          }
          clearTimeout(time5);
        }, 925);
        time6 = setTimeout(async () => {
          if(somethingdeleted) {
            if(await repaginateExcludeEqualtoPage(
              currentandsignal,
              holder as ShallowRef<NumberType['search']['multiple']>,
              from
            )) {
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
        }, 930);
      }
    }
  }
  return {inpage, pageindex, pos};
}

function storeAllInExcludeEqualToPagesIntoAFlatArray(
  holder: ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
  from?: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL" | undefined
) {
  let allinflatarray = [];
  for(
    let i=0;
    i<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length;
    i++
  ) {
    for(
      let j=0;
      j<(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length;
      j++
    ) {
      allinflatarray.push((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]);
    }
  }
  
  return allinflatarray;
}

export async function addNewInputEntry(
  newinputentry: string | [string, string],
  inputtype: 'WORD' | 'EXCLUDE-EQUAL-TO' | 'EXCLUDE-FROM-TO' | 'NOT-EQUAL-TO' | 'EQUAL-TO',
  currentandsignal: ShallowRef<CurrentAndSignalType>,
  holder: ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType> | StringSearchType>,
  enteredwheninandwhennot: ShallowRef<EnteredWhenInAndWhenNotInPageType>,
  from?: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL" | undefined
) {
  nextTick(async () => {
    if(inputtype==='EQUAL-TO' || inputtype==='EXCLUDE-EQUAL-TO' || inputtype==='NOT-EQUAL-TO' || inputtype==='WORD') {
      switch(inputtype) {
        case 'WORD':
          let maxwordlength = 40;
          if(typeof newinputentry === 'string') {
            if(newinputentry.trim().length > 0 && newinputentry.length <= maxwordlength) {
              let inpagepageindexandpos = await isAlreadyInPageArray(
                currentandsignal, 
                newinputentry, 
                holder, 
                'DIRECT', 
                inputtype, 
                from
              );
              if(!inpagepageindexandpos.inpage) {
                enteredwheninandwhennot.value.enteredwhennotinpage = true;
                triggerRef(enteredwheninandwhennot);
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
                    if((sum+newinputentry.length) < wordlimit) {
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
                  clearTimeout(time2);
                }, 100);
                let time3: NodeJS.Timeout;
                time3 = setTimeout(() => {
                  (currentandsignal.value.word as CurrentAndSignalInnerType).current = (holder.value as StringSearchType).pages.length - 1;
                  (currentandsignal.value.word as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  clearTimeout(time3);
                }, 120);
              }
              else {
                enteredwheninandwhennot.value.enteredwheninpage = true;
                triggerRef(enteredwheninandwhennot);
                //scroll to element and show effect that word is in page
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  (currentandsignal.value.word as CurrentAndSignalInnerType).current = inpagepageindexandpos.pageindex;
                  (currentandsignal.value.word as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  clearTimeout(time1);
                }, 400);
                let time7: NodeJS.Timeout;
                time7 = setTimeout(() => {
                  if(((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement)) {
                    scrollToElement((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement);
                    ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "red";
                    ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "#fff";
                    triggerRef(holder);
                  }
                  clearTimeout(time7);
                }, 500);
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
        case 'EQUAL-TO':
          if(typeof newinputentry === 'string') {
            if(newinputentry.trim().length > 0) {
              let inpagepageindexandpos = await isAlreadyInPageArray(
                currentandsignal, 
                newinputentry, 
                holder, 
                'DIRECT',
                inputtype, 
                from
              );
              if(!inpagepageindexandpos.inpage) {
                enteredwheninandwhennot.value.enteredwhennotinpage = true;
                triggerRef(enteredwheninandwhennot);
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).addloading = true;
                triggerRef(holder);
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).endoflistitemref as HTMLLIElement);
                  clearTimeout(time1);
                }, 110);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(async () => {
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).addloading = false;
                  triggerRef(holder);
                  if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages.length > 0) {
                    if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages[(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages.length - 1].length < numberlimit) {
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages[(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages.length - 1].push(newinputentry); 
                    }
                    else {
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages = [
                        ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages,
                        [newinputentry]
                      ];
                    }
                  }
                  else {
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages = [
                      [newinputentry]
                    ];
                  }
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).show.push(true);
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).shake.push(false);
                  triggerRef(holder);
                  clearTimeout(time2);
                }, 100);
                let time3: NodeJS.Timeout;
                time3 = setTimeout(() => {
                  (currentandsignal.value.equalto as CurrentAndSignalInnerType).current = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages.length - 1;
                  (currentandsignal.value.equalto as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  clearTimeout(time3);
                }, 120);
              }
              else {
                enteredwheninandwhennot.value.enteredwheninpage = true;
                triggerRef(enteredwheninandwhennot);
                //scroll to element and show effect that word is in page
                let time3: NodeJS.Timeout;
                time3 = setTimeout(() => {
                  (currentandsignal.value.equalto as CurrentAndSignalInnerType).current = inpagepageindexandpos.pageindex;
                  (currentandsignal.value.equalto as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  clearTimeout(time3);
                }, 400);
                let time7: NodeJS.Timeout;
                time7 = setTimeout(() => {
                  if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement) {
                    scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement);
                    ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "red";
                    ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "#fff";
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).show[inpagepageindexandpos.pos] = true;
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos.pos] = true;
                    triggerRef(holder);
                  }
                  clearTimeout(time7);
                }, 500);
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos.pos] = true;
                  triggerRef(holder);
                  clearTimeout(time1);
                }, 800);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  if(((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement)) {
                    if(((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                      ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                      ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "black";
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos.pos] = false;
                      triggerRef(holder);
                    }
                  }
                  clearTimeout(time2);
                }, 910);
                let time4: NodeJS.Timeout;
                time4 = setTimeout(() => {
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos.pos] = false;
                  triggerRef(holder);
                  clearTimeout(time4);
                }, 915);
              }
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).single = '';
              triggerRef(holder);
            }
          }
          break;
        case 'NOT-EQUAL-TO':
          if(typeof newinputentry === 'string') {
            if(newinputentry.trim().length > 0) {
              let 
                inpagepageindexandpos = await isAlreadyInPageArray(
                  currentandsignal, 
                  newinputentry, 
                  holder, 
                  'DIRECT', 
                  inputtype, 
                  from
                )
              ;
              if(!inpagepageindexandpos.inpage) {
                enteredwheninandwhennot.value.enteredwhennotinpage = true;
                triggerRef(enteredwheninandwhennot);
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).addloading = true;
                triggerRef(holder);
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).endoflistitemref as HTMLLIElement);
                  clearTimeout(time1);
                }, 110);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(async () => {
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).addloading = false;
                  triggerRef(holder);
                  if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages.length > 0) {
                    if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages[(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages.length - 1].length < numberlimit) {
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages[(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages.length - 1].push(newinputentry);
                    }
                    else {
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages = [
                        ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages,
                        [newinputentry]
                      ];
                    }
                  }
                  else {
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages = [
                      [newinputentry]
                    ];
                  }
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).show.push(true);
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).shake.push(false);
                  triggerRef(holder);
                  clearTimeout(time2);
                }, 100);
                let time3: NodeJS.Timeout;
                time3 = setTimeout(() => {
                  (currentandsignal.value.notequalto as CurrentAndSignalInnerType).current = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages.length - 1;
                  (currentandsignal.value.notequalto as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  clearTimeout(time3);
                }, 120);
              }
              else {
                enteredwheninandwhennot.value.enteredwheninpage = true;
                triggerRef(enteredwheninandwhennot);
                //scroll to element and show effect that word is in page
                let time3: NodeJS.Timeout;
                time3 = setTimeout(() => {
                  (currentandsignal.value.notequalto as CurrentAndSignalInnerType).current = inpagepageindexandpos.pageindex;
                  (currentandsignal.value.notequalto as CurrentAndSignalInnerType).signal++;
                  triggerRef(currentandsignal);
                  clearTimeout(time3);
                }, 400);
                let time7: NodeJS.Timeout;
                time7 = setTimeout(() => {
                  if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement) {
                    scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement);
                    ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "red";
                    ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "#fff";
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).show[inpagepageindexandpos.pos] = true;
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos.pos] = true;
                    triggerRef(holder);
                  }
                  clearTimeout(time7);
                }, 500);
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos.pos] = true;
                  triggerRef(holder);
                  clearTimeout(time1);
                }, 800);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  if(((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement)) {
                    if(((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                      ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                      ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "black";
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos.pos] = false;
                      triggerRef(holder);
                    }
                  }
                  clearTimeout(time2);
                }, 910);
                let time4: NodeJS.Timeout;
                time4 = setTimeout(() => {
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos.pos] = false;
                  triggerRef(holder);
                  clearTimeout(time4);
                }, 915);
              }
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).single = '';
              triggerRef(holder);
            }
          }
          break;
        default: //EXCLUDE-EQUAL-TO
          if(typeof newinputentry === 'string') {
            if(newinputentry.trim().length > 0) {
              let inpagepageindexandpos1 = await isAlreadyInPageArray(
                currentandsignal, 
                newinputentry, 
                holder, 
                'INDIRECT-CHECK-WHETHER-NEWINPUTENTRY-WITHIN-RANGE-OF-EXCLUDE-FROMTO', 
                undefined, 
                from
              );
              if(!inpagepageindexandpos1.inpage) {
                let
                  inpagepageindexandpos2 = await isAlreadyInPageArray(
                    currentandsignal, 
                    newinputentry, 
                    holder, 
                    'DIRECT', 
                    inputtype,
                    from
                  )
                ;
                if(!inpagepageindexandpos2.inpage) {
                  enteredwheninandwhennot.value.enteredwhennotinpage = true;
                  triggerRef(enteredwheninandwhennot);
                  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addloading = true;
                  triggerRef(holder);
                  let time1: NodeJS.Timeout;
                  time1 = setTimeout(() => {
                    scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).endoflistitemref as HTMLLIElement);
                    clearTimeout(time1);
                  }, 110);
                  let time2: NodeJS.Timeout;
                  time2 = setTimeout(async () => {
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addloading = false;
                    triggerRef(holder);
                    if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length > 0) {
                      if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length - 1].length < numberlimit) {
                        (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages[(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length - 1].push(newinputentry); 
                      }
                      else {
                        (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages = [
                          ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages,
                          [newinputentry]
                        ];
                      }
                    }
                    else {
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages = [
                        [newinputentry]
                      ];
                    }
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).show.push(true);
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake.push(false);
                    triggerRef(holder);
                    clearTimeout(time2);
                  }, 100);
                  let time3: NodeJS.Timeout;
                  time3 = setTimeout(() => {
                    (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).current = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length - 1;
                    (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).signal++;
                    triggerRef(currentandsignal);
                    clearTimeout(time3);
                  }, 120);
                }
                else {
                  enteredwheninandwhennot.value.enteredwheninpage = true;
                  triggerRef(enteredwheninandwhennot);
                  //scroll to element and show effect that word is in page
                  let time3: NodeJS.Timeout;
                  time3 = setTimeout(() => {
                    (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).current = inpagepageindexandpos2.pageindex;
                    (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).signal++;
                    triggerRef(currentandsignal);
                    clearTimeout(time3);
                  }, 400);
                  let time7: NodeJS.Timeout;
                  time7 = setTimeout(() => {
                    if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement) {
                      scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement);
                      ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "red";
                      ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "#fff";
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).show[inpagepageindexandpos2.pos] = true;
                      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = true;
                      triggerRef(holder);
                    }
                    clearTimeout(time7);
                  }, 500);
                  let time1: NodeJS.Timeout;
                  time1 = setTimeout(() => {
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = true;
                    triggerRef(holder);
                    clearTimeout(time1);
                  }, 800);
                  let time2: NodeJS.Timeout;
                  time2 = setTimeout(() => {
                    if(((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement)) {
                      if(((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                        ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                        ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "black";
                        (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = false;
                        triggerRef(holder);
                      }
                    }
                    clearTimeout(time2);
                  }, 910);
                  let time4: NodeJS.Timeout;
                  time4 = setTimeout(() => {
                    (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = false;
                    triggerRef(holder);
                    clearTimeout(time4);
                  }, 915);
                }
              }
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).single = '';
              triggerRef(holder);
            }
          }
          break;
      }
    }
    else {
      if(typeof newinputentry !== 'string') {
        let 
          inpagepageindexandpos1 = await isAlreadyInPageArray(
            currentandsignal, 
            newinputentry, 
            holder, 
            'INDIRECT-CHECK-WHETHER-RANGE-NEWINPUTENTRY-COVERS-EXCLUDE-EQUALTO', 
            undefined, 
            from
          ),
          inpagepageindexandpos2 = await isAlreadyInPageArray(
            currentandsignal, 
            newinputentry, 
            holder, 
            'DIRECT', 
            inputtype, 
            from
          )
        ;
        if(!inpagepageindexandpos2.inpage) {
          enteredwheninandwhennot.value.enteredwhennotinpage = true;
          triggerRef(enteredwheninandwhennot);
          (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).addloading = true;
          triggerRef(holder);
          let time1: NodeJS.Timeout;
          time1 = setTimeout(() => {
            scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).endoflistitemref as HTMLLIElement);
            clearTimeout(time1);
          }, 110);
          let time2: NodeJS.Timeout;
          time2 = setTimeout(async () => {
            (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).addloading = false;
            triggerRef(holder);
            if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length > 0) {
              if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length - 1].length < numberlimit) {
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages[(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length - 1].push(newinputentry); 
              }
              else {
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages = [
                  ...(((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages,
                  [newinputentry]
                ];
              }
            }
            else {
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages = [
                [newinputentry]
              ];
            }
            (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).show.push(true);
            (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).shake.push(false);
            triggerRef(holder);
            clearTimeout(time2);
          }, 100);
          let time3: NodeJS.Timeout;
          time3 = setTimeout(() => {
            (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).current = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length - 1;
            (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).signal++;
            triggerRef(currentandsignal);
            clearTimeout(time3);
          }, 120);
          (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).singlefrom = '';
          (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).singleto = '';
          triggerRef(holder);
        }
        else {
          enteredwheninandwhennot.value.enteredwheninpage = true;
          triggerRef(enteredwheninandwhennot);
          //scroll to element and show effect that word is in page
          let time3: NodeJS.Timeout;
          time3 = setTimeout(() => {
            (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).current = inpagepageindexandpos2.pageindex;
            (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).signal++;
            triggerRef(currentandsignal);
            clearTimeout(time3);
          }, 400);
          let time7: NodeJS.Timeout;
          time7 = setTimeout(() => {
            if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement) {
              scrollToElement((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement);
              ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "red";
              ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "#fff";
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).show[inpagepageindexandpos2.pos] = true;
              (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = true;
              triggerRef(holder);
            }
            clearTimeout(time7);
          }, 500);
          let time1: NodeJS.Timeout;
          time1 = setTimeout(() => {
            (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = true;
            triggerRef(holder);
            clearTimeout(time1);
          }, 800);
          let time2: NodeJS.Timeout;
          time2 = setTimeout(() => {
            if(((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement)) {
              if(((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                ((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "black";
                (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = false;
                triggerRef(holder);
              }
            }
            clearTimeout(time2);
          }, 910);
          let time4: NodeJS.Timeout;
          time4 = setTimeout(() => {
            (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = false;
            triggerRef(holder);
            clearTimeout(time4);
          }, 915);
        }
      }
    }
    let time10: NodeJS.Timeout;
    time10 = setTimeout(() => {
      if(enteredwheninandwhennot.value.enteredwheninpage && enteredwheninandwhennot.value.enteredwhennotinpage) {
        if(inputtype==='WORD') {
          (currentandsignal.value.word as CurrentAndSignalInnerType).current = (holder.value as StringSearchType).pages.length - 1;
          (currentandsignal.value.word as CurrentAndSignalInnerType).signal++;
        }
        else if(inputtype==='EQUAL-TO') {
          (currentandsignal.value.equalto as CurrentAndSignalInnerType).current = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages.length - 1;
          (currentandsignal.value.equalto as CurrentAndSignalInnerType).signal++;
        }
        else if(inputtype==='NOT-EQUAL-TO') {
          (currentandsignal.value.notequalto as CurrentAndSignalInnerType).current = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages.length - 1;
          (currentandsignal.value.notequalto as CurrentAndSignalInnerType).signal++;
        }
        else if(inputtype=='EXCLUDE-EQUAL-TO') {
          (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).current = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.equalto as NumberSearchExcludeEqualToType).pages.length - 1;
          (currentandsignal.value.exclude?.equalto as CurrentAndSignalInnerType).signal++;
        }
        else {
          (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).current = (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : ((holder.value as AtNumber<NumberSearchType>).search))?.exclude?.fromto as NumberSearchExcludeFromToType).pages.length - 1;
          (currentandsignal.value.exclude?.fromto as CurrentAndSignalInnerType).signal++;
        }
        triggerRef(currentandsignal);
      }
    }, 935);
  });
}


export function deletePastedOrNewInputEntry(
  dindex: number,
  currentandsignal: ShallowRef<CurrentAndSignalType>,
  holder: ShallowRef<NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType>,
  inputtype: 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO' | 'DISPLAYER-EXCLUDE-FROM-TO' | 'WORD'
) {
  if(!(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).deleting) {
    (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).deleting = true;
    delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current][dindex];
    if(inputtype === 'WORD') {
      (holder.value as StringSearchType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current] = [
        ...(holder.value as StringSearchType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current].filter((item: string | undefined | null) => (item !== undefined && item !== null))
      ];
    }
    else if(inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO') {
      (holder.value as NumberSearchExcludeEqualToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current] = [
        ...(holder.value as NumberSearchExcludeEqualToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current].filter((item: string | undefined | null) => (item !== undefined && item !== null))
      ];
    }
    else {
      (holder.value as NumberSearchExcludeFromToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current] = [
        ...(holder.value as NumberSearchExcludeFromToType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current].filter((item: [string, string] | undefined | null) => (item !== undefined && item !== null))
      ];
    }
    delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).addeditemsref[dindex];
    (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).addeditemsref = [
      ...(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).addeditemsref.filter((item: HTMLDivElement | undefined | null) => (item !== undefined && item !== null))
    ];
    if(inputtype !== 'WORD') {
      delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).inneraddeditemsref[dindex];
      (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).inneraddeditemsref = [
        ...(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).inneraddeditemsref.filter((item: HTMLDivElement | undefined | null) => (item !== undefined && item !== null))
      ];
      delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).shake[dindex];
      (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).shake = [
        ...(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).shake.filter((item: boolean | undefined | null) => (item !== undefined && item !== null))
      ];
      delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).show[dindex];
      (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).show = [
        ...(holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType).show.filter((item: boolean | undefined | null) => (item !== undefined && item !== null))
      ];
    }

    triggerRef(holder);

    if((holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).pages[(currentandsignal.value.displayer as CurrentAndSignalInnerType).current].length > 0) {
      let isize = (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).pages.length;
      for(
        let i=(currentandsignal.value.displayer as CurrentAndSignalInnerType).current;
        i<isize;
        i++
      ) {
        if((i+1) < (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).pages.length) {
          inputtype === 'WORD'?
          (holder.value as StringSearchType).pages[i].push(
            (holder.value as StringSearchType).pages[i+1][0]
          )
          : (
            inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'?
            (holder.value as NumberSearchExcludeEqualToType).pages[i].push(
              (holder.value as NumberSearchExcludeEqualToType).pages[i+1][0]
            )
            :
            (holder.value as NumberSearchExcludeFromToType).pages[i].push(
              (holder.value as NumberSearchExcludeFromToType).pages[i+1][0]
            )
          );
          delete (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).pages[i+1][0];
          if(inputtype === 'WORD') {
            (holder.value as StringSearchType).pages[i+1] = [
              ...(holder.value as StringSearchType).pages[i+1].filter((item: string | undefined | null) => (item !== undefined && item !== null))
            ];
          }
          else if(inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO') {
            (holder.value as NumberSearchExcludeEqualToType).pages[i+1] = [
              ...(holder.value as NumberSearchExcludeEqualToType).pages[i+1].filter((item: string | undefined | null) => (item !== undefined && item !== null))
            ];
          }
          else {
            (holder.value as NumberSearchExcludeFromToType).pages[i+1] = [
              ...(holder.value as NumberSearchExcludeFromToType).pages[i+1].filter((item: [string, string] | undefined | null) => (item !== undefined && item !== null))
            ];
          }
          triggerRef(holder);
          if((holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).pages[i+1].length === 0) {
            (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).pages.splice((i+1), 1);
            inputtype === 'WORD'?
              (holder.value as StringSearchType).pages = [
                ...(holder.value as StringSearchType).pages.filter((item: string[] | undefined | null) => (item !== undefined && item !== null))
              ]
            : (
              inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'?
              (holder.value as NumberSearchExcludeEqualToType).pages = [
                ...(holder.value as NumberSearchExcludeEqualToType).pages.filter((item: string[] | undefined | null) => (item !== undefined && item !== null))
              ]
              :
              (holder.value as NumberSearchExcludeFromToType).pages = [
                ...(holder.value as NumberSearchExcludeFromToType).pages.filter((item: [string, string][] | undefined | null) => (item !== undefined && item !== null))
              ]
            );
            triggerRef(holder);
            break;
          }
        }
      }
    }
    else {
      (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).pages.splice((currentandsignal.value.displayer as CurrentAndSignalInnerType).current, 1);
      inputtype === 'WORD'?
        (holder.value as StringSearchType).pages = [
          ...(holder.value as StringSearchType).pages.filter((item: string[] | undefined | null) => (item !== undefined && item !== null))
        ]
      : (
        inputtype === 'DISPLAYER-EQUAL-TO-NOT-EQUAL-TO-OR-EXCLUDE-EQUAL-TO'?
        (holder.value as NumberSearchExcludeEqualToType).pages = [
          ...(holder.value as NumberSearchExcludeEqualToType).pages.filter((item: string[] | undefined | null) => (item !== undefined && item !== null))
        ]
        :
        (holder.value as NumberSearchExcludeFromToType).pages = [
          ...(holder.value as NumberSearchExcludeFromToType).pages.filter((item: [string, string][] | undefined | null) => (item !== undefined && item !== null))
        ]
      );
      (currentandsignal.value.displayer as CurrentAndSignalInnerType).current = (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).pages.length - 1;
      (currentandsignal.value.displayer as CurrentAndSignalInnerType).signal++;
      triggerRef(currentandsignal);
      triggerRef(holder);
    }
    (holder.value as NumberSearchExcludeEqualToType | NumberSearchExcludeFromToType | StringSearchType).deleting = false;
    triggerRef(holder);
  }
}

export function setTabAndResetOthers(
  tab: "GREATER-THAN" | "LESS-THAN" | "EQUAL-TO" | "NOT-EQUAL-TO" | "FROM-TO",
  holder: ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
  from?: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL" | undefined
) {
  if (tab === "GREATER-THAN") {
    if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.greaterthan as string).trim().length > 0) {
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).lessthan = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.from = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.to = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).single = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).single = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages = [];
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages = [];
    }
  } else if (tab === "LESS-THAN") {
    if((((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.lessthan as string).trim().length > 0) {
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).greaterthan = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.from = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.to = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).single = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).single = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages = [];
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages = [];
    }
  } else if (tab === "EQUAL-TO") {
    if(
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).single.trim().length > 0
      ||
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages.length > 0
    ) {
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).greaterthan = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).lessthan = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.from = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.to = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).single = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages = [];
    }
  } else if (tab === "NOT-EQUAL-TO") {
    if(
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).single.trim().length > 0
      ||
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages.length > 0
    ) {
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).greaterthan = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).lessthan = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.from = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.to = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).single = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages = [];
    }
  } else {
    if(
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.from.trim().length > 0
      ||
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).fromto.to.trim().length > 0
    ) {
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).greaterthan = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).lessthan = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).single = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).single = "";
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.equalto as NumberSearchExcludeEqualToType).pages = [];
      (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search)?.notequalto as NumberSearchExcludeEqualToType).pages = [];
    }
  }
  
  (((from === "NUMBER-SEARCHER-MODAL" || from === undefined)? holder.value as NumberType['search']['multiple'] : (holder.value as AtNumber<NumberSearchType>).search) as NumberSearchType).tab = tab;
  triggerRef(holder);
}
