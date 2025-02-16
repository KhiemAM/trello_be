import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'

const createNew = async (reqBody) => {
  try {
    //Check email is existed
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email is already taken')
    }

    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewuser = await userModel.findOneById(createdUser.insertedId)

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewuser.email}&token=${getNewuser.verifyToken}`
    const customSubject = 'Trello - Verify your email address'
    const htmlContent = `
      <h3>Hi ${getNewuser.displayName},</h3>
      <p>Thank you for signing up for Trello! You're almost ready to start using your account. Please click the link below to verify your email address.</p>
      <a href="${verificationLink}">Verify your email address</a>
      <p>If you didn't sign up for Trello, you can safely ignore this email.</p>
      <p>Thanks,</p>
      <p>The Trello team</p>
    `
    await BrevoProvider.sendEmail(getNewuser.email, customSubject, htmlContent)

    return pickUser(getNewuser)
  } catch (error) {
    throw new Error(error)
  }
}

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is already verified')
    if (existUser.verifyToken !== reqBody.token) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid token')

    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const result = await userModel.update(existUser._id, updateData)

    return pickUser(result)
  } catch (error) {
    throw new Error(error)
  }
}

const login = async (reqBody) => {
  try {
    //
  } catch (error) {
    throw new Error(error)
  }
}


export const userService = {
  createNew,
  verifyAccount,
  login
}