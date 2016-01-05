import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

import mixinDecorator from '../utils/mixin/decorator'
import StylesMixin from '../utils/stylesMixin'
import ManagedStateMixin from '../utils/managedStateMixin'
import Attachment from '../attachment'

/**
 * @param [offset] TODO
 * @param {string} [width] - Width of the list, number with 'px' or '%' (of trigger width).
 * @param {'left'|'right'} [side='left']
 * @param {'top'|'bottom'} [vertSide='bottom']
 * @param {function(value)} [onSelect]
 * @param {element} props.trigger - Dropdown trigger.
 * @param {node} props.children - Dropdown content.
 */
@mixinDecorator(StylesMixin, ManagedStateMixin)
class Dropdown extends React.Component {
	static defaultProps = {
		expandSide: 'right',
		vertSide: 'bottom'
	}

	static styles = {
		root: {display: 'inline-block'},
		list: {position: 'absolute'}
	}

	render() {
		let trigger = React.cloneElement(this.getTrigger(), {
			ref: (ref) => { this.triggerRef = ref },
		})

		let menu = React.cloneElement(this.getMenu(), {
			active: true,
			value: this.props.value,
			onSelect: this.onItemSelect.bind(this)
		}, this.props.children)

		let list = React.DOM.div({
			style: this.styles.list,
			ref: (ref) => { this.listRef = ref }
		}, menu)

		let props = {
			open: this.state.open,
			onClose: () => { this.setManagedState({open: false}) },
			attachment: this.getAttachmentPoint(),
			mirrorAttachment: 'all',
			layerProps: {
				onRender: this.setListWidth.bind(this),
				overlay: true,
				closeOnOverlayClick: true,
				closeOnEsc: true
			},
			element: list
		}

		return React.DOM.div({style: this.styles.root},
			React.createElement(Attachment, props, trigger))
	}

	getAttachmentPoint() {
		let oppositeSide = (this.props.expandSide === 'left') ? 'right' : 'left'
		let oppositeVertSide = (this.props.vertSide === 'bottom') ? 'top' : 'bottom'

		return {
			target: `${oppositeSide} ${this.props.vertSide}`,
			element: `${oppositeSide} ${oppositeVertSide}`
			//offset: '0 -1px'
		}
	}

	/**
	 * @abstract
	 * @method
	 * Method that returns implementation of the Menu component.
	 */
	getMenu() {
		throw new Error('Not implemented')
	}

	getAnimation() {
		// TODO
	}

	getTrigger() {
		return React.DOM.div({
			style: this.styles.trigger,
			onClick: () => { this.setManagedState({open: true}) }
		}, this.props.trigger)
	}

	onItemSelect(item) {
		if (this.props.onSelect) this.props.onSelect(item.props.value, item)
		this.setManagedState({open: false})
	}

	setListWidth() {
		let triggerElem = $(ReactDOM.findDOMNode(this.triggerRef))
		let listElem = $(ReactDOM.findDOMNode(this.listRef))

		let widthDiff = listElem.outerWidth() - listElem.width()

		let triggerWidth = triggerElem.outerWidth()
		let minWidth = triggerWidth - widthDiff
		let width
		if (this.props.width) {
			let num = parseInt(this.props.width, 10)
			let unit = String(this.props.width).slice(String(num).length)
			width = (unit === '%') ? (triggerWidth * num / 100) : num
			width -= widthDiff
		}
		listElem.css({minWidth, width})
	}
}

export default Dropdown