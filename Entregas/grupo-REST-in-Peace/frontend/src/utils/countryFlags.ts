const fifaToFlagCode: Record<string, string> = {
  ARG: 'ar',
  AUS: 'au',
  BEL: 'be',
  BRA: 'br',
  CAN: 'ca',
  CMR: 'cm',
  CRC: 'cr',
  CRO: 'hr',
  DEN: 'dk',
  ECU: 'ec',
  ENG: 'gb-eng',
  ESP: 'es',
  FRA: 'fr',
  GER: 'de',
  GHA: 'gh',
  IRN: 'ir',
  JPN: 'jp',
  KOR: 'kr',
  KSA: 'sa',
  MAR: 'ma',
  MEX: 'mx',
  NED: 'nl',
  POL: 'pl',
  POR: 'pt',
  QAT: 'qa',
  SEN: 'sn',
  SRB: 'rs',
  SUI: 'ch',
  TUN: 'tn',
  URU: 'uy',
  USA: 'us',
  WAL: 'gb-wls',
}

export function getFlagUrl(teamCode?: string) {
  if (!teamCode) return null
  const flagCode = fifaToFlagCode[teamCode.toUpperCase()]
  return flagCode ? `https://flagcdn.com/${flagCode}.svg` : null
}
