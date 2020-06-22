import React, {useEffect} from 'react'

import {
  Dimensions,
  Keyboard,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  UIManager,
  Animated,
} from 'react-native'

import Styles from './styles'

function CustomKeyboardAvoidingView(props) {
  const keyboardHeight = new Animated.Value(0)

  const getFocusedNode = () => {
    let node
    if (typeof TextInput.State.currentlyFocusedField === 'function') {
      node = TextInput.State.currentlyFocusedField()
    } else {
      node = TextInput.State.currentlyFocusedInput()
    }
    return node
  }

  const keyboardShowListener = (event) => {
    let node = getFocusedNode()
    const keyHeight = event.endCoordinates.height
    const windowHeight = Dimensions.get('window').height
    UIManager.measure(node, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height
      const fieldTop = pageY
      let gap =
        windowHeight - keyHeight - (fieldTop + fieldHeight) - props.offset
      console.log('gap', gap)
      if (gap >= 0) {
        return
      }
      gap *= -1
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: Platform.OS === 'ios' ? gap : props.offset,
      }).start()
    })
  }

  const keyboardHideListener = (event) => {
    Animated.timing(keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start()
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardShowListener)
    Keyboard.addListener('keyboardDidHide', keyboardHideListener)
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardShowListener)
      Keyboard.removeListener('keyboardDidHide', keyboardHideListener)
    }
  })

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={Styles.touchable}>
      <Animated.View style={[Styles.container, {bottom: keyboardHeight}]}>
        {props.children}
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

CustomKeyboardAvoidingView.defaultProps = {
  offset: 30,
}

export default CustomKeyboardAvoidingView
