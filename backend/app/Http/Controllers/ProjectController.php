<?php

namespace App\Http\Controllers;

use App\Like;
use App\Project;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class ProjectController extends Controller
{

    public function getRom($id)
    {
        $location = base_path() . '/storage/app/roms/' . $id . '.rom';
        $file = File::get($location);

        return $file;
    }

    public function compile(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'data' => ['required']
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $location = base_path() . '/storage/app/roms/' . $id . '.rom';

        $file = fopen($location, 'wb+');
        $string = '';
        foreach ($request->data as $int) {
            $string .= chr($int);
        }
        var_dump($string);
        fwrite($file, $string);
        fclose($file);

        return response()->json('', 200);
    }

    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255']
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $project = new Project();
        $project->user_id = $user->id;
        $project->uuid = str_replace('-', '', Uuid::generate(4));
        $project->name = $request->name;
        $project->code = "";
        $project->likes = 0;
        $project->author = $user->name;
        $project->description = $request->description;
        $project->save();

        $base = base_path() . '/storage/app/roms/default.rom';
        $location = base_path() . '/storage/app/roms/' . $project->uuid . '.rom';
        \File::copy($base, $location);
        return response()->json(compact('project'), 200);
    }

    public function edit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255']
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $project = Project::where('uuid', $request->uuid)->first();
        if (!$project) {
            return response()->json('', 404);
        }
        if ($project->user_id != $user->id) {
            return response()->json('', 403);
        }
        $project->name = $request->name;
        $project->description = $request->description;
        $project->save();
        return response()->json(compact('project'), 200);
    }

    public function editcode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => ['required', 'string']
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $project = Project::where('uuid', $request->uuid)->first();
        if (!$project) {
            return response()->json('', 404);
        }
        if ($project->user_id != $user->id) {
            return response()->json('', 403);
        }
        $project->code = $request->code;
        $project->save();
        return response()->json(compact('project'), 200);
    }

    public function delete($uuid)
    {
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $project = Project::where('uuid', $uuid)->first();
        if (!$project) {
            return response()->json('', 404);
        }
        if ($project->user_id != $user->id) {
            return response()->json('', 403);
        }
        $project->delete();
        return response()->json('', 200);
    }

    public function getspecific($id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return response()->json('', 404);
        }
        $projects = $user->projects()->orderBy('created_at', 'desc')->get();
        return response()->json(compact('projects'), 200);
    }

    public function getall()
    {
        $projects = Project::all();
        if (!$projects) {
            return response()->json('', 404);
        }
        return response()->json(compact('projects'), 200);
    }

    public function get($uuid)
    {
        $project = Project::where('uuid', $uuid)->first();
        if (!$project) {
            return response()->json('', 404);
        }
        return response()->json(compact('project'), 200);
    }

    public function like($uuid)
    {
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $project = Project::where('uuid', $uuid)->first();
        $like1 = Like::where('user_id', $user->id)->where('project_uuid', $project->uuid)->first();
        if ($like1) {
            return response()->json('', 401);
        }
        $like = new Like();
        $like->user_id = $user->id;
        $like->project_uuid = $project->uuid;
        $like->save();
        $project->likes = $project->likes + 1;
        $project->save();

        return response()->json('', 200);
    }

    public function dislike($uuid)
    {
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $project = Project::where('uuid', $uuid)->first();
        $like = Like::where('user_id', $user->id)->where('project_uuid', $project->uuid)->first();
        if (!$like) {
            return response()->json('', 404);
        }
        $like->delete();
        $project->likes = $project->likes - 1;
        $project->save();

        return response()->json('', 200);
    }

    public function trending()
    {
        $projects = Project::all()->sortByDesc('likes')->take(10)->values();
        return response()->json(compact('projects'), 200);
    }

    public function newest()
    {
        $projects = Project::all()->sortByDesc('created_at')->take(10)->values();
        return response()->json(compact('projects'), 200);
    }

    public function discovery()
    {
        $c = Project::all()->count();
        if ($c > 10) {
            $c = 10;
        }
        $projects = Project::all()->random($c)->values();
        return response()->json(compact('projects'), 200);
    }

    public function search($data)
    {
        $projects = Project::where('name', 'like', "%{$data}%")->orWhere('description', 'like', "%{$data}%")->get();
        $users = User::where('name', 'like', "%{$data}%")->orWhere('email', 'like', "%{$data}%")->get();
        $response = [];
        $response['projects'] = $projects;
        $response['users'] = $users;
        return response()->json(compact('response'), 200);
    }
}


