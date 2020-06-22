import React from 'react'

import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  settingView: {
    alignItems: 'center',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingTop: 20,
    height: '100%',
  },
  checkbox: {
    width: 35,
    height: 35,
    backgroundColor: '#ddd',
    borderColor: '#0A1C40',
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
  },
  checkmark: {
    width: 35,
    height: 35,
  },
  checktext: {
    justifyContent: 'center',
    fontSize: 18,
    textAlign: 'center',
  },
})

export default styles
