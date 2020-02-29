<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', 'AuthController@register');
Route::post('login', 'AuthController@authenticate');

// middleware for auth-only routes
Route::group(['middleware' => ['jwt.verify']], function() {

    Route::group(['middleware' => ['admin']], function() {
        Route::delete('user/{id}', 'UserController@delete');
    });

    Route::get('user', 'AuthController@getAuthenticatedUser');
    Route::post('user', 'UserController@changeName');
    Route::put('user', 'UserController@changePass');
    Route::delete('user', 'UserController@deleteSelf');
    Route::get('users', 'UserController@getall');
});
