import type { StringSearchType, NumberType, } from "../types/SupportedDatatypesTypeDeclaration";
import type { Ref } from "vue";

const limit = 1000;

export function addNewInputEntry(
  nonerangeorrange: 'NONE-RANGE' | 'RANGE',
  newinputentry: string | [string, string],
  inputtype: 'WORD' | 'EXCLUDE-EQUAL-TO' | 'EXCLUDE-FROM-TO' | 'NOT-EQUAL-TO' | 'EQUAL-TO',
  holder: Ref<NumberType['search'] | StringSearchType>
) {
  if(nonerangeorrange === 'NONE-RANGE') {
    switch(inputtype) {
      case 'WORD':

        break;
      case 'EQUAL-TO':

        break;
      case 'NOT-EQUAL-TO':

        break;
      default: //EXCLUDE-EQUAL-TO
    
        break;
    }
  }
  else {

  }
}
