'use strict';

import shallowEqual from 'react/lib/shallowEqual';

/**
 * Provides the implementation for `PureRenderMixin` to be used
 * as a ES7 Class Property.
 *
 * ```js
 * class Foo extends React.Component {
 *   shouldComponentUpdate = core.utils.shouldComponentUpdatePure
 *
 *   render () {}
 * }
 * ```
 * Returns false when `props` and `state` have not changed.
 *
 * @param {Object} nextProps
 * @param {Object} nextState
 * @return {boolean}
 */
export default function shouldComponentUpdatePure (nextProps, nextState) {
  return !shallowEqual(this.props, nextProps) ||
         !shallowEqual(this.state, nextState);
}
