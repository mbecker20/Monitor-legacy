import { Schema } from 'mongoose'

export const TimestampSchema = new Schema({
  time: String,
  date: String
})

export const LogSchema = new Schema({
  stdout: String,
  stderr: String
})

export const ConversionSchema = new Schema({
  local: String,
  container: String
})

export const VolumeSchema = new Schema({
  local: String,
  container: String,
  useSystemRoot: Boolean,
})

export const ScriptSchema = new Schema({
  name: String,
  script: String
})

export const EnvSchema = new Schema({
  variable: String,
  value: String
})