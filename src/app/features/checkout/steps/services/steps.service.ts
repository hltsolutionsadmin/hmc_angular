import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment/environment';
import { UserAddressResponse } from '../models/adress.model';
import { CityDto, CreateUserAddressRequest, PagedResponse, StateDto } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class StepsService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getMyAddresses(page: number = 0, size: number = 10): Observable<UserAddressResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<UserAddressResponse>(
      `${this.baseUrl}/api/users/me/addresses`,
      { params }
    );
  }

  createMyAddress(payload: CreateUserAddressRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/users/me/addresses`, payload);
  }

  getStates(): Observable<StateDto[]> {
    return this.http.get<StateDto[]>(`${this.baseUrl}/api/states`);
  }

  getCities(page: number = 0, size: number = 1000): Observable<PagedResponse<CityDto>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PagedResponse<CityDto>>(`${this.baseUrl}/api/cities`, { params });
  }

}
