import React from 'react'
import PropTypes from 'prop-types'
import {Spinner} from '@sanity/ui'

// Waits for X ms before showing a spinner
class DelayedSpinner extends React.PureComponent {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    this.timer = setTimeout(() => this.setState({show: true}), this.props.delay)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    return this.state.show ? <Spinner muted /> : null
  }
}

DelayedSpinner.propTypes = {
  delay: PropTypes.number,
}

DelayedSpinner.defaultProps = {
  delay: 500,
}

export default DelayedSpinner
