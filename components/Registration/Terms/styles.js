import React from 'react'

import {StyleSheet} from 'react-native'
import {normalize} from '../../../utils/sizing'

const styles = StyleSheet.create({
  title: {
    top: -28,
  },
  message: {
    backgroundColor: '#eee',
    width: '80%',
    maxHeight: '50%',
    top: -20,
  },
  messageFill: {
    padding: 20,
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
    width: '140%',
    height: '140%',
    bottom: '20%',
  },
  checktext: {
    justifyContent: 'center',
    fontSize: normalize(18),
    textAlign: 'center',
  },
  checkContainer: {
    backgroundColor: '#eee',
    padding: 12,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 4,
    width: '100%',
    height: 66,
    alignItems: 'center',
  },
  nextButton: {
    top: 15,
  },
})

export default styles
