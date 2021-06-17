import React from 'react'

import {StyleSheet, Dimensions} from 'react-native'

const styles = StyleSheet.create({
  camContainer: {
    justifyContent: 'center',
    padding: 5,
    width: '100%',
    height: (Dimensions.get('window').width - 10) * 0.6,
    maxHeight: 300,
    maxWidth: 500,
    marginVertical: 20,
  },
  imgContainer: {
    flex: 1,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#707070',
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    display: 'flex',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
  },
})

export default styles
