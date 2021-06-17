import {Dimensions, StyleSheet} from 'react-native'
import {normalize} from '../utils/sizing'

const primaryColor = '#000'
const secondaryColor = '#FAA220'
const tertiaryColor = '#759ECD'
const errorColor = '#BC0F00'
const confirmColor = '#6EAD82'

const ScreenHeight = Dimensions.get('window').height

const Styles = StyleSheet.create({
  primaryBackground: {
    backgroundColor: primaryColor,
  },
  secondaryBackground: {
    backgroundColor: secondaryColor,
  },
  tertiaryBackground: {
    backgroundColor: tertiaryColor,
  },
  errorBackground: {
    backgroundColor: errorColor,
  },
  confirmBackground: {
    backgroundColor: confirmColor,
  },
  textPrimary: {
    color: primaryColor,
  },
  textSecondary: {
    color: secondaryColor,
  },
  textError: {
    color: errorColor,
  },
  textConfirm: {
    color: confirmColor,
  },
  textWhite: {
    color: '#fff',
  },
  textBlue: {
    color: '#1572C6',
  },
  viewFull: {
    height: '100%',
  },
  windowFull: {
    height: ScreenHeight,
  },
  viewOverlay: {
    height: '50%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  flexView: {
    display: 'flex',
    flexDirection: 'row',
  },
  alignEnd: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  credView: {
    alignItems: 'center',
    padding: '2%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: '110%',
    paddingBottom: '10%',
    display: 'flex',
  },
  scrollView: {
    width: '104%',
  },
  h1: {
    fontSize: normalize(30),
  },
  h2: {
    fontSize: normalize(28),
  },
  h3: {
    fontSize: normalize(18),
    textAlign: 'center',
  },
  h4: {
    fontSize: normalize(24),
    marginVertical: 14,
  },
  textSmall: {
    fontSize: normalize(12),
  },
  textUpper: {
    textTransform: 'uppercase',
  },
  textGray: {
    color: '#999',
  },
  textLightGray: {
    color: '#BBBCB9',
  },
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  textBold: {
    fontWeight: 'bold',
  },
  grayLightBackground: {
    backgroundColor: '#EDEDED',
  },
  grayBackground: {
    backgroundColor: '#BCBBBB',
  },
  greenBackground: {
    backgroundColor: '#839B47',
  },
  marginBottomSm: {
    marginBottom: 15,
  },
  marginBottomMd: {
    marginBottom: 30,
  },
  marginBottomLg: {
    marginBottom: 80,
  },
  lineHeightMd: {
    lineHeight: normalize(48),
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  barBlue: {
    backgroundColor: '#AFCEEA',
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    color: '#1572C6',
  },
  pinTab: {
    alignItems: 'center',
    backgroundColor: '#f4c257',
    height: '100%',
  },
  sideMargin: {
    marginHorizontal: normalize(20),
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  formLabel: {
    height: 46,
    width: '100%',
    borderBottomWidth: 1.5,
    borderRadius: 1,
    textAlign: 'left',
    borderColor: '#707070',
    fontSize: normalize(18),
    color: '#000',
  },
  labelContainer: {
    width: '58%',
  },
  formSpace: {
    height: 16,
  },
  errorForm: {
    borderColor: errorColor,
  },
  pinLabel: {
    letterSpacing: normalize(16),
  },
  button: {
    marginVertical: 7,
    minWidth: normalize(150),
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  whiteTab: {
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: '#fff',
  },
  altBg: {
    backgroundColor: '#f4c994',
  },
  tableItem: {
    height: 70,
    width: '115%',
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoTableItem: {
    alignItems: 'center',
  },
  tableBottomBorder: {
    borderBottomWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  subTableItem: {
    height: 50,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {height: 2, width: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  arrow: {
    height: 20,
    width: 42,
  },
  info: {
    marginRight: 15,
    width: 26,
    height: 26,
  },
  credential: {
    width: 41.2,
    height: 42,
    alignSelf: 'center',
  },
  contact: {
    width: 100,
    height: 27,
    alignSelf: 'center',
  },
  rotate90: {
    transform: [{rotate: '90deg'}],
  },
  rotate180: {
    transform: [{rotate: '180deg'}],
  },
})

export default Styles
