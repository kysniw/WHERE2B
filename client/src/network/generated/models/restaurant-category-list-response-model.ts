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


import { RestaurantCategoryModel } from './restaurant-category-model';

/**
 * 
 * @export
 * @interface RestaurantCategoryListResponseModel
 */
export interface RestaurantCategoryListResponseModel {
    /**
     * 
     * @type {number}
     * @memberof RestaurantCategoryListResponseModel
     */
    'count': number;
    /**
     * 
     * @type {string}
     * @memberof RestaurantCategoryListResponseModel
     */
    'next'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof RestaurantCategoryListResponseModel
     */
    'previous'?: string | null;
    /**
     * 
     * @type {Array<RestaurantCategoryModel>}
     * @memberof RestaurantCategoryListResponseModel
     */
    'results': Array<RestaurantCategoryModel>;
}

