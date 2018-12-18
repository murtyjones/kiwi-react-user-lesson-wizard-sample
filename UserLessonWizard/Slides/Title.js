import React, { PureComponent } from 'react'
import * as T from 'prop-types'
import cns from 'classnames'
import { slideContentFlexibleHeight } from './commonSlideStyles'

const styles = {
  container: {
    width: '600px'
    , height: '600px'
    , position: 'absolute'
    , top: '50%'
    , left: '50%'
    , marginLeft: '-300px'
    , marginTop: '-300px'
  },
  titleContainer: {
    height: '60%'
    , width: '80%'
    , position: 'absolute'
    , top: '50%'
    , marginTop: '-30%'
    , left: '50%'
    , marginLeft: 'calc(-40% - 50px)' // offsets the paddingLeft of 50px in commonSlideStyles
  },
  title: {
    textAlign: 'center'
    , fontWeight: 'bold'
    , fontSize: '24pt'
    , fontFamily: 'Arvo'
    , marginTop: '20px'
  },
  subtitle: {
    textAlign: 'center'
    , fontSize: '17pt'
    , marginBottom: '20px'
    , fontFamily: 'Arvo'
  },
  iconContainer: {
    textAlign: 'center'
  },
  icon: {
    height: '100px'
    , width: '100px'
  }
}

class Title extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    slideData: T.object
    , className: T.string
  }

  render() {
    const { slideData, className, globalColors } = this.props

    return (
      <div className={ className } style={ styles.container }>
        <div
          style={ {
            ...slideContentFlexibleHeight
            , ...styles.titleContainer
          } }
        >
          <div
            key='icon'
            id='icon'
            style={ styles.iconContainer }
          >
            <img src={ slideData.iconUrl } style={ styles.icon }/>
          </div>
          <div
            key='title'
            id='title'
            style={ {
              ...styles.title
              , color: globalColors.textColor
            } }
          >
            { slideData.title }
          </div>
          <div
            key='subtitle'
            id='subtitle'
            style={ {
              ...styles.subtitle
              , color: globalColors.textColor
            } }
          >
            { slideData.subtitle }
          </div>
        </div>
      </div>
    )
  }
}

export default Title
