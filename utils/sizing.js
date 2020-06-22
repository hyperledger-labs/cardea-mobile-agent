import {Dimensions, Platform, PixelRatio} from 'react-native'
export const normalize = (size) => {
  const {width} = Dimensions.get('window')
  const scale = width / 411.42857142857144 //1440 width screen

  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}
