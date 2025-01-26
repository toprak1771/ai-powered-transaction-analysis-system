import multer from "multer";
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export interface MulterInterface {
    fsCreateModule(filePath:string):void;
    storageFile(subPath:string):multer.StorageEngine;
    uploadFiles(subPath:string):void;
    handleArrayUploadFile(req:ExpressRequest,res:ExpressResponse,subPath:string):Promise<any>;
}
