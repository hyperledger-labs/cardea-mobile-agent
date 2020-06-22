import React from 'react'

import {Dimensions, StyleSheet} from 'react-native'
import {normalize} from '../../../../utils/sizing'

let windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  datePicker: {
    height: 250,
    width: windowWidth,
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
    fontSize: normalize(18),
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
  inputAndroid: {
    fontSize: normalize(18),
    paddingTop: 12,
    paddingLeft: 8,
    width: '100%',
    padding: 0,
    textAlign: 'center',
    height: 46,
    backgroundColor: '#ededed',
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIOS: {
    fontSize: normalize(18),
    width: '100%',
    padding: 0,
    height: 46,
    backgroundColor: '#ededed',
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headlessAndroidContainer: {
    width: '100%',
  },
  viewContainer: {
    width: '100%',
  },
  placeholder: {
    fontSize: normalize(18),
    paddingTop: 12,
    paddingLeft: 8,
    color: 'black'
  },
})

export default styles
