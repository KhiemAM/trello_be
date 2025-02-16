const SibApiV35dk = require('@getbrevo/brevo')
import { env } from '~/config/environment'

let apiInstance = new SibApiV35dk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  let sendSmtpEmail = new SibApiV35dk.SendSmtpEmail()
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }
  sendSmtpEmail.to = [{ email: recipientEmail }]
  sendSmtpEmail.subject = customSubject
  sendSmtpEmail.htmlContent = htmlContent

  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}