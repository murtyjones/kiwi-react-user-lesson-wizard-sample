import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  background: {
    backgroundColor: '#000'
    , zIndex: 400
    , position: 'absolute'
    , height: '100%'
    , width: '100%'
  }
})

const CustomSlideBackground = ({ classes, src }) =>
  <div
    className={ classes.background }
    style={ {
      backgroundImage: `url(${src})`,
      backgroundSize: '100%',
      backgroundPosition: ' center center',
      backgroundRepeat: 'no-repeat'
    } }
  />



export default withStyles(styles)(CustomSlideBackground)
