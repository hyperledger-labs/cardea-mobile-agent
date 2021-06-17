import React, {useState, useEffect} from 'react'

import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'

import {Link} from 'react-router-native'

import AppHeaderLarge from '../AppHeaderLarge/index.js'
import LoadingOverlay from '../LoadingOverlay/index.js'

import Images from '@assets/images'
import AppStyles from '@assets/styles'
import Styles from './styles'

function Navbar(props) {
  return (
    <View style={Styles.navView}>
      <Link
        style={Styles.navButton}
        component={TouchableOpacity}
        to="/contacts">
        <Image source={Images.navContacts} style={{width: 22, height: 28}} />
        <Text style={[Styles.textSmall, AppStyles.textUpper]}>Contacts</Text>
      </Link>
      <Link
        style={Styles.navButton}
        component={TouchableOpacity}
        to="/workflow/connect">
        <Image source={Images.menu} style={{width: 36, height: 20, top: 6}} />
      </Link>
      <Link
        style={Styles.navButton}
        component={TouchableOpacity}
        to="/credentials">
        <Image source={Images.navCredentials} style={{width: 32, height: 28}} />
        <Text style={[Styles.textSmall, AppStyles.textUpper]}>Credentials</Text>
      </Link>
    </View>
  )
}

export default Navbar
