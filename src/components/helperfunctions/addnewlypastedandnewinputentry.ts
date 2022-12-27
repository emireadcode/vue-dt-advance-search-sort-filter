import type { AtNumber, NumberSearchType, StringSearchType, NumberType, NumberSearchExcludeEqualToType, NumberSearchExcludeFromToType } from "../types/SupportedDatatypesTypeDeclaration";
import type { Ref } from "vue";

const limit = 8000;

function scrollToElement(el: HTMLDivElement | HTMLLIElement) {
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

async function isAlreadyInPageArray(
  newinputentry: string | [string, string],
  holder: Ref<NumberType['search'] | AtNumber<NumberSearchType>['search'] | StringSearchType>,
  direction: 'DIRECT' | 'INDIRECT-CHECK-WHETHER-NEWINPUTENTRY-WITHIN-RANGE-OF-EXCLUDE-FROMTO' | 'INDIRECT-CHECK-WHETHER-RANGE-NEWINPUTENTRY-COVERS-EXCLUDE-EQUALTO',
  inputtype?: 'WORD' | 'EXCLUDE-EQUAL-TO' | 'EXCLUDE-FROM-TO' | 'NOT-EQUAL-TO' | 'EQUAL-TO' | undefined
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
              (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages.length
              : (
                  inputtype==='NOT-EQUAL-TO'?
                  (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages.length
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
                  (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages[i].length
                  : (
                  inputtype==='NOT-EQUAL-TO'?
                      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages[i].length
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
                  (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages[i][j]
                  : (
                    inputtype==='NOT-EQUAL-TO'?
                      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages[i][j]
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
            scrollToElement(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[pos] as HTMLDivElement);
            (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.backgroundColor = "red";
            (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.color = "#fff";
            ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).show[pos] = true;
            ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[pos] = true;
            let time1: NodeJS.Timeout;
            time1 = setTimeout(() => {
              ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[pos] = true;
              clearTimeout(time1);
            }, 800);
            let time2: NodeJS.Timeout;
            time2 = setTimeout(() => {
              if(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos].style.backgroundColor !== '#fff') {
                (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.backgroundColor = "#fff";
                (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[pos] as HTMLDivElement).style.color = "black";
                ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[pos] = false;
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
      let inpagepageindexandpos = await isAlreadyInPageArray(newinputentry, holder, 'DIRECT', "EXCLUDE-FROM-TO");
      if(!inpagepageindexandpos.inpage) {
        let 
          isize = ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length,
          time1: NodeJS.Timeout[] = [], 
          time2: NodeJS.Timeout[] = [], 
          time1Index = 0, 
          time2Index = 0
        ;
        for(
          let i=0;
          i<isize;
          i++
        ) {
          let jsize = ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length;
          for(
            let j=0;
            j<jsize;
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
              scrollToElement(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[j] as HTMLDivElement);
              (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.backgroundColor="red";
              (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.color="#fff";
              ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show[j] = true;
              ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = true;
              time1[time1Index] = setTimeout(() => {
                ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = true;
                clearTimeout(time1[time1Index]);
              }, 800);
              time1Index++;
              time2[time2Index] = setTimeout(() => {
                if((((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.backgroundColor !== "#fff") {
                  (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.backgroundColor="#fff";
                  (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j] as HTMLDivElement).style.color="black";
                  ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[j] = false;
                  ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show[j] = false;
                }
                clearTimeout(time2[time2Index]);
              }, 810);
              time2Index++;
            }
          }
        }
        let 
          time3: NodeJS.Timeout[] = [], 
          time3Index = 0
        ;
        isize = ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages.length;
        for(let i=0; i<isize; i++) {
          let jsize = ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i].length;
          for(let j=0; j<jsize; j++) {          
            if(
              parseFloat(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) >= parseFloat(newinputentry[0])
              &&
              parseFloat(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j]) <= parseFloat(newinputentry[1])
            ) {
              time3[time3Index] = setTimeout(() =>{
                delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).pages[i][j];
                delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[j];
                delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[j];
                delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[j];
                delete ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show[j];
                clearTimeout(time3[time3Index]);
              }, 811);
              time3Index++;
            }
          }
        }
      }
    }
  }
  return {inpage, pageindex, pos};
}

export async function addNewInputEntry(
  newinputentry: string | [string, string],
  inputtype: 'WORD' | 'EXCLUDE-EQUAL-TO' | 'EXCLUDE-FROM-TO' | 'NOT-EQUAL-TO' | 'EQUAL-TO',
  current: Ref<number>,
  holder: Ref<NumberType['search'] | AtNumber<NumberSearchType>['search'] | StringSearchType>
) {
  if(inputtype==='EQUAL-TO' || inputtype==='EXCLUDE-EQUAL-TO' || inputtype==='NOT-EQUAL-TO' || inputtype==='WORD') {
    switch(inputtype) {
      case 'WORD':
        let maxwordlength = 40;
        if(typeof newinputentry === 'string') {
          if(newinputentry.trim().length > 0 && newinputentry.length <= maxwordlength) {
            let inpagepageindexandpos = await isAlreadyInPageArray(newinputentry, holder, 'DIRECT', inputtype);
            if(!inpagepageindexandpos.inpage) {
              (holder.value as StringSearchType).addloading = true;
              let time: NodeJS.Timeout;
              time = setTimeout(() => {
                scrollToElement((holder.value as StringSearchType).endoflistitemref as HTMLLIElement);
                (holder.value as StringSearchType).addloading = false;
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
                scrollToElement((holder.value as StringSearchType).endoflistitemref as HTMLLIElement);
                clearTimeout(time);
              }, 110);
            }
            else {
              current.value = inpagepageindexandpos.pageindex;
              //scroll to element and show effect that word is in page
              scrollToElement((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement);
              ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "red";
              ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "#fff";
              let time: NodeJS.Timeout;
              time = setTimeout(() => {
                if(((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                  ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                  ((holder.value as StringSearchType).addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "black";
                }
                clearTimeout(time);
              }, 800);
            }
            (holder.value as StringSearchType).single = '';
          }
        }
        break;
      case 'EQUAL-TO':
        if(typeof newinputentry === 'string') {
          if(newinputentry.trim().length > 0) {
            let inpagepageindexandpos = await isAlreadyInPageArray(newinputentry, holder, 'DIRECT', inputtype);
            if(!inpagepageindexandpos.inpage) {
              (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.addloading = true;
              let time2: NodeJS.Timeout;
              time2 = setTimeout(() => {
                scrollToElement((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.endoflistitemref as HTMLLIElement);
                clearTimeout(time2);
              }, 110);
              let time: NodeJS.Timeout;
              time = setTimeout(() => {
                (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.addloading = false;
                if((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages.length > 0) {
                  if((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages[(holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages.length - 1].length < limit) {
                    (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages[(holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages.length - 1].push(newinputentry); 
                  }
                  else {
                    (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages = [
                      ...(holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages,
                      [newinputentry]
                    ];
                  }
                }
                else {
                  (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages = [
                    [newinputentry]
                  ];
                }
                (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.show.push(true);
                (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.shake.push(false);
                clearTimeout(time);
              }, 100);
            }
            else {
              current.value = inpagepageindexandpos.pageindex;
              //scroll to element and show effect that word is in page
              scrollToElement((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement);
              ((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "red";
              ((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "#fff";
              (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.show[inpagepageindexandpos.pos] = true;
              (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.shake[inpagepageindexandpos.pos] = true;
              let time1: NodeJS.Timeout;
              time1 = setTimeout(() => {
                (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.shake[inpagepageindexandpos.pos] = true;
                clearTimeout(time1);
              }, 800);
              let time2: NodeJS.Timeout;
              time2 = setTimeout(() => {
                if(((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                  ((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                  ((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "black";
                  (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.shake[inpagepageindexandpos.pos] = false;
                }
                clearTimeout(time2);
              }, 810);
            }
            (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.single = '';
          }
        }
        break;
      case 'NOT-EQUAL-TO':
        if(typeof newinputentry === 'string') {
          if(newinputentry.trim().length > 0) {
            let inpagepageindexandpos = await isAlreadyInPageArray(newinputentry, holder, 'DIRECT', inputtype);
            if(!inpagepageindexandpos.inpage) {
              (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.addloading = true;
              let time2: NodeJS.Timeout;
              time2 = setTimeout(() => {
                scrollToElement((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.endoflistitemref as HTMLLIElement);
                clearTimeout(time2);
              }, 110);
              let time: NodeJS.Timeout;
              time = setTimeout(() => {
                (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.addloading = false;
                if((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages.length > 0) {
                  if((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages[(holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages.length - 1].length < limit) {
                    (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages[(holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages.length - 1].push(newinputentry); 
                  }
                  else {
                    (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages = [
                      ...(holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages,
                      [newinputentry]
                    ];
                  }
                }
                else {
                  (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages = [
                    [newinputentry]
                  ];
                }
                (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.show.push(true);
                (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.shake.push(false);
                clearTimeout(time);
              }, 100);
            }
            else {
              current.value = inpagepageindexandpos.pageindex;
              //scroll to element and show effect that word is in page
              scrollToElement((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.addeditemsref[inpagepageindexandpos.pos] as HTMLDivElement);
              ((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "red";
              ((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "#fff";
              (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.show[inpagepageindexandpos.pos] = true;
              (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.shake[inpagepageindexandpos.pos] = true;
              let time1: NodeJS.Timeout;
              time1 = setTimeout(() => {
                (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.shake[inpagepageindexandpos.pos] = true;
                clearTimeout(time1);
              }, 800);
              let time2: NodeJS.Timeout;
              time2 = setTimeout(() => {
                if(((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                  ((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                  ((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.inneraddeditemsref[inpagepageindexandpos.pos] as HTMLDivElement).style.color = "black";
                  (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.shake[inpagepageindexandpos.pos] = false;
                }
                clearTimeout(time2);
              }, 810);
            }
            (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.single = '';
          }
        }
        break;
      default: //EXCLUDE-EQUAL-TO
        if(typeof newinputentry === 'string') {
          if(newinputentry.trim().length > 0) {
            let inpagepageindexandpos1 = await isAlreadyInPageArray(newinputentry, holder, 'INDIRECT-CHECK-WHETHER-NEWINPUTENTRY-WITHIN-RANGE-OF-EXCLUDE-FROMTO');
            if(!inpagepageindexandpos1.inpage) {
              let inpagepageindexandpos2 = await isAlreadyInPageArray(newinputentry, holder, 'DIRECT', inputtype);
              if(!inpagepageindexandpos2.inpage) {
                ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addloading = true;
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  scrollToElement(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).endoflistitemref as HTMLLIElement);
                  clearTimeout(time2);
                }, 110);
                let time: NodeJS.Timeout;
                time = setTimeout(() => {
                  ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addloading = false;
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
                  clearTimeout(time);
                }, 100);
              }
              else {
                current.value = inpagepageindexandpos2.pageindex;
                //scroll to element and show effect that word is in page
                scrollToElement(((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement);
                (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "red";
                (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "#fff";
                ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).show[inpagepageindexandpos2.pos] = true;
                ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = true;
                let time1: NodeJS.Timeout;
                time1 = setTimeout(() => {
                  ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = true;
                  clearTimeout(time1);
                }, 800);
                let time2: NodeJS.Timeout;
                time2 = setTimeout(() => {
                  if((((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
                    (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "#fff";
                    (((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "black";
                    ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).shake[inpagepageindexandpos2.pos] = false;
                  }
                  clearTimeout(time2);
                }, 810);
              }
            }
            ((holder.value as NumberType['search']).exclude?.equalto as NumberSearchExcludeEqualToType).single = '';
          }
        }
        break;
    }
  }
  else {
    if(typeof newinputentry !== 'string') {
      let inpagepageindexandpos1 = await isAlreadyInPageArray(newinputentry, holder, 'INDIRECT-CHECK-WHETHER-RANGE-NEWINPUTENTRY-COVERS-EXCLUDE-EQUALTO');
      let inpagepageindexandpos2 = await isAlreadyInPageArray(newinputentry, holder, 'DIRECT', inputtype);
      if(!inpagepageindexandpos2.inpage) {
        ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addloading = true;
        let time2: NodeJS.Timeout;
        time2 = setTimeout(() => {
          scrollToElement(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).endoflistitemref as HTMLLIElement);
          clearTimeout(time2);
        }, 110);
        let time3: NodeJS.Timeout;
        time3 = setTimeout(() => {
          ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addloading = false;
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
          clearTimeout(time3);
        }, 100);
      }
      else {
        current.value = inpagepageindexandpos2.pageindex;
        //scroll to element and show effect that word is in page
        scrollToElement(((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).addeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement);
        (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "red";
        (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "#fff";
        ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).show[inpagepageindexandpos2.pos] = true;
        ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = true;
        let time1: NodeJS.Timeout;
        time1 = setTimeout(() => {
          ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = true;
          clearTimeout(time1);
        }, 800);
        let time2: NodeJS.Timeout;
        time2 = setTimeout(() => {
          if((((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor !== '#fff') {
            (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.backgroundColor = "#fff";
            (((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).inneraddeditemsref[inpagepageindexandpos2.pos] as HTMLDivElement).style.color = "black";
            ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).shake[inpagepageindexandpos2.pos] = false;
          }
          clearTimeout(time2);
        }, 810);
      }
      ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).singlefrom = '';
      ((holder.value as NumberType['search']).exclude?.fromto as NumberSearchExcludeFromToType).singleto = '';
    }
  }
}

export function setTabAndResetOthers(
  tab: "GREATER-THAN" | "LESS-THAN" | "EQUAL-TO" | "NOT-EQUAL-TO" | "FROM-TO",
  holder: Ref<NumberType['search'] | AtNumber<NumberSearchType>['search']>
) {
  if (tab === "GREATER-THAN") {
    if((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).greaterthan.trim().length > 0) {
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).lessthan = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.from = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.to = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.single = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.single = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages = [];
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages = [];
    }
  } else if (tab === "LESS-THAN") {
    if((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).lessthan.trim().length > 0) {
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).greaterthan = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.from = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.to = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.single = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.single = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages = [];
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages = [];
    }
  } else if (tab === "EQUAL-TO") {
    if((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.single.trim().length > 0) {
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).greaterthan = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).lessthan = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.from = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.to = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.single = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages = [];
    }
  } else if (tab === "NOT-EQUAL-TO") {
    if((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.single.trim().length > 0) {
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).greaterthan = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).lessthan = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.from = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.to = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.single = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages = [];
    }
  } else {
    if(
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.from.trim().length > 0
      ||
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.to.trim().length > 0
    ) {
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).greaterthan = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).lessthan = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.single = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.single = "";
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.pages = [];
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.pages = [];
    }
  }
  
  (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).tab = tab;
}