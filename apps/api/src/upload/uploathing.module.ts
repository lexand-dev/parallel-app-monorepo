import { Module, Global, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../config/env';
import { UTApi } from 'uploadthing/server';

export const UTAPI_TOKEN = 'UTAPI_TOKEN';
export const injectUtapi = () => Inject(UTAPI_TOKEN);

const utapiProvider = {
  provide: UTAPI_TOKEN,
  useFactory: (config: ConfigService<ConfigType>) => {
    const uploadingApiToken = config.get('UPLOADING_API_TOKEN');
    return new UTApi({
      token: uploadingApiToken,
    });
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [utapiProvider],
  exports: [UTAPI_TOKEN],
})
export class UploadThingModule {}
