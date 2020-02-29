<?php

namespace App\Http\Middleware;

use App\Http\Controllers\AuthController;
use Closure;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = AuthController::getUser();
        if(!$user) {
            return response()->json('', 404);
        }
        if($user->admin != 1){
            return response()->json('', 404);
        }
        return $next($request);
    }
}
