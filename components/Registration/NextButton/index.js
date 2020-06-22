import React from 'react'

import {Keyboard, Image, Text, TouchableOpacity, View} from 'react-native'

import AppStyles from '@assets/styles'
import Images from '@assets/images'
import Styles from './styles'

export default function NextButton(props) {
  return (
    <View style={Styles.nextContainer}>
      <TouchableOpacity
        style={[AppStyles.button, {flexDirection: 'row'}]}
        disabled={!props.active}
        onPress={() => {
          Keyboard.dismiss()
          props.continue()
        }}>
        <Text
          style={[
            AppStyles.h2,
            AppStyles.textUpper,
            !props.active ? {color: '#bbb'} : AppStyles.textPrimary,
          ]}>
          Next
        </Text>
        <View style={{width: 44}}>
          {!props.active ? null : (
            <Image source={Images.arrow} style={{marginLeft: 20}} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}
