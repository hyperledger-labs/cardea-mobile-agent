import React from 'react'

import {StyleSheet} from 'react-native'

const Styles = StyleSheet.create({
  msgView: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    display: 'flex',
  },
  innerView: {
    width: '100%',
    height: '83%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  msgText: {
    fontSize: 18,
    textAlign: 'center',
  },
})

export default Styles
