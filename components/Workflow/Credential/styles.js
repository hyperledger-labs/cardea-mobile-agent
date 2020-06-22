import React from 'react'

import {StyleSheet} from 'react-native'

const Styles = StyleSheet.create({
  tabView: {
    paddingHorizontal: '7%',
    paddingTop: '10%',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  icon: {
    fontSize: 26,
    top: 10,
  },
  buttonText: {
    maxWidth: 135,
    // flexWrap: 'wrap',
    textAlign: 'right',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: -10,
    top: 40,
  },
  buttonIcon: {
    width: 150,
    height: 78,
  },
})

export default Styles
