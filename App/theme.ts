import {StyleSheet} from 'react-native'

type BaseColor = Record<string, string>

export const borderRadius = 4
export const heavyOpacity = 0.7
export const lightOpacity = 0.35
export const zeroOpacity = 0.0

export const BaseColors: BaseColor = {
  black: '#000000',
  darkBlue: '#003366',
  darkBlueLightTransparent: `rgba(0, 51, 102, ${heavyOpacity})`,
  darkBlueHeavyTransparent: `rgba(0, 51, 102, ${lightOpacity})`,
  darkGreen: '#35823F',
  darkGreenLightTransparent: `rgba(53, 130, 63, ${heavyOpacity})`,
  darkGreenHeavyTransparent: `rgba(53, 130, 63, ${lightOpacity})`,
  darkOrange: '#FAA220',
  darkOrangeLightTransparent: `rgba(250, 162, 32, ${heavyOpacity})`,
  darkOrangeHeavyTransparent: `rgba(250, 162, 32, ${lightOpacity})`,
  darkGrey: '#1C1C1E',
  darkGreyAlt: '#313132',
  green: '#2D6E35',
  lightBlue: '#759ECD',
  lightGrey: '#D3D3D3',
  lightGreyAlt: '#F2F2F2',
  mediumBlue: '#B9CEDE',
  offWhite: '#F2F2F2',
  red: '#DE3333',
  transparent: `rgba(0, 0, 0, ${zeroOpacity})`,
  yellow: '#FCBA19',
  white: '#FFFFFF',
}

export const StatusColors: BaseColor = {
  error: BaseColors.red,
  info: BaseColors.black,
  success: BaseColors.green,
  warning: BaseColors.black,
}

interface ColorTheme extends BaseColor {
  accent: string
  background: string
  backgroundLight: string
  borderLight: string
  primary: string
  primaryActive: string
  shadow: string
  text: string
}

interface FontAttributes {
  fontSize: number
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
  color: string
}

interface TextTheme {
  headingOne: FontAttributes
  headingTwo: FontAttributes
  headingThree: FontAttributes
  headingFour: FontAttributes
  normal: FontAttributes
  label: FontAttributes
  caption: FontAttributes
}

interface CredentialTheme {
  background: string
}

interface CredentialOfferTheme {
  background: string
}

interface ContactTheme {
  background: string
}

interface ModularViewTheme {
  background: string
}

interface ProofRequestTheme {
  background: string
}

interface SettingsTheme {
  background: string
}

interface SingleSelectBlockTheme {
  background: string
}

interface TextBoxTheme {
  background: string
  border: string
  text: string
}

export const Colors: ColorTheme = {
  accent: BaseColors.lightBlue,
  background: BaseColors.white,
  backgroundLight: BaseColors.lightGrey,
  borderLight: BaseColors.darkOrangeLightTransparent,
  primary: BaseColors.darkOrange,
  primaryActive: BaseColors.darkOrangeHeavyTransparent,
  shadow: BaseColors.darkGrey,
  text: BaseColors.black,
  ...BaseColors,
  ...StatusColors,
}

export const CredentialTheme: CredentialTheme = {
  background: Colors.offWhite,
}

export const CredentialOfferTheme: CredentialOfferTheme = {
  background: Colors.lightGrey,
}

export const ContactTheme: ContactTheme = {
  background: Colors.offWhite,
}

export const ModularViewTheme: ModularViewTheme = {
  background: Colors.offWhite,
}

export const ProofRequestTheme: ProofRequestTheme = {
  background: Colors.lightGrey,
}

export const SettingsTheme: SettingsTheme = {
  background: Colors.offWhite,
}

export const SingleSelectBlockTheme: SingleSelectBlockTheme = {
  background: Colors.offWhite,
}

export const TextBoxTheme: TextBoxTheme = {
  background: Colors.darkOrangeLightTransparent,
  border: Colors.borderLight,
  text: Colors.text,
}

export const TextTheme: TextTheme = {
  headingOne: {
    fontSize: 38,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headingTwo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headingThree: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headingFour: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Colors.text,
  },
  normal: {
    fontSize: 18,
    fontWeight: 'normal',
    color: Colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.text,
  },
}

export const Buttons = StyleSheet.create({
  primary: {
    padding: 16,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  primaryDisabled: {
    padding: 16,
    borderRadius: 4,
    backgroundColor: Colors.darkOrangeHeavyTransparent,
  },
  primaryText: {
    ...TextTheme.normal,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  primaryTextDisabled: {
    ...TextTheme.normal,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  secondary: {
    padding: 16,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  secondaryDisabled: {
    padding: 16,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.darkOrangeLightTransparent,
    backgroundColor: Colors.white,
  },
  secondaryText: {
    ...TextTheme.normal,
    fontWeight: 'bold',
    color: Colors.blue,
    textAlign: 'center',
  },
  secondaryTextDisabled: {
    ...TextTheme.normal,
    fontWeight: 'bold',
    color: Colors.lightBlue,
    textAlign: 'center',
  },
})
