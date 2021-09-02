export const Schemas = {
  LabOrder: 'QiPGTNiyXnS218AoTK8h39:2:Lab_Order:1.2',
  LabResult: 'QiPGTNiyXnS218AoTK8h39:2:Lab_Result:1.1',
  TrustedTraveler: 'X2JpGAqC7ZFY4hwKG6kLw9:2:Trusted_Traveler:1.0',
  Vaccination: 'QiPGTNiyXnS218AoTK8h39:2:Vaccination:1.2',
  VaccinationExemption: 'QiPGTNiyXnS218AoTK8h39:2:Vaccine_Exemption:1.1',
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
