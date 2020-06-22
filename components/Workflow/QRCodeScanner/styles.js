import React from 'react'

import {Dimensions, StyleSheet} from 'react-native'

// setting camera dimensions based on width of screen
let CameraWidth = 0.9 * Dimensions.get('window').width

const styles = StyleSheet.create({
  header: {
    height: '28%',
    justifyContent: 'center',
  },
  camera: {
    top: 0,
    width: CameraWidth,
    height: CameraWidth,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#0A1C40',
    borderRadius: 3,
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  heading: {
    paddingBottom: 10,
    textAlign: 'center',
    fontSize: 25,
  },
  container: {
    flex: 1,
  },
  spinnerContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    textAlign: 'center',
  },
  spinnerText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 25,
    paddingTop: 25,
  },
})

export default styles
