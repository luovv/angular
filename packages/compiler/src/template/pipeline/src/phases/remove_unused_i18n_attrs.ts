/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ir from '../../ir';
import {CompilationJob} from '../compilation';

/**
 * i18nAttributes ops will be generated for each i18n attribute. However, not all i18n attribues
 * will contain dynamic content, and so some of these i18nAttributes ops may be unnecessary.
 */
export function removeUnusedI18nAttributesOps(job: CompilationJob) {
  for (const unit of job.units) {
    const targetsWithI18nApply = new Set<ir.XrefId>();

    for (const op of unit.update) {
      switch (op.kind) {
        case ir.OpKind.I18nApply:
          targetsWithI18nApply.add(op.target);
      }
    }

    for (const op of unit.create) {
      switch (op.kind) {
        case ir.OpKind.I18nAttributes:
          if (targetsWithI18nApply.has(op.target)) {
            continue;
          }
          ir.OpList.remove<ir.CreateOp>(op);
      }
    }
  }
}
