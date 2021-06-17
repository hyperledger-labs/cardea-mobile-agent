import React, {useState, useEffect} from 'react'

import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import DatePicker from 'react-native-date-picker'
import AppHeaderLarge from '../../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../../LoadingOverlay/index.js'
import NextButton from '../../NextButton/index.js'
import AppStyles from '@assets/styles'
import Styles from './styles'
import {trimObjectStrings} from '../../../../utils/objects'

function PassportInfo(props) {
  const [country, setCountry] = useState(''),
    [abbr, setAbbr] = useState(''),
    [passNum, setPassNum] = useState(''),
    [expiry, setExpiry] = useState(null),
    [showPicker, setShowPicker] = useState(false),
    [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false),
    [expiryDate, setExpiryDate] = useState()

  //Auto population
  useEffect(() => {
    if (typeof props.passportData.nationality !== 'undefined') {
      if (props.passportData.nationality.full) {
        setCountry(props.passportData.nationality.full)
      }
      if (props.passportData.nationality.abbr) {
        setAbbr(props.passportData.nationality.abbr)
      }
      if (props.passportData.documentNumber) {
        setPassNum(props.passportData.documentNumber)
      }
    }
    setExpiryDate(getExpiryDate())
  }, [])

  //Next button mechanisms
  const [nextButtonActive, setNextButtonActive] = useState(false)

  const proceedCall = () => {
    //Component pre-continue checks
    Keyboard.dismiss()

    setLoadingOverlayVisible(true)

    let eDay = expiryDate.getDate().toString(),
      eMonth = (expiryDate.getMonth() + 1).toString(),
      eYear = expiryDate.getFullYear().toString()

    //Ensure that days and months are two characters
    if (eDay.length < 2) eDay = `0${eDay}`
    if (eMonth.length < 2) eMonth = `0${eMonth}`

    const newPassportData = {
      ...props.passportData,
      nationality: {
        abbr: abbr,
        full: country,
      },
      expiry: {
        day: +eDay, //DD
        month: +eMonth, //MM
        original: +`${eYear.slice(-2)}${eMonth}${eDay}`, //YYMMDD
        year: +eYear, //YYYY
      },
      documentNumber: passNum,
    }
    props.setPassportData(newPassportData)
    setLoadingOverlayVisible(false)
    props.setSetupData({
      ...props.setupData,
      PassportData: trimObjectStrings(newPassportData),
    })
    props.incrementScreen()
  }

  useEffect(() => {
    if (abbr && country && passNum && expiry) {
      setNextButtonActive(true)
    } else {
      setNextButtonActive(false)
    }
  }, [country, passNum, expiry])

  const createDate = (year) => {
    let date = new Date()
    date.setFullYear(date.getFullYear() - year)
    return date
  }

  const getExpiryDate = () => {
    let date = new Date()
    console.log('passportData:', props.passportData)
    if (typeof props.passportData.nationality !== 'undefined') {
      if (props.passportData.expiry.year) {
        date.setFullYear(props.passportData.expiry.year)
        date.setMonth(props.passportData.expiry.month + 1)
        date.setDate(props.passportData.expiry.day)
      }
    } else {
      date = createDate(-2)
    }
    setExpiry(date)
    return date
  }

  let numInput, codeInput

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <AppHeaderLarge disabled={true} avoidKeyboard={true} />
          <View style={AppStyles.tab}>
            <View
              style={[
                AppStyles.flexView,
                AppStyles.barBlue,
                AppStyles.marginBottomMd,
              ]}>
              <Text
                style={[
                  AppStyles.textBold,
                  AppStyles.h3,
                  AppStyles.textBlue,
                  AppStyles.textCenter,
                ]}>
                Visitor's Passport
              </Text>
            </View>

            <View
              style={[
                AppStyles.flexView,
                AppStyles.alignEnd,
                AppStyles.sideMargin,
                AppStyles.marginBottomSm,
                AppStyles.spaceBetween,
              ]}>
              <Text
                style={[
                  AppStyles.h3,
                  AppStyles.textPrimary,
                  AppStyles.textUpper,
                  AppStyles.textLeft,
                  {flex: 1},
                ]}>
                Country of Issuance
              </Text>
              <View style={AppStyles.labelContainer}>
                <TextInput
                  style={AppStyles.formLabel}
                  value={country}
                  onChangeText={(cName) => setCountry(cName)}
                  onSubmitEditing={() => {
                    codeInput.focus()
                  }}
                />
              </View>
            </View>
            <View
              style={[
                AppStyles.flexView,
                AppStyles.alignEnd,
                AppStyles.sideMargin,
                AppStyles.marginBottomSm,
                AppStyles.spaceBetween,
              ]}>
              <Text
                style={[
                  AppStyles.h3,
                  AppStyles.textPrimary,
                  AppStyles.textUpper,
                  AppStyles.textLeft,
                  {flex: 1},
                ]}>
                Code
              </Text>
              <View style={(AppStyles.labelContainer, {width: 100})}>
                <TextInput
                  style={AppStyles.formLabel}
                  value={abbr}
                  onChangeText={(cName) => setAbbr(cName)}
                  ref={(input) => {
                    codeInput = input
                  }}
                  onSubmitEditing={() => {
                    numInput.focus()
                  }}
                />
              </View>
            </View>
            <View
              style={[
                AppStyles.flexView,
                AppStyles.alignEnd,
                AppStyles.sideMargin,
                AppStyles.marginBottomSm,
                AppStyles.spaceBetween,
              ]}>
              <Text
                style={[
                  AppStyles.h3,
                  AppStyles.textPrimary,
                  AppStyles.textUpper,
                  AppStyles.textLeft,
                  {flex: 1},
                ]}>
                Passport Number
              </Text>
              <View style={AppStyles.labelContainer}>
                <TextInput
                  style={AppStyles.formLabel}
                  value={passNum}
                  onChangeText={(cName) => setPassNum(cName)}
                  ref={(input) => {
                    numInput = input
                  }}
                  onSubmitEditing={() => {
                    Keyboard.dismiss()
                  }}
                />
              </View>
            </View>
            <View
              style={[
                AppStyles.flexView,
                AppStyles.alignEnd,
                AppStyles.sideMargin,
                AppStyles.spaceBetween,
                AppStyles.marginBottomMd,
              ]}>
              <Text
                style={[
                  AppStyles.h3,
                  AppStyles.textPrimary,
                  AppStyles.textUpper,
                  AppStyles.textLeft,
                  {flex: 1},
                ]}>
                Expires
              </Text>
              <TouchableOpacity
                style={Styles.picker}
                onPress={() => setShowPicker(true)}>
                {expiry ? (
                  <Text style={[Styles.pickerText, AppStyles.textPrimary]}>
                    {expiry.toString().slice(4, 15)}
                  </Text>
                ) : (
                  <Text style={Styles.pickerText}>Select a date...</Text>
                )}
              </TouchableOpacity>
            </View>
            <NextButton active={nextButtonActive} continue={proceedCall} />
          </View>
          {loadingOverlayVisible ? <LoadingOverlay /> : null}
        </View>
      </TouchableWithoutFeedback>
      {showPicker ? (
        <TouchableOpacity
          style={Styles.opaqueScreen}
          onPress={() => {
            setShowPicker(false)
            setExpiry(expiryDate)
          }}>
          <DatePicker
            date={expiryDate}
            mode="date"
            onDateChange={(expiryDate) => {
              setExpiryDate(expiryDate)
            }}
            style={Styles.datePicker}
            maximumDate={createDate(-49)}
            minimumDate={createDate(10)}
          />
        </TouchableOpacity>
      ) : null}
    </>
  )
}

export default PassportInfo
