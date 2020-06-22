import React from 'react'
import {Dimensions} from 'react-native'
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  camera: {
    top: 0,
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#707070',
    borderRadius: 25,
    overflow: 'hidden',
  },
  camContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: '100%',
    height: (Dimensions.get('window').width - 10) * 0.6,
    maxHeight: 300,
    maxWidth: 500,
  },
})

export default styles
