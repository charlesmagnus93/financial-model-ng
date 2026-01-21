import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generic HTTP request method with automatic token handling
   * @param method HTTP method (GET, POST, PUT, DELETE, PATCH)
   * @param path API endpoint path (without base URL)
   * @param data Request body data (for POST, PUT, PATCH)
   * @param params Query parameters
   * @param headers Additional headers
   * @returns Observable with API response
   */
  request<T = any>(
    method: HttpMethod,
    path: string,
    data?: any,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Observable<T> {
    // Build URL
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;

    let httpHeaders = new HttpHeaders();

    // Add custom headers
    if (headers) {
      Object.keys(headers).forEach((key) => {
        httpHeaders = httpHeaders.set(key, headers[key]);
      });
    }
    // format body data as x-www-form-urlencoded if content type is set accordingly
    // let body: any = data;
    // if (data) {
    //   body = new URLSearchParams(data).toString();
    // }

    // Set content type for requests with body
    if (data && !httpHeaders.has('Content-Type')) {
      httpHeaders = httpHeaders.set('Content-Type', 'application/json');
      // httpHeaders = httpHeaders.set(
      //   'Content-Type',
      //   'application/x-www-form-urlencoded'
      // );
    }

    // Build query parameters
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    // Make the request based on method
    const options = {
      headers: httpHeaders,
      params: httpParams,
    };

    switch (method) {
      case 'GET':
        return this.http.get<T>(url, options);
      case 'POST':
        // console.log('POST request to:', url, 'with data:', body, 'and options:', options);
        return this.http.post<T>(url, data, options);
      case 'PUT':
        return this.http.put<T>(url, data, options);
      case 'PATCH':
        return this.http.patch<T>(url, data, options);
      case 'DELETE':
        return this.http.delete<T>(url, options);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  /**
   * Convenience method for GET requests
   */
  get<T = any>(
    path: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Observable<T> {
    return this.request<T>('GET', path, undefined, params, headers);
  }

  /**
   * Convenience method for POST requests
   */
  post<T = any>(
    path: string,
    data?: any,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Observable<T> {
    return this.request<T>('POST', path, data, params, headers);
  }

  postBlob(
    path: string,
    data?: any,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Observable<Blob> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;

    let httpHeaders = new HttpHeaders();

    if (headers) {
      Object.keys(headers).forEach((key) => {
        httpHeaders = httpHeaders.set(key, headers[key]);
      });
    }

    if (data && !httpHeaders.has('Content-Type')) {
      httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    }

    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.post(url, data, {
      headers: httpHeaders,
      params: httpParams,
      responseType: 'blob',
    });
  }

  /**
   * Convenience method for PUT requests
   */
  put<T = any>(
    path: string,
    data?: any,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Observable<T> {
    return this.request<T>('PUT', path, data, params, headers);
  }

  /**
   * Convenience method for PATCH requests
   */
  patch<T = any>(
    path: string,
    data?: any,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Observable<T> {
    return this.request<T>('PATCH', path, data, params, headers);
  }

  /**
   * Convenience method for DELETE requests
   */
  delete<T = any>(
    path: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Observable<T> {
    return this.request<T>('DELETE', path, undefined, params, headers);
  }

  /**
   * Set base URL for API calls
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Get current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}
