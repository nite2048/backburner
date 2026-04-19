import express from "express";
import {acquireMetadata, handleApiCalls, closestMatch, deepMergeObjects, reconcileObjectData} from '../ai/genai.js'
import { withAIRetry, withAPIRetry, withRetry } from '../ai/utils.js'
import {createItem, findItemsByUserId, findItem } from "../database/db.js";
import {saveBase64String} from '../database/storage.js'

function mapErrorToResponse(error) {
     const stepInfo = error.failedStep ? ` (Failed at: ${error.failedStep})` : ""

     if (error.name === "AbortError" || error.message.includes("timeout")) {
          return {
               statusCode: 504,
               message: `Request took too long. Please try again.${stepInfo}`
          }
     }

     if (error.message.includes("fetch failed") || error.code === "UND_ERR_CONNECT_TIMEOUT") {
          return {
               statusCode: 503,
               message: `Unable to reach external service. Please check your connection.${stepInfo}`
          }
     }

     if (error.message.includes("No search results found") || error.message.includes("No results found")) {
          return {
               statusCode: 404,
               message: `No matching content found for this image.${stepInfo}`
          }
     }

     if (error.statusCode >= 500) {
          return {
               statusCode: 502,
               message: `External service error. Please try again later.${stepInfo}`
          }
     }

     return {
          statusCode: 500,
          message: error.message || `An unexpected error occurred.${stepInfo}`
     }
}

const router = express.Router();
router.use(express.json({ limit: "120mb" }));

router.post('/upload', async (request, response, next) => {
    try {
         if(!request.user.id) {
             response.status(401).json({ error: 'Unauthorized' });
             return;
         }
         if(!request.body.data) {
             response.status(400).json({ error: 'No data provided' });
             return;
         }

         const save = saveBase64String(request.body.filename, request.body.data);
         const data = await acquireImageData(save.base64)
         const savedDbEntry = await createItem(request.user.id, data);
         
         const entryToSend = await findItem(savedDbEntry.id)
         c
         
         response.status(200).json(entryToSend)
     } catch (error) {
          const { statusCode, message } = mapErrorToResponse(error)
          response.status(statusCode).json({ error: message })
     }
});


router.get('/getAll', async (request, response) => {
    try {
         if(!request.user.id) {
             response.status(401).json({ error: 'Unauthorized' });
             return;
         }
        const items = await findItemsByUserId(request.user.id);
        response.status(200).json(items);
    } catch (error) {
        response.status(500).json({ error: `Internal server error: [${error.message}]` });
    }
});



async function acquireImageData(base64ImageFile) {
     let metaData
     let browse
     let closest
     let mergedData
     let finalResult

     try {
          metaData = await withAPIRetry(() => acquireMetadata(base64ImageFile))
     } catch (error) {
          console.error("✗ Step 1/5 Failed: acquireMetadata()", {
               message: error.message,
               name: error.name,
               code: error.code,
               attempts: error.attempts || 1
          })
          error.failedStep = "acquireMetadata"
          throw error
     }

     try {
          browse = await withAPIRetry(() => handleApiCalls(metaData))
     } catch (error) {
          console.error("✗ Step 2/5 Failed: handleApiCalls()", {
               message: error.message,
               name: error.name,
               code: error.code,
               attempts: error.attempts || 1,
               metadata: metaData
          })
          error.failedStep = "handleApiCalls"
          throw error
     }

     try {
          closest = await withAIRetry(() => closestMatch(metaData, browse))
     } catch (error) {
          console.error("✗ Step 3/5 Failed: closestMatch()", {
               message: error.message,
               name: error.name,
               code: error.code,
               attempts: error.attempts || 1,
               metadataCount: browse?.length || 0
          })
          error.failedStep = "closestMatch"
          throw error
     }

     try {
          mergedData = await withRetry(() => Promise.resolve(deepMergeObjects(metaData, closest)))
     } catch (error) {
          console.error("✗ Step 4/5 Failed: deepMergeObjects()", {
               message: error.message,
               name: error.name
          })
          error.failedStep = "deepMergeObjects"
          throw error
     }

     try {
          finalResult = await withRetry(() => Promise.resolve(reconcileObjectData(mergedData, metaData.category)))
          return finalResult
     } catch (error) {
          console.error("✗ Step 5/5 Failed: reconcileObjectData()", {
               message: error.message,
               name: error.name,
               category: metaData?.category
          })
          error.failedStep = "reconcileObjectData"
          throw error
     }
}

export default router