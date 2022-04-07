import {
  defineNamespace,
  defineProjections,
  Model as Class3Mixin
} from '../mixins/regenerated/models/audit-test-simple-class3';

import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';

let Model = EmberFlexberryDataModel.extend(Class3Mixin, {
});

defineNamespace(Model);
defineProjections(Model);

export default Model;