import type { CSSProperties } from 'vue';
import type { VueTypesInterface, VueTypeValidableDef } from 'vue-types';

import { createTypes, toValidableType } from 'vue-types';

type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>;
};
const newPropTypes = createTypes({
  bool: undefined,
  func: undefined,
  integer: undefined,
  number: undefined,
  object: undefined,
  string: undefined,
}) as PropTypes;

class propTypes extends newPropTypes {
  static override get style() {
    return toValidableType('style', {
      type: [String, Object],
    });
  }
}

export { propTypes };
