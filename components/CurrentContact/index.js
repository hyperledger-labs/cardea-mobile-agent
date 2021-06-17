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

import {ErrorsContext} from '../Errors/index.js'

import AppStyles from '@assets/styles'
import Images from '@assets/images.js'

function CurrentContact(props) {
  let history = useHistory()

  return (
    <View style={AppStyles.viewOverlay}>
      <View style={[AppStyles.credView, AppStyles.tertiaryBackground]}>
        <TouchableOpacity
          style={AppStyles.marginBottomSm}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => props.setViewContact(false)}>
          <Image source={Images.arrowDown} style={AppStyles.arrow} />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          style={AppStyles.scrollView}>
          {props.altColor ? null : (
            <Image
              source={Images.contact}
              style={[AppStyles.contact, AppStyles.marginBottomMd]}
            />
          )}
          {props.contact ? (
            <>
              <View
                style={[
                  AppStyles.tableItem,
                  AppStyles.infoTableItem,
                  AppStyles.tableBottomBorder,
                ]}>
                <View style={{display: 'flex', flex: 1, left: -30}}>
                  <Text
                    style={[
                      {fontSize: 18},
                      AppStyles.textWhite,
                      AppStyles.textUpper,
                      AppStyles.textCenter,
                    ]}>
                    {props.contact.name}
                  </Text>
                  <Text
                    style={[
                      {fontSize: 14},
                      AppStyles.textWhite,
                      AppStyles.textCenter,
                    ]}>
                    {props.contact.state && props.contact.city
                      ? props.contact.city + ', ' + props.contact.state
                      : null}
                  </Text>
                </View>
              </View>
              {props.contact.data ? (
                <>
                  <View
                    style={[
                      AppStyles.tableItem,
                      AppStyles.infoTableItem,
                      AppStyles.subTableItem,
                    ]}>
                    <View>
                      <Text style={[{fontSize: 18}, AppStyles.textWhite]}>
                        {props.contact.street}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      AppStyles.tableItem,
                      AppStyles.infoTableItem,
                      AppStyles.subTableItem,
                    ]}>
                    <View>
                      <Text style={[{fontSize: 18}, AppStyles.textWhite]}>
                        {props.contact.city ? props.contact.city + ', ' : null}
                        {props.contact.country}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      AppStyles.tableItem,
                      AppStyles.infoTableItem,
                      AppStyles.subTableItem,
                    ]}>
                    <View>
                      <Text style={[{fontSize: 18}, AppStyles.textWhite]}>
                        {props.contact.phone}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      AppStyles.tableItem,
                      AppStyles.infoTableItem,
                      AppStyles.subTableItem,
                    ]}>
                    <View>
                      <Text style={[{fontSize: 18}, AppStyles.textWhite]}>
                        {props.contact.email}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <View
                  style={[
                    AppStyles.tableItem,
                    AppStyles.infoTableItem,
                    AppStyles.subTableItem,
                  ]}>
                  <View>
                    <Text style={[{fontSize: 18}, AppStyles.textWhite]}>
                      No contact information
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

export default CurrentContact
