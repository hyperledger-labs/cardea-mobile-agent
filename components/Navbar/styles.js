import React from 'react'

import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  navView: {
    width: '100%',
    paddingHorizontal: '10%',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#f4c994',
    padding: 20,
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
    width: '33%',
  },
  textSmall: {
    fontSize: 10,
  },
})

export default styles
