import type express from 'express'
import { type ErrorCode, ErrorCode as ErrorCodes } from 'playlist-generator-utilities'

export function sendSuccess<T>(res: express.Response, data: T, status = 200) {
  res.status(status).json({ success: true, data })
}

export function sendError(res: express.Response, errorCode: ErrorCode, status: number) {
  res.status(status).json({ success: false, errorCode })
}

export function sendBadRequest(res: express.Response, errorCode: ErrorCode = ErrorCodes.INVALID_INPUT) {
  sendError(res, errorCode, 400)
}

export function sendInternalError(res: express.Response) {
  sendError(res, ErrorCodes.INTERNAL_ERROR, 500)
}
