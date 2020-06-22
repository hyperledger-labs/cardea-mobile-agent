import React, {useState, useEffect, useContext} from 'react'

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

import {parseSchema, formatDate} from '../../utils/'

import {ErrorsContext} from '../Errors/index.js'

import AppStyles from '@assets/styles'
import Images from '@assets/images.js'
import credentialConfigs from '@configs/credentialConfigs.js'

function CurrentCredential(props) {
  let history = useHistory()

  const mapAttributes = () => {
    return Object.entries(props.credential.attributes).map((curr, i) => {
      if (!curr[1]) {
        return null
      }
      let attr = formatDate(curr[1])
      return (
        <View
          style={[
            AppStyles.tableItem,
            AppStyles.infoTableItem,
            AppStyles.subTableItem,
          ]}>
          <View>
            <Text style={[{fontSize: 18}, AppStyles.textWhite]}>
              <Text
                style={[
                  props.altColor ? AppStyles.textGray : AppStyles.textLightGray,
                  {textTransform: 'capitalize'},
                ]}>
                {curr[0].replace(/_/g, ' ')}:{' '}
              </Text>
              {attr}
            </Text>
          </View>
        </View>
      )
    })
  }

  return (
    <View style={AppStyles.viewOverlay}>
      <View
        style={[
          AppStyles.credView,
          props.altColor
            ? AppStyles.grayBackground
            : AppStyles.secondaryBackground,
        ]}>
        <TouchableOpacity
          style={AppStyles.marginBottomSm}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => props.setViewCredential(false)}>
          <Image source={Images.arrowDown} style={AppStyles.arrow} />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          style={AppStyles.scrollView}>
          {props.altColor ? null : (
            <Image
              source={Images.credentialLarge}
              style={[AppStyles.credential, AppStyles.marginBottomSm]}
            />
          )}
          {props.credential ? (
            <>
              <View
                style={[
                  AppStyles.tableItem,
                  AppStyles.infoTableItem,
                  props.altColor
                    ? AppStyles.secondaryBackground
                    : AppStyles.grayBackground,
                ]}>
                <View style={{display: 'flex', flex: 1, left: -30}}>
                  <Text
                    style={[
                      {fontSize: 18},
                      AppStyles.textWhite,
                      AppStyles.textCenter,
                    ]}>
                    {props.credential.credentialName
                      ? props.credential.credentialName
                      : parseSchema(props.credential.schemaId)}
                  </Text>
                  <Text
                    style={[
                      {fontSize: 14},
                      AppStyles.textWhite,
                      AppStyles.textCenter,
                    ]}>
                    {props.credential.connection
                      ? props.credential.connection.name
                      : null}
                  </Text>
                </View>
              </View>
              {mapAttributes()}
            </>
          ) : null}
        </ScrollView>
      </View>
    </View>
  )
}

export default CurrentCredential
