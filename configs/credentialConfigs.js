export const Schemas = {
  LabOrder: 'RuuJwd3JMffNwZ43DcJKN1:2:Lab_Order:1.4',
  LabResult: 'RuuJwd3JMffNwZ43DcJKN1:2:Lab_Result:1.4',
  TrustedTraveler: 'RuuJwd3JMffNwZ43DcJKN1:2:Trusted_Traveler:1.4',
  Vaccination: 'RuuJwd3JMffNwZ43DcJKN1:2:Vaccination:1.4',
  VaccinationExemption: 'RuuJwd3JMffNwZ43DcJKN1:2:Vaccine_Exemption:1.4',
}

const credentialConfigs = {
  [Schemas.LabOrder]: {
    credentialName: 'Health Test Record',
  },
  [Schemas.LabResult]: {
    credentialName: 'Health Test Result',
  },
  [Schemas.TrustedTraveler]: {
    credentialName: 'Happy Traveler Card',
  },
  [Schemas.Vaccination]: {
    credentialName: 'Health Vaccination Record',
  },
  [Schemas.VaccinationExemption]: {
    credentialName: 'Health Vaccination Exemption Record',
  },
}

export default credentialConfigs
