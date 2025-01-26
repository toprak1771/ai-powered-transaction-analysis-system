import multer, { StorageEngine } from "multer";
import { MulterInterface } from "./interfaces/multer.interface";
import * as path from "path";
import * as fs from "fs";
import { Request, Response } from 'express';

export class Multer implements MulterInterface {
    public uploadFilePath = path.resolve(__dirname,"../..","public/uploads")

    fsCreateModule(filePath: string): void {
        try {
            fs.accessSync(filePath);
        } catch (error:any) {
            fs.mkdirSync(filePath,{recursive:true})
        }
    }

    storageFile(subPath: string): StorageEngine {
        const outputPath = path.join(this.uploadFilePath,subPath);
        this.fsCreateModule(outputPath)
        return multer.diskStorage({
            destination(
                req:Request,
                file:Express.Multer.File,
                fn:(error:Error | null,filename:string) => void
            ) : void {
                fn(null,outputPath)
            },
            filename(
                req:Request,
                file:Express.Multer.File,
                fn:(error:Error | null,filename:string) => void 
            ):void {
                fn(
                    null,
                    `${new Date().getTime().toString()}-${file.fieldname}${path.extname(
                      file.originalname
                    )}`
                  ); 
            }
        })
        
    }

    uploadFiles = (subPath: string) =>
        multer({
          storage: this.storageFile(subPath),
          // fileFilter(req, file, callback) {
          //   const extension: boolean =
          //     [
          //       ".png",
          //       ".jpg",
          //       ".jpeg",
          //       ".pdf",
          //       ".msword",
          //       ".vnd.openxmlformats-officedocument.wordprocessingml.document",
          //     ].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
          //   const mimeType: boolean =
          //     [
          //       "image/png",
          //       "image/jpg",
          //       "image/jpeg",
          //       "application/pdf",
          //       "application/msword",
          //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          //     ].indexOf(file.mimetype) >= 0;
      
          //   if (extension && mimeType) {
          //     return callback(null, true);
          //   }
      
          //   callback(new Error("invalid file type.Only Png,Jpg,Jpeg,Pdf,Docx,Doc"));
          // },
        }).array("files");

    async handleArrayUploadFile(req: Request, res: Response, subPath: string): Promise<any> {
        return new Promise((resolve,reject):void => {
            const upload = this.uploadFiles(subPath);
            upload(req,res,(error:any) => {
                if(error) {
                    console.log("error handleArrayUploadFile:",error.message);
                    reject(error); 
                }

                resolve({files:req.files,body:req.body})
            });
        });
    };
    
};