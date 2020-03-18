#  WebAtari
> Combining modern web interaction with old-school Atari 2600 programming

## About
This app was build for the 2020 FiiCode contest by Hutu Tudor and Baroncea Andrei.
The purpose of this app is to provide an enjoying environment for the retro-lovers who want to build and play Atari 2600 games.

## How to install
This app is build with Laravel for the backend and React for the frontend.
We recommend you use the deployed version of this app at [Webatari](http://webatari.tudorhutu.ro) because there you can see some example projects.
If you want to install this app on your machine you will have to meet the [Laravel requirements](https://laravel.com/docs/7.x/installation#server-requirements).

You also need to clone this repo and do the following steps:

Execute the following in the backend folder:
- cp .env.example .env
- Edit the .env file to match your database configuration
- composer install
- php artisan jwt:secret
- php artisan key:gen
- php artisan migrate:fresh
- php artisan serve

Execute in the frontend folder:
- npm install
- npm start

## Technologies used
- Laravel
- React, without an UI Library (The CSS is written from scratch)
- Javatari (an open-source web emulator for Atari 2600)

## Explaining some decisions we have taken

#### Why is the font pixelated?
We did this to match our retro-styling and to improve the immersion a user will experince

#### Why I cannot view this on my mobile phone
The website is built to match the specs from 1990s, and back then there were no mobile phones

## How to use this app

First of all, you should create an account. You can easily do this by clicking register button.
After that, you can like other projects you see on the main screen, or search a user or a project.
If you want to have your own project, you need to go to your profile by hovering over your name in the navbar and pressing the Profile button. Then all you have to do is to click on the Create project button.
By having a project, you can edit its code. To save the code you need to use the save button. You can also edit and delete it. If you click on the Run button, your code will be compiled and a new tab containing your project will be opened at http://javatari.org.
You can look at other people's projects and you can like them by clicking the hearth icon.
If you do not know Atari Assembly language, you can use some test games from here: https://github.com/johnidm/asm-atari-2600 (the .asm files).
We hope you will have a great time while using the app!


## Contribuitors
- Hutu Tudor - frontend
- Baroncea Andrei - backend
