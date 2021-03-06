import React from 'react'

import isSameOrInheritedType from 'clear-ui-base/lib/utils/isSameOrInheritedType'
import {MenuItem} from 'clear-ui-base/lib/menu'
import mixinDecorator from 'clear-ui-base/lib/utils/mixin/decorator'
import StylesMixin from '../utils/stylesMixin'
import ChildComponentsMixin from '../utils/childComponentsMixin'

@mixinDecorator(StylesMixin, ChildComponentsMixin)
class Select extends React.Component {
	static propTypes = {
		/** Value of the select. */
		value: React.PropTypes.string,

		/** Handler of value change. */
		onChange: React.PropTypes.func,

		/** Label that shows when select has no value. */
		label: React.PropTypes.node
	}

	static defaultProps = {
		label: 'select value'
	}

	static childComponents = {
		dropdownMenu: null
	}

	render() {
		let {value, disabled, onChange} = this.props
		return React.cloneElement(this.getChildComponent('dropdownMenu'), {
			value,
			disabled,
			onSelect: onChange,
			onFocus: () => { this.setState({focused: true}) },
			onBlur: () => { this.setState({focused: false}) },
			trigger: this.renderTrigger()
		}, this.props.children)
	}

	/** Returns content of currently selected element or placeholder text. */
	renderTriggerContent() {
		if (this.props.value !== undefined) {
			let childrenArray = React.Children.toArray(this.props.children)
			for (let i in childrenArray) {
				let elem = childrenArray[i]
				if (isSameOrInheritedType(elem.type, MenuItem) &&
					elem.props.value === this.props.value
				) {
					return React.DOM.div({style: this.styles.value}, elem.props.children)
				}
			}
		}

		return React.DOM.div({style: this.styles.label}, this.props.label)
	}

	/**
	 * @method
	 * @abstract
	 * @returns {element}
	 */
	renderTrigger() {
		throw new Error('Not implemented')
	}
}

export default Select
