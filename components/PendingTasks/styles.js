import React from 'react'

import {StyleSheet} from 'react-native'

const Styles = StyleSheet.create({
  viewFull: {
    height: '30%',
    width: '80%',
    alignItems: 'center',
  },
  redBar: {
    backgroundColor: '#C64A35',
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  itemBox: {
    width: '33%',
    height: 70,
    margin: 5,
    marginTop: 20,
    padding: 5,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#F2C054',
  },
  emptyBox: {
    height: 70,
    margin: 5,
    marginTop: 20,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#E4E4E4',
  },
})

export default Styles
