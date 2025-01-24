import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
	private readonly logger = new Logger(CloudinaryService.name);

	uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
		return new Promise<CloudinaryResponse>((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				(error, result) => {
					if (error) {
						this.logger.error(
							`Error uploading file to Cloudinary: ${error.message}`,
						);

						return reject(new Error(error.message));
					}
					resolve(result);
				},
			);

			streamifier.createReadStream(file.buffer).pipe(uploadStream);
		});
	}

	deleteFile(publicId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			cloudinary.uploader.destroy(publicId, (error) => {
				if (error) {
					this.logger.error(
						`Error deleting file from Cloudinary: ${error.message}`,
					);

					return reject(new Error(error.message));
				}
				resolve();
			});
		});
	}
}
