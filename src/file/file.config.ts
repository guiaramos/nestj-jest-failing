import { Injectable } from '@nestjs/common';

@Injectable()
export class FileConfig {
  public region = process.env.AWS_REGION;
  public accessKeyId = process.env.S3_ACCESS_KEY_ID;
  public secretAccessKey = process.env.S3_SECRET_KEY;
  public ACL: 'public-read';
  public Expire: 500;
}
