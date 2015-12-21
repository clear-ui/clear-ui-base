import Prefixer from 'inline-style-prefixer'
import composeStyles from './composeStyles'

let prefixer

function getPrefixer() {
	// TODO support server-side rendering (requires passing userAgent)
	if (!prefixer) prefixer = new Prefixer()
	return prefixer
}

function postprocessStyle(style) {
	for (let i in style) {
		let value = style[i]
		if (value && value.rgbaString) style[i] = value.rgbaString()
	}
	style = getPrefixer().prefix(style)
	return style
}

export default {
	getStyles(props, state, context) {
		let stylesSource = composeStyles(this.constructor.styles, props.styles)
		let styles = typeof stylesSource === 'function' ?
			stylesSource(props, state, context) :
			stylesSource
		for (let elem in styles) {
			styles[elem] = postprocessStyle(styles[elem])
		}
		this.styles = styles
	},

	componentWillMount() {
		this.__super()
		if (!this.state) this.state = {}
		this.getStyles(this.props, this.state, this.context)
	},

	componentWillUpdate(nextProps, nextState) {
		this.__super()
		this.getStyles(nextProps, nextState)
	}
}