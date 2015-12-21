import assert from 'assert'
import $ from 'jquery'

import Attachment from '../index.js'

describe('attachment/class', function() {

	let attachment

	// Set html height to x2 of window height,
	// Scroll down by window height.
	let winHeight = $(window).height()

	// Place target at the top of viewport
	let TARGET_STYLE = {
		position: 'absolute',
		width: 100,
		height: 50,
		left: 0,
		top: winHeight,
		background: '#ccc'
	}

	let ELEMENT_STYLE = {
		position: 'absolute',
		width: 100,
		height: 200,
		background: '#ddd'
	}

	let TARGET = $('<div>', {css: TARGET_STYLE})
	let ELEMENT = $('<div>', {css: ELEMENT_STYLE})

	beforeEach(function() {
		$('html').height(winHeight * 2)
		$(window).scrollTop(winHeight)

		TARGET.appendTo('body')
		ELEMENT.appendTo('body')
	})

	afterEach(function() {
		TARGET.css(TARGET_STYLE).remove()
		ELEMENT.remove()
		if (attachment) attachment.destroy()

		$('html').height('')
	})

	// Does not fit
	let TOP_ATTACHMENT = {
		target: 'center top',
		element: 'center bottom'
	}

	// Fits
	let BOTTOM_ATTACHMENT = {
		target: 'center bottom',
		element: 'center top'
	}

	it('attaches element', function() {
		attachment = new Attachment({
			element: ELEMENT,
			target: TARGET,
			attachment: [TOP_ATTACHMENT, BOTTOM_ATTACHMENT]
		})

		let elemOffset = ELEMENT.offset()
		assert.equal(elemOffset.top, TARGET_STYLE.top + TARGET_STYLE.height)
		assert.equal(elemOffset.left, 0)
	})

	//TODO mirror?

	it('updates with updatePosition', function() {
		attachment = new Attachment({
			element: ELEMENT,
			target: TARGET,
			attachment: [TOP_ATTACHMENT, BOTTOM_ATTACHMENT]
		})
		assert.equal(ELEMENT.offset().left, 0)

		TARGET.css('left', 5) // Move target
		attachment.updatePosition()
		assert.equal(ELEMENT.offset().left, 5)
	})

	it('updates on scroll and resize', function() {
		attachment = new Attachment({
			element: ELEMENT,
			target: TARGET,
			attachment: [TOP_ATTACHMENT, BOTTOM_ATTACHMENT]
		})
		assert.equal(ELEMENT.offset().left, 0)

		TARGET.css('left', 5) // Move target
		$(window).trigger('scroll')
		assert.equal(ELEMENT.offset().left, 5)

		TARGET.css('left', 3) // Move target
		$(window).trigger('resize')
		assert.equal(ELEMENT.offset().left, 3)
	})
})