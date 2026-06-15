export enum ConfigConstants {
  LOG_LEVEL = 'LOG_LEVEL',
}

// Adicionei essas constantes para evitar o uso de strings "mágicas" espalhadas pelo código, facilitando a manutenção e evitando erros
export enum LogConstants {
  LOG = 'log',
  WARN = 'warn',
  DEBUG = 'debug',
  ERROR = 'error',
  VERBOSE = 'verbose',
}
