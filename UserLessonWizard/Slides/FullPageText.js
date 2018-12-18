import React, { PureComponent } from 'react'
import * as T from 'prop-types'

import kiwiHtmlTemplate from '../../utils/kiwiHtmlTemplate'
import { createVariableNameValuePair } from '../../utils/templateUtils'
import withStyles from '@material-ui/core/styles/withStyles'
import SpeechBubble from '../SpeechBubble'

const styles = theme => ({
  container: {
    width: 600
    , position: 'absolute'
    , top: '50%'
    , left: '50%'
    , marginLeft: -300
    , marginTop: -250
    , paddingTop: '5%'
    , fontSize: '14pt'
  }
})

class FullPageText extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    slideData: T.object
    , className: T.string
  }

  render() {
    const { slideData, classes, variablesWithUserValues, globalColors } = this.props
    const { instructionsLabel, characterUrl } = slideData
    const variableValues = createVariableNameValuePair(variablesWithUserValues)
    const instructions = kiwiHtmlTemplate(slideData.instructions, variableValues)

    return (
      <div className={ classes.container }>
        { characterUrl &&
          <img
            src={ characterUrl }
            style={ {
              position: 'absolute',
              width: '200px',
              left: '-205px'
            } }
          />
        }
        <SpeechBubble
          label={ instructionsLabel }
          htmlContent={ instructions }
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FullPageText)
