import React, { Component, Fragment } from 'react'
import * as T from 'prop-types'
import { Field, FieldArray, reduxForm, change, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import withStyles from '@material-ui/core/styles/withStyles'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import cns from 'classnames'

import { isPrevDisabled, isNextDisabled, isFinalSlide, hasSuccessCriteria } from '../utils/lessonWizardUtils'
import { LESSON_SLIDE_TYPES } from '../constants'
import ActionBar from './ActionBar'
import CustomSlideBackground from './CustomSlideBackground'
import ResultCard from '../common/ResultCard/ResultCard'
import isNumeric from '../utils/isNumeric'

// import slides
import FullPageText from './Slides/FullPageText'
import FullPageCodeEditor from './Slides/FullPageCodeEditor'
import FullPageCodeExample from './Slides/FullPageCodeExample'
import Title from './Slides/Title'
import MultipleChoice from './Slides/MultipleChoice'
import Narration from './Slides/Narration'

import './overrides.css'

const formName = 'userLesson'

const styles = theme => ({
  lessonWizardForm: {
    height: 'calc(100% - 60px)' // 60px for action bar
    , overflow: 'auto'
    , position: 'absolute'
    , top: 0
    , zIndex: 502
  },
  generalSlide: {
    width: 1050,
    marginLeft: -525,
    left: '50%'
  },
  fullPageCodeSlide: {
    width: 1300,
    marginLeft: -650,
    left: '50%'
  },
})


const availableSlideTypes = classes => ({
  [LESSON_SLIDE_TYPES.FULL_PAGE_TEXT]: {
    component: FullPageText,
    className: classes.generalSlide
  },
  [LESSON_SLIDE_TYPES.NARRATION]: {
    component: Narration,
    className: classes.generalSlide
  },
  [LESSON_SLIDE_TYPES.FULL_PAGE_CODE_EXAMPLE]: {
    component: FullPageCodeExample,
    className: classes.generalSlide
  },
  [LESSON_SLIDE_TYPES.FULL_PAGE_CODE_EDITOR]: {
    component: FullPageCodeEditor,
    className: classes.fullPageCodeSlide,
    includeRunButton: true
  },
  [LESSON_SLIDE_TYPES.TITLE]: {
    component: Title,
    className: classes.generalSlide
  },
  [LESSON_SLIDE_TYPES.MULTIPLE_CHOICE]: {
    component: MultipleChoice,
    className: classes.generalSlide
  }
})

class UserLessonWizardForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSlideObject: null
      , prevDisabled: null
      , nextDisabled: null
      , isFinal: null
      , runCode: false
      , codeRanAtLeastOnce: false
      , showResultCard: false
      , checkAnswer: false
    }
  }

  static propTypes = {
    onSubmit: T.func.isRequired
    , activeSlideIndex: T.number.isRequired
    , lesson: T.object.isRequired
    , globalColors: T.object.isRequired
    , formValues: T.object.isRequired
    , goToNextSlide: T.func.isRequired
    , goToPrevSlide: T.func.isRequired
    , handleSubmit: T.func.isRequired
    , dispatch: T.func.isRequired
    , onFinalSlideNextClick: T.func.isRequired
    , isFetchingUserLessons: T.bool.isRequired
    , variablesWithUserValues: T.array.isRequired
  }

  UNSAFE_componentWillMount() {
    const { lesson, activeSlideIndex, formValues, isFetchingUserLessons } = this.props
    this.setActiveSlideObject(activeSlideIndex, lesson)
    this.setPrevDisabled(activeSlideIndex, lesson)
    this.setNextDisabled(activeSlideIndex, lesson, isFetchingUserLessons, formValues)
    this.setIsFinal(activeSlideIndex, lesson)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const lessonHasChanged = !isEqual(nextProps.lesson, this.props.lesson)
      , activeSlideIndexHasChanged = !isEqual(nextProps.activeSlideIndex, this.props.activeSlideIndex)
      , isFetchingUserLessonsHasChanged = !isEqual(nextProps.isFetchingUserLessons, this.props.isFetchingUserLessons)
      , formValuesHasChanged = !isEqual(nextProps.formValues, this.props.formValues)

    if (lessonHasChanged || activeSlideIndexHasChanged) {
      this.setActiveSlideObject(nextProps.activeSlideIndex, nextProps.lesson)
      this.setIsFinal(nextProps.activeSlideIndex, nextProps.lesson)
      this.setPrevDisabled(nextProps.activeSlideIndex, nextProps.lesson)
      this.setRunCode(false)
    }

    if (lessonHasChanged || activeSlideIndexHasChanged || isFetchingUserLessonsHasChanged || formValuesHasChanged) {
      this.setNextDisabled(nextProps.activeSlideIndex, nextProps.lesson, nextProps.isFetchingUserLessons, nextProps.formValues)
    }
  }

  async UNSAFE_componentWillUpdate(nextProps, nextState) {
    const slideCurrentValues = get(nextProps.formValues, `answerData[${nextProps.activeSlideIndex}]`)
    const slideOldValues = get(this.props.formValues, `answerData[${nextProps.activeSlideIndex}]`)
    const slideHasUpdated = slideCurrentValues.updatedAt !== slideOldValues.updatedAt
    const codeHasRun = !nextState.runCode && this.state.runCode
    const noCodeRunNeeded = !nextState.runCode && !this.state.runCode

    // if an answer was graded, show the result
    if (nextState.checkAnswer && slideHasUpdated) {
      this.setState({ checkAnswer: false, showResultCard: true })
    }

    // if an answer needs to be graded and code editor has run the code,
    // submit current values and switch off submit current values
    if (nextState.checkAnswer && nextState.submitCurrentValues && (codeHasRun || noCodeRunNeeded)) {
      nextProps.onSubmit(nextProps.formValues)
      this.setState({ submitCurrentValues: false, showResultCard: false })
    }

    if (nextProps.activeSlideIndex !== this.props.activeSlideIndex) {
      await this.setStateAsync({ showResultCard: false })
    }
  }

  setActiveSlideObject = (activeSlideIndex, lesson) =>
    this.setState({ activeSlideObject: lesson.slides[activeSlideIndex] })

  setPrevDisabled = (activeSlideIndex, lesson) =>
    this.setState({ prevDisabled: isPrevDisabled(activeSlideIndex, lesson) })

  setNextDisabled = (...args) =>
    this.setState({ nextDisabled: isNextDisabled(...args) })

  setIsFinal = (activeSlideIndex, lesson) =>
    this.setState({ isFinal: isFinalSlide(activeSlideIndex, lesson) })

  setRunCode = async flag => {
    // have to flip 'runCode' to false, because
    // if the user presses 'Run Code' while the
    // code editor is already running, we want
    // to restart it again, and the only way to
    // do that is to change the props received
    // by the CodeEditor component.
    await this.setStateAsync({ runCode: false })
    await this.setStateAsync({ runCode: flag })
  }

  setCodeOutput = (ref, codeOutput) =>
    this.props.dispatch(change(formName, `${ref}.codeOutput`, codeOutput))

  setFormGlobalVariable = (ref, { variableId, value }) => {
    this.props.dispatch(change(formName, `${ref}.variableId`, variableId))
    this.props.dispatch(change(formName, `${ref}.value`, value))
  }

  onPrev = () => {
    const { goToPrevSlide } = this.props
    goToPrevSlide()
  }

  setStateAsync = newState => new Promise((resolve) => {
    this.setState(newState, resolve)
  })

  onNext = async () => {
    const formValues = this.addIsViewedToActiveSlide(this.props.formValues)
    this.props.goToNextSlide()
    this.props.onSubmit(formValues)
    this.setState({
      showResultCard: false,
      submitCurrentValues: false,
      checkAnswer: false,
      codeRanAtLeastOnce: false
    })
  }

  onFinalNext = async () => {
    const formValues = this.addIsViewedToActiveSlide(this.props.formValues)
    this.props.onSubmit(formValues)
    this.props.onFinalSlideNextClick()
    this.setState({
      showResultCard: false,
      submitCurrentValues: false,
      checkAnswer: false,
      codeRanAtLeastOnce: false
    })
  }

  addIsViewedToActiveSlide = formValues => {
    const { activeSlideIndex } = this.props
    const formValuesCopy = cloneDeep(formValues)
    formValuesCopy.answerData[activeSlideIndex].isViewed = true
    return formValuesCopy
  }

  renderSlide = ({ fields }) => {
    // this method should be kept outside of
    // the render method! otherwise child
    // components will remount on each rendering!
    const { activeSlideIndex, globalColors, variablesWithUserValues, formValues, lesson, classes } = this.props
      , { activeSlideObject, runCode } = this.state
      , slideTypeObject = availableSlideTypes(classes)[activeSlideObject.type]
      , ActiveSlideComponent = slideTypeObject.component
      , includeRunButton = slideTypeObject.includeRunButton
      , slideAnswerData = get(formValues, `answerData[${activeSlideIndex}]`, {})

    return fields.map((ref, i) =>
      i === activeSlideIndex
        ? (
          <Field
            key={ `${ref}.answer` }
            name={ `${ref}.answer` }
            component={ ActiveSlideComponent }
            runCode={ runCode }
            afterRunCode={ async (err, codeOutput) => {
              this.setRunCode(false)
              await this.setStateAsync({ showResultCard: false, codeRanAtLeastOnce: true })
              if (!err) this.setCodeOutput(ref, codeOutput)
            } }
            className='lessonWizardFormContent'
            globalColors={ globalColors }
            slideData={ activeSlideObject }
            setFormGlobalVariable={ (varRef, v) =>
              this.setFormGlobalVariable(`${ref}.${varRef}`, v)
            }
            variablesWithUserValues={ variablesWithUserValues }
            slideAnswerData={ slideAnswerData }
            onRunCode={ includeRunButton ? () => this.setRunCode(true) : null }
            formValues={ formValues }
            lesson={ lesson }
          />
        ) : null
    )
  }

  render() {
    const { classes, handleSubmit, globalColors, activeSlideIndex, formValues } = this.props
      , { activeSlideObject, prevDisabled, nextDisabled, isFinal, runCode, showResultCard, codeRanAtLeastOnce } = this.state
      , slideTypeObject = availableSlideTypes(classes)[activeSlideObject.type]
      , className = slideTypeObject.className
      , includesSuccessCriteria = hasSuccessCriteria(activeSlideObject)
      , onPrevClick = !prevDisabled ? this.onPrev : null
      , onNextClick = !nextDisabled ? isFinal ? this.onFinalNext : this.onNext : null
      , slideAnswerData = get(formValues, `answerData[${activeSlideIndex}]`, {})
      , hasBeenAnswered = codeRanAtLeastOnce || isNumeric(slideAnswerData.answer) // for multiple choice slides

    return (
      <Fragment>
        <ResultCard
          slideAnswerData={ slideAnswerData }
          currentLessonSlide={ activeSlideObject }
          showResultCard={ showResultCard }
          toggleShowResultCard={ () => this.setState({ showResultCard: false }) }
        />
        <ActionBar
          onPrevClick={ onPrevClick }
          onNextClick={ onNextClick }
          includesSuccessCriteria={ includesSuccessCriteria }
          onCheckAnswer={ includesSuccessCriteria && hasBeenAnswered
            ? () => this.setState({
              checkAnswer: true, submitCurrentValues: true
            }) : null }
          globalColors={ globalColors }
          slideAnswerData={ slideAnswerData }
        />
        <form
          id='lessonWizardForm'
          className={ cns(classes.lessonWizardForm, className) }
          onSubmit={ handleSubmit }
        >
          <FieldArray
            name='answerData'
            component={ this.renderSlide }
            // this line is needed so that child components
            // update when run code is set to true
            runCode={ runCode }
          />
        </form>
        { activeSlideObject.backgroundImageUrl &&
          <CustomSlideBackground src={ activeSlideObject.backgroundImageUrl } />
        }
      </Fragment>
    )
  }
}


UserLessonWizardForm = connect(
  state => ({
    formValues: getFormValues(formName)(state)
  })
)(UserLessonWizardForm)

UserLessonWizardForm = reduxForm({
  form: formName
  , destroyOnUnmount: false
  , forceUnregisterOnUnmount: true
  , enableReinitialize: true
})(UserLessonWizardForm)

export default withStyles(styles, { withTheme: true })(UserLessonWizardForm)
