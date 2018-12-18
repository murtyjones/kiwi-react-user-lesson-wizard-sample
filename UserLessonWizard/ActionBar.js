import React, { Component } from 'react'
import cns from 'classnames'
import has from 'lodash/has'

const styles = {
  button: {
    fontFamily: 'Roboto'
    , fontSize: '12pt'
    , display: 'inline-block'
    , position: 'absolute'
    , width: '140px'
    , height: '40px'
    , top: '11px'
    , borderRadius: '98px'
    , textAlign: 'center'
    , WebkitTextAlign: 'center'
    , fontWeight: 'bold'
    , lineHeight: '40px'
    , border: 'none'
  },
  prevButton: {
    left: '20px'
    , color: '#FFFFFF'
    , backgroundColor: '#FFFFFF'
  },
  nextButton: {
    right: '20px'
    , color: '#FFFFFF'
    , backgroundColor: '#FFFFFF'
  },
  runCodeButton: {
    left: '50%'
    , marginLeft: '-140px'
  },
  checkAnswerButton: {
    right: '200px'
  }
}

export const PrevButton = ({ onPrevClick, globalColors }) =>
  <button
    type='button' // don't submit
    key='prevButton'
    id='prevButton'
    className={ cns('prevButton', { 'disabled': !onPrevClick }) }
    style={ {
      ...styles.button
      , ...styles.prevButton
      , backgroundColor: globalColors.textColor
      , color: globalColors.primaryColor
      , cursor: onPrevClick ? 'pointer' : 'default'
    } }
    onClick={ onPrevClick }
  >
    Previous
  </button>

export const NextButton = ({ onNextClick, globalColors }) =>
  <button
    key='nextButton'
    id='nextButton'
    className={ cns('nextButton', { 'disabled': !onNextClick }) }
    style={ {
      ...styles.button
      , ...styles.nextButton
      , backgroundColor: globalColors.textColor
      , color: globalColors.primaryColor
      , cursor: onNextClick ? 'pointer' : 'default'
    } }
    onClick={ onNextClick }
  >
    Next
  </button>


export const CheckAnswerButton = ({ onClick }) =>
  <button
    key='checkAnswerButton'
    id='checkAnswerButton'
    className={ cns('checkAnswerButton', { 'disabled': !onClick }) }
    style={ {
      ...styles.button
      , ...styles.checkAnswerButton
      , cursor: onClick ? 'pointer': 'default'
    } }
    onClick={ onClick }
  >
    Check Answer
  </button>


const ActionBar = ({ onCheckAnswer, onPrevClick, onNextClick, globalColors, includesSuccessCriteria, slideAnswerData = {} }) => {
  let onCheckAnswerClick = has(slideAnswerData, 'answer') && onCheckAnswer ? onCheckAnswer : null

  return (
    <div
      className='actionBar'
      style={ { backgroundColor: globalColors.primaryColor } }
    >
      { onPrevClick &&
        <PrevButton onPrevClick={ onPrevClick } globalColors={ globalColors } />
      }
      { includesSuccessCriteria &&
        <CheckAnswerButton onClick={ onCheckAnswerClick } />
      }
      <NextButton onNextClick={ onNextClick } globalColors={ globalColors } />
    </div>
  )
}

export default ActionBar
