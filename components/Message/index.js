import React, {useState, useEffect} from 'react'

import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {useHistory} from 'react-router-native'

import AppHeaderLarge from '../AppHeaderLarge/index.js'
import LoadingOverlay from '../LoadingOverlay/index.js'

import Images from '@assets/images'
import AppStyles from '@assets/styles'
import Styles from './styles'

function Message(props) {
  let history = useHistory()

  return (
    <View style={[Styles.msgView, props.defaultBg ? null : AppStyles.altBg]}>
      <AppHeaderLarge alt={props.defaultBg ? false : true} />
      <View style={[Styles.innerView, props.bgColor]}>
        {props.image ? (
          <Image
            source={props.image}
            style={{
              alignSelf: 'center',
              width: 115,
              height: 115,
              resizeMode: 'contain',
            }}
          />
        ) : null}
        {props.title ? (
          <Text
            style={[
              AppStyles.h2,
              AppStyles.textBold,
              {marginTop: 25, textAlign: 'center'},
              props.textColor,
            ]}>
            {props.title}
            {'\n'}
          </Text>
        ) : null}
        {props.text ? (
          <Text style={[Styles.msgText, props.textColor]}>
            {props.text}
            {'\n'}
          </Text>
        ) : null}
        {props.path ? (
          <TouchableOpacity
            style={[
              AppStyles.button,
              AppStyles.confirmBackground,
              {marginTop: 30},
            ]}
            onPress={() => history.push(props.path)}>
            <Text style={[AppStyles.h2, AppStyles.textSecondary]}>
              Continue
            </Text>
          </TouchableOpacity>
        ) : null}
        {props.send ? (
          <TouchableOpacity
            style={[
              AppStyles.button,
              AppStyles.confirmBackground,
              {marginTop: 30},
            ]}
            onPress={() => props.sendData}>
            <Text style={[AppStyles.h2, AppStyles.textSecondary]}>
              Send Data
            </Text>
          </TouchableOpacity>
        ) : null}
        {props.children}
        {props.button ? (
          <TouchableOpacity
            style={[
              AppStyles.button,
              {
                backgroundColor: props.button.backgroundColor,
                paddingVertical: 15,
              },
            ]}
            onPress={props.button.action}>
            <Text style={[{color: props.button.textColor, fontSize: 25}]}>
              {props.button.text}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}

export default Message
