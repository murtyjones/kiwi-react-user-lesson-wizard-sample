import React, { PureComponent } from 'react'
import * as T from 'prop-types'

import kiwiHtmlTemplate from '../../utils/kiwiHtmlTemplate'
import { createVariableNameValuePair } from '../../utils/templateUtils'
import SpeechBubble from '../SpeechBubble'

const styles = {
  fullPageExampleContainer: {
    position: 'relative' // has to be done so that child pos:abs will work
    , border: '1px solid #CCC'
    , borderRadius: 15
    , padding: 5
    , paddingLeft: 20
    , marginTop: 20
  },
  container: {
    width: 600
    , position: 'absolute'
    , top: '50%'
    , left: '50%'
    , marginLeft: -300
    , marginTop: -250
    , paddingTop: '5%'
  },
  exampleLabel: {
    display: 'inline-block'
    , position: 'absolute'
    , top: -10
    , left: 15
    , background: '#FFFFFF'
    , padding: 2
    , paddingLeft: 10
    , paddingRight: 10
    , fontWeight: 'bold'
    , fontSize: '14pt'
  },
  fullPageExplanationStyle: {

  }
}

class FullPageCodeExample extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    slideData: T.object
    , className: T.string
    , variablesWithUserValues: T.array
  }

  render() {
    const { slideData, className, variablesWithUserValues, globalColors } = this.props
    const variableValues = createVariableNameValuePair(variablesWithUserValues)
    let example = kiwiHtmlTemplate(slideData.example, variableValues)

    const { characterUrl, explanation } = slideData

    return (
      <div id='exampleContainer' style={ styles.container } className={ className }>
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
          label={ slideData.exampleLabel }
          explanation={ explanation }
          htmlContent={ example }
          isCodeExample={ true }
        />
      </div>
    )
  }
}

export default FullPageCodeExample
