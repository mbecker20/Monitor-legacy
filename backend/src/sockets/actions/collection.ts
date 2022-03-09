import WebSocket from "ws"
import { broadcast } from "../../main"
import CollectionManager from "../../schema/Collection"
import { Collection } from "../../types/collections"
import { sendErrorOverWS } from "../websocket"

const CREATE_COLLECTION = 'CREATE_COLLECTION'
const DELETE_COLLECTION = 'DELETE_COLLECTION'
const ADD_TO_COLLECTION = 'ADD_TO_COLLECTION'
const REMOVE_FROM_COLLECTION = 'REMOVE_FROM_COLLECTION'

async function collectionActions(ws: WebSocket, message, type: string, userID: string) {
  switch (type) {
    case CREATE_COLLECTION:
      try {
        const collection = await CollectionManager.create({ name: message.name, userID, deploymentIDs: [], buildIDs: [] })
        const id = collection._id.toHexString()
        broadcast('/', CREATE_COLLECTION, { collection, collectionID: id, userID })
      } catch (error) {
        sendErrorOverWS(ws, 'Create collection failed server-side', error)
      }
      return true

    case DELETE_COLLECTION:
      try {
        const toDelete = await CollectionManager.findByIdAndDelete(message.collectionID) as any as Collection
        broadcast('/', DELETE_COLLECTION, { collectionID: message.collectionID, userID, name: toDelete.name })
      } catch (error) {
        sendErrorOverWS(ws, 'Delete collection failed server-side', error)
      }
      return true

    case ADD_TO_COLLECTION:
      try {
        const { collectionID, deploymentID, buildID } = message
        if (deploymentID) {
          await CollectionManager.updateOne({ _id: collectionID }, { $push: { deploymentIDs: deploymentID } })
          broadcast('/', ADD_TO_COLLECTION, { collectionID, deploymentID, userID })
        } else if (buildID) {
          await CollectionManager.updateOne({ _id: collectionID }, { $push: { buildIDs: buildID } })
          broadcast('/', ADD_TO_COLLECTION, { collectionID, buildID, userID })
        }
        
      } catch (error) {
        sendErrorOverWS(ws, 'Add to collection failed server-side', error)
      }
      return true
    
    case REMOVE_FROM_COLLECTION:
      try {
        const { collectionID, deploymentID, buildID } = message
        if (deploymentID) {
          await CollectionManager.updateOne({ _id: collectionID }, { $pull: { deploymentIDs: deploymentID } })
          broadcast('/', REMOVE_FROM_COLLECTION, { collectionID, deploymentID, userID })
        } else if (buildID) {
          await CollectionManager.updateOne({ _id: collectionID }, { $pull: { buildIDs: buildID } })
          broadcast('/', REMOVE_FROM_COLLECTION, { collectionID, buildID, userID })
        }
      } catch (error) {
        sendErrorOverWS(ws, 'Remove from collection failed server-side', error)
      }
      return true

    default:
      return false
  }
}

export default collectionActions