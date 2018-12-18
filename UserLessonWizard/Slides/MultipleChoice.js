import React, { PureComponent } from 'react'
import * as T from 'prop-types'
import cns from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'

import kiwiHtmlTemplate from '../../utils/kiwiHtmlTemplate'
import { titleStyle, slideContentFullHeight } from './commonSlideStyles'
import { createVariableNameValuePair } from '../../utils/templateUtils'
import SpeechBubble from '../SpeechBubble'

const styles = theme => ({
  choices: {
    position: 'absolute',
    bottom: '5vh',
    width: '100%',
    left: '50%',
    marginLeft: '-50%',
    display: 'flex',
    flexFlow: 'row wrap'
  },
  choice: {
    background: '#000',
    color: '#FFF',
    cursor: 'pointer',
    border: '1px solid #FFFFFF',
    boxSizing: 'border-box',
    height: 'calc(10vh + 30px)',
    padding: '15px',
    fontFamily: 'Courier',
    textShadow: '1px 1px 2px #808080',
    flex: '1 50%',
    '&:hover': {
      opacity: 0.9
    },
  },
  selected: {
    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3)'
  },
  choice0: { backgroundColor: '#E94858', borderTopLeftRadius: '10px' },
  choice1: { backgroundColor: '#F3A32A', borderTopRightRadius: '10px' },
  choice2: { backgroundColor: '#82BF6E', borderBottomLeftRadius: '10px' },
  choice3: { backgroundColor: '#3CB4CB', borderBottomRightRadius: '10px' }
})

const Choices = ({ classes, slideData, input }) =>
  <div id='choices' className={ classes.choices }>
    { slideData.choices.map((choice, i) => {
      const selected = input.value === i
      return (
        <div
          key={ i }
          id={ !selected ? `choice${i}` : `choice${i}-selected` }
          className={ cns(classes.choice, classes[`choice${i}`], {
            [classes.selected]: selected
          }) }
          onClick={ () => { if (!selected) input.onChange(i) } }
        >
          { choice }
        </div>
      )
    }
    ) }
  </div>

class FullPageText extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    slideData: T.object
    , className: T.string
  }

  render() {
    const { classes, slideData, className, globalColors, variablesWithUserValues, input } = this.props
    const variableValues = createVariableNameValuePair(variablesWithUserValues)
    const instructions = kiwiHtmlTemplate(slideData.instructions, variableValues)

    return (
      <div key={ className } style={ slideContentFullHeight } className={ className }>
        <SpeechBubble
          label={ slideData.instructionsLabel }
          htmlContent={ instructions }
        />
        <Choices
          slideData={ slideData }
          input={ input }
          classes={ classes }
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FullPageText)
