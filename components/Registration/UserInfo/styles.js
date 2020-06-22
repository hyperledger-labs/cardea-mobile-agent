import React from 'react'

import {Dimensions, StyleSheet} from 'react-native'
import {normalize} from '../../../utils/sizing'
let ScreenWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  datePicker: {
    height: 250,
    width: ScreenWidth,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  opaqueScreen: {
    height: '120%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '53%',
  },
  pickerText: {
    fontSize: normalize(16.5),
    paddingTop: 12,
    paddingLeft: 8,
    color: 'rgba(0,0,0,0.16)',
  },
  picker: {
    backgroundColor: '#ededed',
    width: '58%',
    height: 46,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 18,
  },
  pickerView: {
    width: '58%',
    height: 46,
    display: 'flex',
    top: 2,
  },
  confirmButton: {
    height: 64,
    width: '50%',
    alignSelf: 'center',
  },
})

export default styles
