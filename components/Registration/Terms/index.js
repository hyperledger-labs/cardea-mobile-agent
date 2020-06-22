import React, {useState, useEffect} from 'react'

import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native'

import NextButton from '../NextButton'
import Markdown, {MarkdownIt} from 'react-native-markdown-display'

import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'

import AppStyles from '@assets/styles'
import Images from '@assets/images'
import Styles from './styles'

function Terms(props) {
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)

  const [isChecked, setIsChecked] = useState(false)

  //Next Button Mechanisms
  const [nextButtonActive, setNextButtonActive] = useState(false)

  //Continue Condition
  useEffect(() => {
    setNextButtonActive(isChecked)
  }, [isChecked])

  const proceedCall = () => {
    //Component pre-continue checks

    props.incrementScreen()
  }

  return (
    <View style={AppStyles.viewFull}>
      <AppHeaderLarge disabled={true} />
      <View style={AppStyles.tab}>
        <Text
          style={[
            AppStyles.h2,
            AppStyles.textPrimary,
            AppStyles.textUpper,
            Styles.title,
          ]}>
          {props.title}
        </Text>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={Styles.message}>
          <View onStartShouldSetResponder={() => true}>
            <Markdown
              onStartShouldSetResponder={() => true}
              markdownit={MarkdownIt({
                typographer: true,
              }).disable(['image'])}>
              {props.message}
            </Markdown>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{width: '80%'}}
          hitSlop={{top: 20, bottom: 0, left: 10, right: 10}}
          onPress={() => {
            setIsChecked((previousState) => !previousState)
          }}>
          <View style={Styles.checkContainer}>
            <View style={Styles.checkbox}>
              {isChecked ? (
                <Image source={Images.checkmark} style={Styles.checkmark} />
              ) : null}
            </View>
            <Text style={Styles.checktext}>
              I have read and agree to the{'\n'}
              {props.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <NextButton active={nextButtonActive} continue={proceedCall} />
      {loadingOverlayVisible ? <LoadingOverlay /> : null}
    </View>
  )
}

export default Terms
