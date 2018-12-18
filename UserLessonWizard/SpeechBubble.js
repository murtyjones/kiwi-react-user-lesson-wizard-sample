import React from 'react'
import cns from 'classnames'
import Paper from '@material-ui/core/Paper'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  root: {
    padding: 0,
    boxSizing: 'border-box',
    boxShadow: 'none',
    background: 'none'
  },
  label: {
    backgroundColor: '#330000'
    , marginLeft: '15px'
    , fontWeight: 'bold'
    , fontSize: '13pt'
    , color: '#FFF'
    , borderRadius: '5px 5px 0 0'
    , padding: '4px 7px'
    , textTransform: 'uppercase'
    , position: 'relative'
    , top: '-1px'
  },
  bubble: {
    border: '3px solid #330000'
    , borderRadius: '10px'
    , padding: '15px'
    , backgroundColor: '#FFF',
    '&$isCodeExample': {
      fontFamily: 'monospace',
      fontSize: '16pt',
    },
  },
  bubbleContent: {
    maxWidth: 'calc(100% - 110px)',
    display: 'inline-block',
    verticalAlign: 'top',
    marginLeft: 10,
    '&$isCodeExample': {
      fontFamily: 'monospace',
      marginLeft: 0
    },
    '& p, strong, b, i, u, span': {
      margin: 0
    }
  },
  isCodeExample: {

  },
  cornerImage: {
    width: 100,
    borderRadius: 5
  },
  explanation: {
    fontSize: '14pt',
    fontFamily: 'Arial'
  },
  exampleLabel: {
    borderBottom: '1px solid #AAAAAA',
    color: '#AAAAAA',
    margin: '15px 0 5px 0',
    lineHeight: '30px'
  }
})

const Label = ({ className, label })  =>
  <div id='speechBubbleLabel'>
    <span className={ className }>
      { label }
    </span>
  </div>

const SpeechBubble = ({ classes, className, explanation, label, htmlContent, isCodeExample, cornerImageUrl }) => {
  return (
    <Paper className={ cns(classes.root, { [className]: className }) }>
      { label &&
        <Label
          label={ label }
          className={ classes.label }
        />
      }
      <div
        id='speechBubble'
        className={ cns(classes.bubble, { [classes.isCodeExample]: isCodeExample }) }
      >
        { explanation &&
          <div className={ classes.explanation }>{ explanation }</div>
        }
        { cornerImageUrl &&
          <img
            className={ classes.cornerImage }
            src={ cornerImageUrl }
          />
        }
        { isCodeExample && explanation &&
          <div className={ classes.exampleLabel }>Code Example</div>
        }
        <div
          id='bubbleContent'
          className={ cns(classes.bubbleContent, { [classes.isCodeExample]: isCodeExample }) }
          dangerouslySetInnerHTML={ { __html: htmlContent } }
        />
      </div>
    </Paper>
  )
}

export default withStyles(styles, { withTheme: true })(SpeechBubble)
