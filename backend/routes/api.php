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

Route::get('projects/trending', 'ProjectController@trending');
Route::get('projects/new', 'ProjectController@newest');
Route::get('projects/random', 'ProjectController@discovery');
Route::get('search/{data}', 'ProjectController@search');

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

    Route::get('projects/{uuid}', 'ProjectController@get');
    Route::get('projects', 'ProjectController@getall');
    Route::get('projects/user/{id}', 'ProjectController@getspecific');
    Route::get('projects/dislike/{uuid}', 'ProjectController@dislike');
    Route::get('projects/like/{uuid}', 'ProjectController@like');
    Route::post('projects', 'ProjectController@add');
    Route::put('projects/{uuid}', 'ProjectController@edit');
    Route::put('projects/editcode/{uuid}', 'ProjectController@editcode');
    Route::delete('projects/{uuid}', 'ProjectController@delete');
    Route::post('projects/compile/{id}', 'ProjectController@compile');
});

