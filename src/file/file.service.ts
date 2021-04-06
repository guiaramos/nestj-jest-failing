import { Inject, Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-errors';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ERRORS } from 'src/common/constants';
import { FileConfig } from 'src/file/file.config';
import { File } from 'src/file/entities/file.entity';
import { FileEnum } from './../common/shared/file-type';
import { CreateFileLinkInput } from './dto/create-file-link.input';

@Injectable()
export class FileService {
  private s3: S3;
  private Bucket: string;

  constructor(@Inject('FileConfig') private readonly fileConfig: FileConfig) {
    this.s3 = new S3();
    this.s3.config.update({
      region: this.fileConfig.region,
      accessKeyId: this.fileConfig.accessKeyId,
      secretAccessKey: this.fileConfig.secretAccessKey,
    });
    this.Bucket = process.env.S3_BUCKET_NAME;
  }

  createPresignedUrl(createFileLinkInput: CreateFileLinkInput): Promise<File> {
    const { name, type, extension } = createFileLinkInput;
    const key = this.generateKey(name, type);
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', this.getParams(key, extension), (err, data) => {
        if (err) return reject(new ApolloError(ERRORS.FILE.LINK, ERRORS.CODE.SMTH_WENT_WRONG, err));
        return resolve({ url: data, fileUrl: this.getFileUrl(key), name });
      });
    });
  }

  getParams(generateKey: string, extension: string) {
    const params = {
      Bucket: this.Bucket,
      generateKey,
      Expires: this.fileConfig.Expire,
      ContentType: extension,
      ACL: this.fileConfig.ACL,
    };
    return params;
  }

  getFileUrl(key: string): string {
    return `https://${this.Bucket}.s3.amazonaws.com/${key}`;
  }

  generateKey(fileName: string, type: FileEnum): string {
    const yyyy = new Date().getFullYear();
    const mm = new Date().getMonth() + 1;
    const dd = new Date().getDate();
    const hashKey = uuidv4();
    return `${type}/${yyyy}/${mm}/${dd}/${hashKey}/${fileName}`;
  }
}
