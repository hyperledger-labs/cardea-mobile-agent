import React, { createContext, Dispatch, useReducer } from 'react'

import { State } from '../types/state'

import reducer, { ReducerAction } from './reducer'

const initialState: State = {
  onboarding: {
    DidAgreeToTerms: false,
    DidCompleteTutorial: false,
    DidCreatePIN: false,
  },
  error: null,
}

export const Context = createContext<[State, Dispatch<ReducerAction>]>([
  initialState,
  () => {
    return
  },
])

const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}

export default StoreProvider
