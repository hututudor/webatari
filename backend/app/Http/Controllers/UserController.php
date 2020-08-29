<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use phpDocumentor\Reflection\Project;

class UserController extends Controller
{
    public function changePass(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => ['required', 'string', 'max:255'],
            'new' => ['required', 'string', 'max:255']
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        if (!Hash::check($request->password, $user->password)) {
            return response()->json('', 403);
        }
        $user->password = Hash::make($request->new);
        $user->save();
        return response()->json('', 200);
    }

    public function changeName(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255']
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        if($request->email != $user->email) {
            if(User::where('email', $request->email)->first()) {
                return response()->json('', 401);
            }
        }
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();
        return response()->json(array(['name' => $user->name, 'email' => $user->email]), 200);
    }


    public function delete($id)
    {
        $admin = AuthController::getUser();
        if (!$admin) {
            return response()->json('', 404);
        }
        if ($admin->admin != 1) {
            return response()->json('', 404);
        }
        $user = User::where('id', $id)->first();
        if (!$user) {
            return response()->json('', 404);
        }
        $user->delete();
        return response()->json('', 200);
    }

    public function deleteSelf()
    {
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $user->delete();
        return response()->json('', 200);
    }

    public function getall()
    {
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $users = User::all();
        return response()->json(compact('users'), 200);
    }

    public function get($id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return response()->json('', 404);
        }
        return response()->json(compact('user'), 200);
    }

    public function Leaderboard(){
        $sort = User::all()->sortByDesc('likes')->take(10)->values();
        return response()->json(compact('sort'), 200);
    }

}
