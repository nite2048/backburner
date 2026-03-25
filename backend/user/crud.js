import express from "express";
import {acquireMetadata, handleApiCalls, closestMatch, deepMergeObjects, reconcileObjectData} from '../ai/genai.js'
import {createItem, findItemsByUserId } from "../database/db.js";
import {saveBase64String} from '../database/storage.js'

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
         response.status(200).json(savedDbEntry)
    } catch (error) {
        response.send(error.message)
        next(error)
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
     try {
          let metaData = await acquireMetadata(base64ImageFile);
          let browse = await handleApiCalls(metaData);
          let closest = await closestMatch(metaData, browse);
          let mergedData = deepMergeObjects(metaData, closest);
          let finalResult = reconcileObjectData(mergedData, metaData.category);
          return finalResult; // The properties with the same name are overridden

     } catch (error) {
          console.error("error in handlePostReq:", error);
          throw error;
     }
}

export default router