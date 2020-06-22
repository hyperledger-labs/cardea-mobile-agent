import React from 'react'

import {StyleSheet} from 'react-native'

const Styles = StyleSheet.create({
  button: {
    borderWidth: 4,
    borderColor: '#faa220',
    borderRadius: 40,
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  containerContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tutorialContainer: {
    maxWidth: '80%',
    borderBottomLeftRadius: 40,
    borderTopLeftRadius: 40,
    textAlign: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingLeft: 40,
    paddingVertical: 10,
    marginVertical: 10,
  },
  tutorialText: {
    textAlign: 'center',
    fontSize: 18,
  },
  tutorialSmall: {
    fontSize: 15,
  },
})

export default Styles
