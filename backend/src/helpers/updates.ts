import { Types } from "mongoose"
import { broadcast } from "../main"
import UpdateManager from "../schema/Update"
import { timestamp } from "./general"

const ADD_UPDATE = 'ADD_UPDATE'

export async function addBuildUpdate(
  buildID: Types.ObjectId, 
  operation: string,
  command: string, 
  log: Log, 
  operator: string, 
  note = '', 
  isError = false
) {
  const _id = new Types.ObjectId()
  const protoOp = {
    buildID, operation, timestamp: timestamp(), command, log, operator, note, isError
  }
  const op = {
    _id, ...protoOp
  }
  await UpdateManager.create(op)
  broadcast('/', ADD_UPDATE, { update: op, updateID: op._id.toHexString() })
}

export async function addDeploymentUpdate(
  deploymentID: Types.ObjectId, 
  operation: string,
  command: string, 
  log: Log, 
  operator: string, 
  note = '',
  isError = false
) {
  const _id = new Types.ObjectId()
  const protoOp = {
    deploymentID, operation, timestamp: timestamp(), command, log, operator, note, isError
  }
  const op = {
    _id, ...protoOp
  }
  await UpdateManager.create(op)
  broadcast('/', ADD_UPDATE, { update: op, updateID: op._id.toHexString() })
}

export async function addServerUpdate(
  serverID: Types.ObjectId, 
  operation: string,
  command: string, 
  log: Log, 
  operator: string, 
  note = '', 
  isError = false
) {
  const _id = new Types.ObjectId()
  const protoOp = {
    serverID, operation, timestamp: timestamp(), command, log, operator, note, isError
  }
  await UpdateManager.create({ _id, ...protoOp })
  const update = { _id: _id.toHexString(), ...protoOp }
  broadcast('/', ADD_UPDATE, { update, updateID: update._id })
}

export async function addSystemUpdate(
  operation: string, 
  command: string,
  log: Log, 
  operator: string, 
  note = '', 
  isError = false
) {
  const _id = new Types.ObjectId()
  const protoOp = {
    operation, timestamp: timestamp(), command, log, operator, note, isError, 
  }
  await UpdateManager.create({ ...protoOp, _id })
  const update = { ...protoOp, _id: _id.toHexString() }
  broadcast('/', ADD_UPDATE, { update, updateID: update._id })
}