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

Route::get('user/{id}', 'UserController@get');
Route::post('register', 'AuthController@register');
Route::post('login', 'AuthController@authenticate');

Route::get('pop', 'ProjectController@projectofthedaysim');
Route::get('potd', 'ProjectController@projectofthedayshow');

Route::get('projects/trending', 'ProjectController@trending');
Route::get('projects/new', 'ProjectController@newest');
Route::get('projects/random', 'ProjectController@discovery');
Route::get('search/{data}', 'ProjectController@search');

Route::get('projects/{uuid}', 'ProjectController@get');
Route::get('projects', 'ProjectController@getall');
Route::get('projects/user/{id}', 'ProjectController@getspecific');

Route::get('comments/project/{uuid}', 'CommentController@projectget');
Route::get('comments/user/{id}', 'CommentController@userget');
Route::get('comments/{id}', 'CommentController@get');

// middleware for auth-only routes
Route::group(['middleware' => ['jwt.verify']], function () {

    Route::group(['middleware' => ['admin']], function () {
        Route::delete('user/{id}', 'UserController@delete');
    });

    Route::get('user', 'AuthController@getAuthenticatedUser');
    Route::post('user', 'UserController@changeName');
    Route::put('user', 'UserController@changePass');
    Route::delete('user', 'UserController@deleteSelf');
    Route::get('users', 'UserController@getall');

    Route::get('projects/dislike/{uuid}', 'ProjectController@dislike');
    Route::get('projects/like/{uuid}', 'ProjectController@like');
    Route::post('projects', 'ProjectController@add');
    Route::put('projects/{uuid}', 'ProjectController@edit');
    Route::put('projects/editcode/{uuid}', 'ProjectController@editcode');
    Route::delete('projects/{uuid}', 'ProjectController@delete');
    Route::post('projects/compile/{id}', 'ProjectController@compile');

    Route::get('comments/dislike/{id}', 'CommentController@dislike');
    Route::get('comments/like/{id}', 'CommentController@like');
    Route::post('comments', 'CommentController@add');
    Route::put('comments/{id}', 'CommentController@edit');
    Route::delete('comments/{id}', 'CommentController@delete');
});

