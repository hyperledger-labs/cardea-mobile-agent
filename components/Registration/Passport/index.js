import React, {useState, useEffect} from 'react'
import {Route, useHistory, useRouteMatch, Switch} from 'react-router-native'
import PassportPhoto from './PassportPhoto/index.js'
import PassportConfirm from './PassportConfirm/index.js'
import PassportUserInfo from './PassportUserInfo/index.js'
import PassportInfo from './PassportInfo/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'

function Passport(props) {
  const [passportData, setPassportData] = useState({})
  let history = useHistory()
  let {path, url} = useRouteMatch()
  useEffect(() => {
    history.push(`${path}/scan`)
  }, [])
  console.log('Passport index: ', path)
  return (
    <Switch>
      <Route exact path={`${path}/scan`}>
        <PassportPhoto setPassportData={setPassportData} route={{path, url}} />
      </Route>
      <Route exact path={`${path}/verify`}>
        <PassportConfirm
          passportData={passportData}
          setPassportData={setPassportData}
          incrementScreen={props.incrementScreen}
          setupData={props.setupData}
          setSetupData={props.setSetupData}
          route={{path, url}}
        />
      </Route>
      <Route exact path={`${path}/userInfo`}>
        <PassportUserInfo
          passportData={passportData}
          setPassportData={setPassportData}
          route={{path, url}}
        />
      </Route>
      <Route exact path={`${path}/passportInfo`}>
        <PassportInfo
          passportData={passportData}
          setPassportData={setPassportData}
          incrementScreen={props.incrementScreen}
          setupData={props.setupData}
          setSetupData={props.setSetupData}
        />
      </Route>
      <Route path={`${path}/`}>
        {console.log(history.location)}
        <LoadingOverlay />
      </Route>
    </Switch>
  )
}

export default Passport
