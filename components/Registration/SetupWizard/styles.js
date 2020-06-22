import {Dimensions, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  dotContainer: {
    alignItems: 'center',
    paddingVertical: 5,
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  dot: {
    borderRadius: 18,
    width: 20,
    height: 20,
    borderWidth: 1.9,
    borderColor: '#faa220',
    marginHorizontal: 8,
  },
  dotFilled: {
    backgroundColor: '#faa220',
  },
  dotSmall: {
    width: 10,
    height: 10,
  },
  dotHidden: {
    display: 'none',
  },
  dotArrow: {
    height: 20,
    width: 17.6,
  },
})

export default styles
