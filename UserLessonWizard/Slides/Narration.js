import React, { PureComponent } from 'react'
import * as T from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import kiwiHtmlTemplate from '../../utils/kiwiHtmlTemplate'

import { createVariableNameValuePair } from '../../utils/templateUtils'

const styles = () => ({
  root: {
    width: 800
    , height: 600
    , position: 'absolute'
    , top: '50%'
    , left: '50%'
    , marginLeft: -400
    , marginTop: -250
    , paddingTop: '60px'
    , backgroundImage: 'url(https://res.cloudinary.com/kiwi-prod/image/upload/v1531085546/narration-background_olnutw.svg)'
    , backgroundSize: '100%'
    , backgroundPosition: 'center top'
    , backgroundRepeat: 'no-repeat'
  },
  instructions: {
    fontFamily: 'Gaegu',
    fontSize: '24pt',
    padding: '0 20px 20px 80px',
    overflowY: 'scroll',
    maxHeight: 370
  },
  '@global': {
    'em, p, strong, b, i, u, span': {
      background: 'none !important'
    }
  }
})

class Narration extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    slideData: T.object
    , className: T.string
  }

  render() {
    const { classes, slideData, variablesWithUserValues, globalColors } = this.props

    const variableValues = createVariableNameValuePair(variablesWithUserValues)
    const instructions = kiwiHtmlTemplate(slideData.instructions, variableValues)

    return (
      <div className={ classes.root }>
        <div
          id='instructions'
          className={ classes.instructions }
          dangerouslySetInnerHTML={ { __html: instructions } }
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Narration)
