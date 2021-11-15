/* tslint:disable */
/* eslint-disable */
/**
 * WHERE2B API
 * Super projekt
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { BookingModel } from '../models';
// @ts-ignore
import { CreateBookingModel } from '../models';
// @ts-ignore
import { UpdateBookingModel } from '../models';
/**
 * BookingsApi - axios parameter creator
 * @export
 */
export const BookingsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {CreateBookingModel} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingCreate: async (data: CreateBookingModel, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('bookingCreate', 'data', data)
            const localVarPath = `/bookings/booking/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingDelete: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('bookingDelete', 'id', id)
            const localVarPath = `/bookings/booking/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {UpdateBookingModel} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingPartialUpdate: async (id: number, data: UpdateBookingModel, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('bookingPartialUpdate', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('bookingPartialUpdate', 'data', data)
            const localVarPath = `/bookings/booking/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingRead: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('bookingRead', 'id', id)
            const localVarPath = `/bookings/booking/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {UpdateBookingModel} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingUpdate: async (id: number, data: UpdateBookingModel, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('bookingUpdate', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('bookingUpdate', 'data', data)
            const localVarPath = `/bookings/booking/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} date 
         * @param {string} peopleCount 
         * @param {string} restaurantId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listAvailableSeatsRead: async (date: string, peopleCount: string, restaurantId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'date' is not null or undefined
            assertParamExists('listAvailableSeatsRead', 'date', date)
            // verify required parameter 'peopleCount' is not null or undefined
            assertParamExists('listAvailableSeatsRead', 'peopleCount', peopleCount)
            // verify required parameter 'restaurantId' is not null or undefined
            assertParamExists('listAvailableSeatsRead', 'restaurantId', restaurantId)
            const localVarPath = `/bookings/list-available-seats/{restaurant_id}/{date}/{people_count}/`
                .replace(`{${"date"}}`, encodeURIComponent(String(date)))
                .replace(`{${"people_count"}}`, encodeURIComponent(String(peopleCount)))
                .replace(`{${"restaurant_id"}}`, encodeURIComponent(String(restaurantId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} restaurantId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listBookingsRead: async (restaurantId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'restaurantId' is not null or undefined
            assertParamExists('listBookingsRead', 'restaurantId', restaurantId)
            const localVarPath = `/bookings/list-bookings/{restaurant_id}/`
                .replace(`{${"restaurant_id"}}`, encodeURIComponent(String(restaurantId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * BookingsApi - functional programming interface
 * @export
 */
export const BookingsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = BookingsApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {CreateBookingModel} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bookingCreate(data: CreateBookingModel, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BookingModel>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.bookingCreate(data, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bookingDelete(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.bookingDelete(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {UpdateBookingModel} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bookingPartialUpdate(id: number, data: UpdateBookingModel, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UpdateBookingModel>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.bookingPartialUpdate(id, data, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bookingRead(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BookingModel>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.bookingRead(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {UpdateBookingModel} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bookingUpdate(id: number, data: UpdateBookingModel, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UpdateBookingModel>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.bookingUpdate(id, data, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} date 
         * @param {string} peopleCount 
         * @param {string} restaurantId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listAvailableSeatsRead(date: string, peopleCount: string, restaurantId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BookingModel>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listAvailableSeatsRead(date, peopleCount, restaurantId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} restaurantId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listBookingsRead(restaurantId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BookingModel>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listBookingsRead(restaurantId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * BookingsApi - factory interface
 * @export
 */
export const BookingsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = BookingsApiFp(configuration)
    return {
        /**
         * 
         * @param {CreateBookingModel} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingCreate(data: CreateBookingModel, options?: any): AxiosPromise<BookingModel> {
            return localVarFp.bookingCreate(data, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingDelete(id: number, options?: any): AxiosPromise<void> {
            return localVarFp.bookingDelete(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {UpdateBookingModel} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingPartialUpdate(id: number, data: UpdateBookingModel, options?: any): AxiosPromise<UpdateBookingModel> {
            return localVarFp.bookingPartialUpdate(id, data, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingRead(id: number, options?: any): AxiosPromise<BookingModel> {
            return localVarFp.bookingRead(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id A unique integer value identifying this booking.
         * @param {UpdateBookingModel} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bookingUpdate(id: number, data: UpdateBookingModel, options?: any): AxiosPromise<UpdateBookingModel> {
            return localVarFp.bookingUpdate(id, data, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} date 
         * @param {string} peopleCount 
         * @param {string} restaurantId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listAvailableSeatsRead(date: string, peopleCount: string, restaurantId: string, options?: any): AxiosPromise<BookingModel> {
            return localVarFp.listAvailableSeatsRead(date, peopleCount, restaurantId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} restaurantId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listBookingsRead(restaurantId: string, options?: any): AxiosPromise<BookingModel> {
            return localVarFp.listBookingsRead(restaurantId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * BookingsApi - object-oriented interface
 * @export
 * @class BookingsApi
 * @extends {BaseAPI}
 */
export class BookingsApi extends BaseAPI {
    /**
     * 
     * @param {CreateBookingModel} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BookingsApi
     */
    public bookingCreate(data: CreateBookingModel, options?: AxiosRequestConfig) {
        return BookingsApiFp(this.configuration).bookingCreate(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id A unique integer value identifying this booking.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BookingsApi
     */
    public bookingDelete(id: number, options?: AxiosRequestConfig) {
        return BookingsApiFp(this.configuration).bookingDelete(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id A unique integer value identifying this booking.
     * @param {UpdateBookingModel} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BookingsApi
     */
    public bookingPartialUpdate(id: number, data: UpdateBookingModel, options?: AxiosRequestConfig) {
        return BookingsApiFp(this.configuration).bookingPartialUpdate(id, data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id A unique integer value identifying this booking.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BookingsApi
     */
    public bookingRead(id: number, options?: AxiosRequestConfig) {
        return BookingsApiFp(this.configuration).bookingRead(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id A unique integer value identifying this booking.
     * @param {UpdateBookingModel} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BookingsApi
     */
    public bookingUpdate(id: number, data: UpdateBookingModel, options?: AxiosRequestConfig) {
        return BookingsApiFp(this.configuration).bookingUpdate(id, data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} date 
     * @param {string} peopleCount 
     * @param {string} restaurantId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BookingsApi
     */
    public listAvailableSeatsRead(date: string, peopleCount: string, restaurantId: string, options?: AxiosRequestConfig) {
        return BookingsApiFp(this.configuration).listAvailableSeatsRead(date, peopleCount, restaurantId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} restaurantId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BookingsApi
     */
    public listBookingsRead(restaurantId: string, options?: AxiosRequestConfig) {
        return BookingsApiFp(this.configuration).listBookingsRead(restaurantId, options).then((request) => request(this.axios, this.basePath));
    }
}
