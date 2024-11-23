import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { TokenResponseDto } from './dtos/token-response.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpMethod } from 'src/enums/http-methods.enum';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class KeycloakService {
	private token: string;

	constructor(private readonly jwtService: JwtService) {}

	public async generateKeycloakToken(): Promise<string> {
		const tokenResponse: AxiosResponse<TokenResponseDto, unknown> =
			await axios.post(
				`${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
				new URLSearchParams({
					grant_type: 'client_credentials',
					client_id: process.env.KEYCLOAK_CLIENT_ID,
					client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
				}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			);

		this.token = tokenResponse.data.access_token;

		return tokenResponse.data.access_token;
	}

	async requestToKeycloak({
		url,
		method,
		data,
		headers,
	}: {
		url: string;
		method: HttpMethod;
		headers?: object;
		data?: object;
	}) {
		if (
			!this.token ||
			this.jwtService.decode(this.token).exp * 1000 - Date.now() < 60000
		)
			await this.generateKeycloakToken();

		return axios.request({
			method,
			url,
			data,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.token}`,
				...headers,
			},
		});
	}

	async createUser({
		username,
		email,
		firstName,
		lastName,
		enabled,
	}: CreateUserDto) {
		return await this.requestToKeycloak({
			url: `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
			method: HttpMethod.POST,
			data: {
				username,
				email,
				firstName,
				lastName,
				enabled: enabled ?? true,
			},
		});
	}

	async deleteUser(userId: string) {
		return await this.requestToKeycloak({
			url: `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
			method: HttpMethod.DELETE,
		});
	}
}
