import React from 'react'

import {StyleSheet, Dimensions} from 'react-native'
import AppStyles from '@assets/styles'

const Styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: Dimensions.get('window').width,
    textAlign: 'center',
  },
  label: {
    backgroundColor: AppStyles.secondaryBackground.backgroundColor,
    color: 'white',
    width: '100%',
    margin: 0,
    textAlign: 'center',
    fontSize: 25,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    // backgroundColor: 'white',
    marginTop: 18,
    height: 80,
    color: 'white',
    justifyContent: 'space-around',
  },
  confirm: {
    backgroundColor: AppStyles.secondaryBackground.backgroundColor,
  },
  deny: {
    backgroundColor: AppStyles.grayBackground.backgroundColor,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonSub: {
    fontSize: 10,
  },
})

export default Styles
