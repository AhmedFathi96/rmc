import { EMAILEmailClient } from './smtpEmailClient'

export class EmailFactory {
  static createEmailClient(type: 'EMAIL'): EMAILEmailClient {
    switch (type) {
      case 'EMAIL':
        return new EMAILEmailClient()
      default:
        throw new Error('Unsupported email client type')
    }
  }
}
