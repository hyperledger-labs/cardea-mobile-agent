import React from 'react'

import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  tableItem: {
    display: 'flex',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#bbb',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tableSubItem: {
    height: 50,
  },
  credView: {
    alignItems: 'center',
    paddingTop: 15,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    paddingBottom: 0,
    marginBottom: -10,
  },
})

export default styles
