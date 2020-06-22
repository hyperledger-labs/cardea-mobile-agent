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

import {ErrorsContext} from '../../Errors/index.js'

import AppStyles from '@assets/styles'
import Images from '@assets/images.js'

function CurrentRequest(props) {
  let history = useHistory()

  return (
    <View style={AppStyles.viewOverlay}>
      <View style={[AppStyles.credView, AppStyles.secondaryBackground]}>
        <TouchableOpacity
          style={AppStyles.marginBottomSm}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => props.setViewCredential(false)}>
          <Image source={Images.arrowDown} style={AppStyles.arrow} />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          style={AppStyles.scrollView}>
          <Image
            source={Images.credentialLarge}
            style={[AppStyles.credential, AppStyles.marginBottomSm]}
          />
          {props.credential ? (
            <>
              <View
                style={[
                  AppStyles.tableItem,
                  AppStyles.infoTableItem,
                  AppStyles.grayBackground,
                  ,
                ]}>
                <View style={{display: 'flex', flex: 1, left: -30}}>
                  <Text
                    style={[
                      {fontSize: 18},
                      AppStyles.textWhite,
                      AppStyles.textCenter,
                    ]}>
                    {props.title}
                  </Text>
                  <Text
                    style={[
                      {fontSize: 14},
                      AppStyles.textWhite,
                      AppStyles.textCenter,
                    ]}>
                    {props.credentials}
                  </Text>
                </View>
              </View>
              {props.attributes ? (
                props.attributes.map((curr, i) => {
                  if (!curr.value) {
                    return null
                  }
                  return (
                    <View
                      key={i}
                      style={[
                        AppStyles.tableItem,
                        AppStyles.infoTableItem,
                        AppStyles.subTableItem,
                      ]}>
                      <View>
                        <Text style={[{fontSize: 18}, AppStyles.textWhite]}>
                          <Text
                            style={[
                              AppStyles.textLightGray,
                              {textTransform: 'capitalize'},
                            ]}>
                            {curr.name.replace(/_/g, ' ')}:{' '}
                          </Text>
                          {curr.value}
                        </Text>
                      </View>
                    </View>
                  )
                })
              ) : (
                <View
                  key={i}
                  style={[
                    AppStyles.tableItem,
                    AppStyles.infoTableItem,
                    AppStyles.subTableItem,
                  ]}>
                  <View>
                    <Text style={[{fontSize: 18}, AppStyles.textWhite]}>
                      <Text style={AppStyles.textGray}>Loading</Text>
                    </Text>
                  </View>
                </View>
              )}
            </>
          ) : null}
        </ScrollView>
      </View>
    </View>
  )
}

export default CurrentRequest
