import React from 'react'

import {StyleSheet} from 'react-native'

const Styles = StyleSheet.create({
  header: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBorder: {
    borderBottomWidth: 3,
    borderColor: '#0A1C40',
  },
  logoIconBox: {
    alignItems: 'center',
    height: 150,
    width: '100%',
    marginTop: '5.5%',
  },
  logoIcon: {
    position: 'absolute',
    zIndex: 10,
    width: 150,
    height: 146,
    paddingVertical: 17,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#FCB249',
    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
  },
  logoLine: {
    position: 'absolute',
    zIndex: 5,
    top: 65,
    width: '100%',
    height: 1,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderColor: '#407AD4',
  },
})

export default Styles
