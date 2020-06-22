import React from 'react'

import {Dimensions, StyleSheet} from 'react-native'
import {normalize} from '../../../../utils/sizing'

let ScreenWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  datePicker: {
    height: 250,
    width: ScreenWidth,
    backgroundColor: '#fff',
    top: '34%',
  },
  opaqueScreen: {
    height: '120%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
  },
  pickerText: {
    fontSize: normalize(16.5),
    paddingTop: 12,
    paddingLeft: 8,
    color: 'rgba(0,0,0,0.18)',
  },
  picker: {
    backgroundColor: '#ededed',
    width: '58%',
    height: 46,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default styles
