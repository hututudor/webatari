<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Commentlike;
use App\Project;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Webpatser\Uuid\Uuid;

class CommentController extends Controller
{
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => ['required', 'string', 'max:511']
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $project = Project::where('id', $request->id)->first();
        if (!$project) {
            return response()->json('', 404);
        }

        $comment = new Comment();
        $comment->user_id = $user->id;
        $comment->project_id = $request->id;
        $comment->likes = 0;
        $comment->description = $request->description;
        $comment->save();

        return response()->json(compact('comment'), 200);
    }

    public function edit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => ['required', 'string', 'max:511']
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }

        $comment = Comment::where('id', $request->id)->first();
        if (!$comment) {
            return response()->json('', 404);
        }
        if ($comment->user_id != $user->id) {
            return response()->json('', 403);
        }

        $comment->description = $request->description;
        $comment->edited     = 1;
        $comment->save();

        return response()->json(compact('comment'), 200);
    }

    public function userget($id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return response()->json('', 404);
        }

        $comments = $user->comments()->orderBy('created_at', 'desc')->get();

        return response()->json(compact('comments'), 200);
    }

    public function projectget($uuid)
    {
        $project = Project::where('uuid', $uuid)->first();
        if (!$project) {
            return response()->json('', 404);
        }

        $comments = $project->comments()->orderBy('created_at', 'desc')->get();

        return response()->json(compact('comments'), 200);
    }

    public function get($id)
    {
        $comment = Comment::where('id', $id)->first();
        if (!$comment) {
            return response()->json('', 404);
        }

        return response()->json(compact('comment'), 200);
    }

    public function like($id)
    {
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }

        $comment = Comment::where('id', $id)->first();
        $like1 = Commentlike::where('user_id', $user->id)->where('comment_id', $comment->id)->first();
        if ($like1) {
            return response()->json('', 401);
        }
        $like = new Commentlike();
        $like->user_id = $user->id;
        $like->comment_id = $comment->id;
        $like->save();
        $comment->likes = $comment->likes + 1;
        $comment->save();

        $creator_id = $comment->user_id;
        $creator = User::where('id', $creator_id)->first();
        $creator->likes =  $creator->likes+1;
        $creator->save();

        return response()->json('', 200);
    }

    public function dislike($id)
    {
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }

        $comment = Comment::where('id', $id)->first();
        $like = Commentlike::where('user_id', $user->id)->where('comment_id', $comment->id)->first();
        if (!$like) {
            return response()->json('', 404);
        }
        $like->delete();
        $comment->likes = $comment->likes - 1;
        $comment->save();

        $creator_id = $comment->user_id;
        $creator = User::where('id', $creator_id)->first();
        $creator->likes =  $creator->likes-1;
        $creator->save();

        return response()->json('', 200);
    }

    public function delete($id)
    {
        $user = AuthController::getUser();
        if (!$user) {
            return response()->json('', 404);
        }
        $comment = Comment::where('id', $id)->first();
        if (!$comment) {
            return response()->json('', 404);
        }
        if ($comment->user_id != $user->id) {
            return response()->json('', 403);
        }

        $creator_id = $comment->user_id;
        $creator = User::where('id', $creator_id)->first();
        $creator->likes = $creator->likes - $comment->likes;
        $creator->save();

        $comment->delete();
        return response()->json('', 200);

    }
}
